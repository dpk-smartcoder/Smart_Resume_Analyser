import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import Word2Vec
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize


# Preprocessing Function
def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    text = re.sub(r'[^a-zA-Z]', ' ', text)  # Remove special characters
    tokens = word_tokenize(text.lower())
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]
    return tokens


# Extract Skills Based on Predefined Dataset
def extract_skills(text_tokens, skill_dataset):
    extracted_skills = [skill for skill in skill_dataset if skill.lower() in text_tokens]
    return extracted_skills


# Score Calculation Using Word2Vec
def calculate_score(extracted_exp_skills, extracted_skills_section, job_description, skill_dataset, weights):
    # Word2Vec Model Training
    all_skills = skill_dataset + job_description.split()
    word2vec_model = Word2Vec(sentences=[all_skills], vector_size=100, min_count=1, workers=3, window=3, sg=1)

    # Calculate Embeddings
    def get_avg_embedding(words):
        embeddings = [word2vec_model.wv[word] for word in words if word in word2vec_model.wv]
        return np.mean(embeddings, axis=0) if embeddings else np.zeros(100)

    exp_embedding = get_avg_embedding(extracted_exp_skills)
    skills_embedding = get_avg_embedding(extracted_skills_section)
    job_embedding = get_avg_embedding(job_description.split())

    # Scoring
    exp_score = cosine_similarity([exp_embedding], [job_embedding])[0][0]
    skills_score = cosine_similarity([skills_embedding], [job_embedding])[0][0]
    alignment_score = cosine_similarity([exp_embedding], [skills_embedding])[0][0]

    final_score = (
        weights['experience_section'] * exp_score +
        weights['skills_section'] * skills_score +
        weights['alignment'] * alignment_score
    )

    return final_score, exp_score, skills_score, alignment_score


# Main Function
if __name__ == "__main__":
    # Enter the content of the resume as a string
    resume_text = """
    Professional experience includes Python programming, data analysis, and machine learning.
    Skilled in problem-solving, teamwork, and collaboration. Expertise in SQL and data visualization.
    """

    job_type = input("Enter the job type (e.g., Data Scientist, Software Developer): ")

    # Job-Specific Skills Dataset
    job_skills = {
        'Data Scientist': ["Python", "Machine Learning", "Data Analysis", "Statistics", "SQL", "Data Visualization"],
        'Software Developer': ["Java", "JavaScript", "React", "Node.js", "Python", "APIs", "Database Management"],
        # Add more job types and their associated skills here.
    }

    skill_dataset = job_skills.get(job_type, [])
    if not skill_dataset:
        print(f"No predefined skills found for the job type '{job_type}'. Please update the dataset.")
        exit()

    # Preprocess the resume and job description
    preprocessed_tokens = preprocess_text(resume_text)
    job_description = input("Enter the job description or keywords for the job type: ").lower()
    job_description_tokens = preprocess_text(job_description)

    # Extract Skills
    exp_skills = extract_skills(preprocessed_tokens, skill_dataset)  # Experience section skills
    skills_section_skills = extract_skills(preprocessed_tokens, skill_dataset)  # Skills section skills

    # Weights
    weights = {
        'experience_section': 0.4,
        'skills_section': 0.3,
        'alignment': 0.2
    }

    # Calculate Scores
    final_score, exp_score, skills_score, alignment_score = calculate_score(
        exp_skills, skills_section_skills, ' '.join(job_description_tokens), skill_dataset, weights
    )

    # Output Results
    print("\n--- Resume Analysis Report ---")
    print("Extracted Experience Section Skills:", exp_skills)
    print("Extracted Skills Section Skills:", skills_section_skills)
    print(f"Experience Section Score: {exp_score:.2f}")
    print(f"Skills Section Score: {skills_score:.2f}")
    print(f"Alignment Score: {alignment_score:.2f}")
    print(f"Final Resume Score: {final_score:.2f}")