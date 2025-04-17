import re
import nltk
import docx
import pdfplumber
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import Word2Vec
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import os
import google.generativeai as genai  # Import the Gemini API library

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)



# Initialize Gemini API
GEMINI_API_KEY = 'AIzaSyBOIaSVJmtLHoWxvnFwz_dcS42KfXuAmM8'
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set.")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt_tab')

df = pd.read_csv('job.csv')
job_headings_list = ["advertiserurl", "employmenttype_jobstatus", "jobid", "joblocation_address", "postdate", "shift", "site_name", "uniq_id"]
df = df.drop(columns=job_headings_list)
print(df.head())

# Preprocessing Function
def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    tokens = word_tokenize(text.lower())
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]
    return tokens

def extract_text_from_docx(file_path):
    try:
        doc = docx.Document(file_path)
        full_text = [para.text for para in doc.paragraphs]
        return '\n'.join(full_text)
    except Exception as e:
        return f"Error extracting from docx: {e}"

def extract_text_from_pdf(file_path):
    try:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
            return text
    except Exception as e:
        return f"Error extracting from pdf: {e}"

def extract_sections(text):
    sections = {}
    section_headings = {"summary": ["summary", "professional summary", "career summary", "objective", "about me"], "experience": ["experience", "work experience", "professional experience", "employment history"], "education": ["education", "qualifications", "academic background"], "skills": ["skills", "technical skills", "key skills", "areas of expertise"], "projects": ["projects", "personal projects", "portfolio"], "certifications": ["certifications", "licenses", "accreditations"], "awards": ["awards", "honors", "achievements"]}
    heading_map = {}
    for normalized_name, aliases in section_headings.items():
        for alias in aliases:
            heading_map[alias] = normalized_name
    heading_pattern = r"(?i)\b(" + "|".join(heading_map.keys()) + r")\b[:\n\r]*"
    matches = list(re.finditer(heading_pattern, text))
    if not matches:
        sections['full_text'] = text.strip()
        return sections
    for i, match in enumerate(matches):
        start_index = match.end()
        end_index = len(text)
        if i + 1 < len(matches):
            end_index = matches[i + 1].start()
        matched_heading = match.group(1).strip().lower()
        normalized_section_name = heading_map.get(matched_heading)
        if normalized_section_name:
            section_content = text[start_index:end_index].strip()
            if normalized_section_name in sections:
                sections[normalized_section_name] += "\n" + section_content
            else:
                sections[normalized_section_name] = section_content
        else:
            if i == 0 and 'summary' not in sections:
                sections['summary'] = text[:start_index].strip()
            else:
                print(f"Warning: Unrecognized heading '{matched_heading}'")
    return sections

def calculate_similarity(section_text, job_description):
    if not section_text or not job_description:
        return 0.0
    section_tokens = preprocess_text(section_text)
    job_tokens = preprocess_text(job_description)
    all_tokens = section_tokens + job_tokens
    if not all_tokens:
        return 0.0
    word2vec_model = Word2Vec(sentences=[all_tokens], vector_size=100, min_count=1, workers=3, window=5, sg=1)
    def get_avg_embedding(tokens):
        embeddings = [word2vec_model.wv[token] for token in tokens if token in word2vec_model.wv]
        return np.mean(embeddings, axis=0) if embeddings else np.zeros(100)
    section_embedding = get_avg_embedding(section_tokens)
    job_embedding = get_avg_embedding(job_tokens)
    if not np.any(section_embedding) or not np.any(job_embedding):
        return 0.0
    similarity_score = cosine_similarity([section_embedding], [job_embedding])[0][0]
    return similarity_score

def process_resume(file_path):
    print(f"Processing file with path: {file_path}")
    text = ""
    if file_path.lower().endswith('.docx'):
        text = extract_text_from_docx(file_path)
        print("Detected .docx file")
    elif file_path.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_path)
        print("Detected .pdf file")
    elif file_path.lower().endswith('.txt'):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
            print("Detected .txt file")
        except Exception as e:
            error_message = f"Error reading TXT file: {e}"
            print(error_message)
            return {"error": error_message, "suggestions": []} # Return empty suggestions on error
    else:
        error_message = "Unsupported file format."
        print(error_message)
        return {"error": error_message, "suggestions": []} # Return empty suggestions on error

    if text:
        sections = extract_sections(text)
        return {"sections": sections, "full_text": text} # Return both sections and full text
    else:
        return {"error": "Could not extract text from file.", "suggestions": []} # Return empty suggestions if no text

def getScore(resume_sections, jobtitle):
    job_description = ""
    for i, row in df.iterrows():
        if row['jobtitle'] == jobtitle:
            job_description = row['jobdescription']
            break
    if not job_description:
        return 0.0
    experience_similarity = resume_sections.get('experience', '')
    projects_similarity = resume_sections.get('projects', '')
    skills_similarity = resume_sections.get('skills', '')
    summary_similarity = resume_sections.get('summary', resume_sections.get('full_text', ''))
    experience_score = calculate_similarity(experience_similarity, job_description)
    projects_score = calculate_similarity(projects_similarity, job_description)
    skills_score = calculate_similarity(skills_similarity, job_description)
    summary_score = calculate_similarity(summary_similarity, job_description)
    final_score = (0.4 * experience_score +
                   0.3 * projects_score +
                   0.2 * skills_score +
                   0.1)
    return final_score

def getAvgScore(resume_data, jobtitle):
    total=0
    cnt=0
    resume_sections = resume_data.get("sections", {})
    for i,row in df.iterrows():
        if row['jobtitle'] == jobtitle:
            cnt+=1
            total+= getScore(resume_sections, jobtitle)
    if(cnt>0):
        total=total/cnt
    return total

@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file provided', 'suggestions': []}), 400
    file = request.files['resume']
    job_title = request.form.get('jobtitle')

    if not job_title:
        return jsonify({'error': 'No job title provided', 'suggestions': []}), 400

    if file.filename == '':
        return jsonify({'error': 'No file selected', 'suggestions': []}), 400

    print(f"Uploaded filename: {file.filename}")
    _, file_extension = os.path.splitext(file.filename)
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            file.save(tmp_file)
            file_path = tmp_file.name
        print(f"Temporary file path: {file_path}")

        resume_data = process_resume(file_path)
        if "error" in resume_data:
            os.unlink(file_path)
            return jsonify({'error': resume_data["error"], 'suggestions': []}), 400

        avg_score = getAvgScore(resume_data, job_title)
        resume_text = resume_data.get("full_text", "")

        # Generate suggestions using Gemini
        prompt = f"Analyze the following resume and provide specific, actionable suggestions for improvement, be very concise and dont give very long sentences give short response:\n\n{resume_text}"
        response = model.generate_content([prompt])
        suggestions_text = response.text
        suggestions = suggestions_text

        os.unlink(file_path)
        return jsonify({'score': avg_score, 'suggestions': suggestions})

    except Exception as e:
        if os.path.exists(file_path):
            os.unlink(file_path)
        return jsonify({'error': str(e), 'suggestions': []}), 500
@app.route('/get-job-categories', methods=['GET'])
def get_job_categories():
    try:
        job_categories = df['jobtitle'].dropna().unique().tolist()
        job_categories.sort()
        return jsonify({"categories": job_categories})
    except Exception as e:
        return jsonify({"error": f"Failed to fetch job categories: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
    app.run(port=5000, debug=True)

    