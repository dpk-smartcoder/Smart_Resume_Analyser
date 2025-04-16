import re
import nltk
import docx
import pdfplumber
import pandas as pd
df=pd.read_csv('job.csv')
job_headings_list = [
    "advertiserurl",
    # "company",
    "employmenttype_jobstatus",
    "jobdescription",
    "jobid",
    "joblocation_address",
    # "jobtitle",
    "postdate",
    "shift",
    "site_name",
    # "skills",
    "uniq_id"
]
df=df.drop(columns=job_headings_list)
print(df.head())
nltk.download('punkt')
SKILLS_KEYWORDS = [
    "python", "java", "c#", "c++", "c", "javascript", "typescript", "php", "ruby", "swift", "kotlin","linux","unix","windows","ms-office","msoffice",
    "go", "rust", "scala", "perl", "objective-c", "groovy", "lua", "haskell", "erlang", "clojure", "f#",
    "visual basic", ".net", "assembly language", "dart", "elixir",
    "shell scripting", "bash", "zsh", "ksh", "powershell", "vbscript", "applescript",
    "html", "html5", "css", "css3", "sass", "less", "javascript (es6+)",
    "react", "angular", "vue.js", "svelte", "jquery", "bootstrap", "tailwind css", "webpack", "babel", "vite",
    "frontend build tools", "web performance optimization", "cross-browser compatibility", "responsive web design",
    "node.js", "express.js", "django", "flask", "fastapi", "spring", "spring boot", "java ee (jakarta ee)",
    "asp.net", "asp.net core", "ruby on rails", "laravel", "symfony", "phoenix",
    "api design", "restful apis", "graphql", "microservices architecture", "serverless computing", "websockets",
    "ios development", "android development", "react native", "flutter", "swiftui", "jetpack compose", "xamarin",
    "mobile ui/ux design", "mobile testing", "app store deployment",
    "sql", "nosql", "database design", "database administration (dba)", "data modeling", "query optimization",
    "mysql", "postgresql", "sqlite", "microsoft sql server", "oracle database",
    "mongodb", "cassandra", "redis", "couchbase", "dynamodb", "elasticsearch", "firebase", "neo4j",
    "docker", "kubernetes", "containerization", "orchestration",
    "aws", "amazon web services", "azure", "microsoft azure", "google cloud platform (gcp)", "oracle cloud (oci)", "ibm cloud", "heroku", "digitalocean",
    "ci/cd", "continuous integration", "continuous deployment", "jenkins", "gitlab ci", "github actions", "circleci", "travis ci", "azure devops",
    "infrastructure as code (iac)", "terraform", "ansible", "puppet", "chef", "cloudformation", "azure resource manager (arm)",
    "monitoring", "logging", "observability", "prometheus", "grafana", "datadog", "splunk", "elk stack",
    "site reliability engineering (sre)", "system administration", "linux administration", "windows server administration",
    "network administration", "network security", "tcp/ip", "dns", "http/https", "load balancing", "firewalls",
    "git", "github", "gitlab", "bitbucket", "svn", "mercurial", "version control systems",
    "agile", "scrum", "kanban", "lean", "waterfall", "devops", "devsecops",
    "software development life cycle (sdlc)", "object-oriented programming (oop)", "functional programming",
    "design patterns", "software architecture", "clean code", "refactoring",
    "testing", "unit testing", "integration testing", "end-to-end testing", "manual testing", "automated testing",
    "test-driven development (tdd)", "behavior-driven development (bdd)", "selenium", "cypress", "jest", "pytest", "junit",
    "debugging", "code review", "performance tuning", "security testing", "penetration testing",
    "algorithms", "data structures", "computational complexity", "distributed systems", "operating systems", "computer networks",
    "cybersecurity", "information security", "network security", "application security", "cloud security",
    "penetration testing", "vulnerability assessment", "ethical hacking",
    "siem", "incident response", "digital forensics", "cryptography", "identity and access management (iam)", "compliance (e.g., iso 27001, soc 2, gdpr, hipaa)",
    "hardware engineering", "embedded systems", "microcontrollers", "arduino", "raspberry pi", "fpga", "verilog", "vhdl", "circuit design", "pcb design", "firmware development", "iot (internet of things)",
    "data analysis", "quantitative analysis", "qualitative analysis", "statistical analysis", "statistical modeling", "hypothesis testing", "a/b testing",
    "machine learning", "deep learning", "supervised learning", "unsupervised learning", "reinforcement learning",
    "natural language processing (nlp)", "computer vision", "speech recognition",
    "data mining", "pattern recognition", "predictive modeling", "forecasting",
    "data visualization", "dashboarding", "reporting",
    "python (for data science)", "pandas", "numpy", "scipy", "scikit-learn", "statsmodels",
    "tensorflow", "pytorch", "keras", "mxnet", "theano",
    "r", "tidyverse", "ggplot2", "caret",
    "sql (for data analysis)",
    "spss", "sas", "stata", "matlab",
    "tableau", "power bi", "qlik sense", "looker", "d3.js", "matplotlib", "seaborn", "plotly",
    "excel (advanced)", "google sheets (advanced)",
    "big data technologies", "hadoop", "hdfs", "mapreduce", "apache spark", "pyspark", "spark sql",
    "apache hive", "apache pig", "apache kafka", "apache flink", "apache storm",
    "data warehousing", "data lakes", "etl (extract, transform, load)", "elt", "data pipelines", "airflow",
    "mlops", "model deployment", "model monitoring", "kubeflow", "mlflow",
    "project management", "program management", "portfolio management", "project planning", "risk management", "resource allocation", "budgeting", "scheduling",
    "agile project management", "scrum master", "product owner",
    "business analysis", "requirements gathering", "process mapping", "use case development", "user stories", "business process improvement (bpi)", "six sigma", "lean management",
    "product management", "product strategy", "product roadmap", "market research", "competitive analysis", "user research", "go-to-market strategy",
    "financial analysis", "financial modeling", "forecasting", "valuation", "investment analysis", "corporate finance", "accounting principles (gaap, ifrs)",
    "management", "team leadership", "people management", "mentoring", "coaching", "performance management", "talent acquisition", "employee relations",
    "strategy", "strategic planning", "business development", "operations management", "supply chain management", "logistics", "procurement", "vendor management",
    "change management", "organizational development",
    "risk assessment", "compliance management", "quality assurance (qa)", "quality management systems (qms)",
    "customer relationship management (crm)",
    "sales", "b2b sales", "b2c sales", "enterprise sales", "solution selling", "sales forecasting", "lead generation", "cold calling", "negotiation", "closing techniques", "account management", "crm software (e.g., salesforce, hubspot)",
    "marketing", "digital marketing", "content marketing", "social media marketing (smm)", "search engine optimization (seo)", "search engine marketing (sem)", "pay-per-click (ppc) advertising", "email marketing", "marketing automation",
    "brand management", "public relations (pr)", "market research", "customer segmentation", "marketing analytics", "google analytics", "campaign management", "affiliate marketing", "influencer marketing", "event marketing",
    "accounting", "bookkeeping", "accounts payable", "accounts receivable", "general ledger", "financial reporting", "auditing", "internal audit", "external audit", "taxation", "corporate tax", "personal tax", "payroll",
    "finance", "investment banking", "wealth management", "portfolio management", "financial planning", "risk management (financial)", "actuarial science", "insurance underwriting", "claims processing", "treasury management",
    "human resources (hr)", "recruitment", "talent acquisition", "sourcing", "interviewing", "onboarding", "employee relations", "performance management", "compensation and benefits", "hr policies", "labor law", "hris systems", "training and development", "organizational development",
    "graphic design", "visual design", "typography", "color theory", "layout design", "branding", "logo design",
    "ui design", "user interface design", "ux design", "user experience design", "user research", "usability testing", "wireframing", "prototyping", "information architecture", "interaction design",
    "web design", "mobile design",
    "adobe photoshop", "adobe illustrator", "adobe indesign", "adobe xd", "figma", "sketch", "invision", "zeplin", "canva",
    "video editing", "video production", "storyboarding", "adobe premiere pro", "final cut pro", "davinci resolve", "avid media composer",
    "motion graphics", "animation", "2d animation", "3d animation", "adobe after effects", "blender", "maya", "cinema 4d",
    "photography", "photo editing", "lightroom", "capture one",
    "illustration", "digital painting", "drawing",
    "fashion design", "textile design", "pattern making", "sewing",
    "interior design", "industrial design",
    "sound design", "audio editing", "music production", "pro tools", "logic pro", "ableton live",
    "writing", "creative writing", "technical writing", "copywriting", "editing", "proofreading", "content creation", "content strategy", "blogging", "journalism", "grant writing", "proposal writing", "scriptwriting", "scientific writing", "medical writing", "legal writing",
    "communication", "verbal communication", "written communication", "interpersonal skills", "active listening", "public speaking", "presentation skills", "storytelling", "facilitation", "report writing",
    "negotiation", "conflict resolution", "mediation", "persuasion",
    "customer service", "client relationship management", "technical support", "help desk support", "user support",
    "electrical engineering", "power systems", "control systems", "electronics", "signal processing",
    "mechanical engineering", "thermodynamics", "fluid dynamics", "solid mechanics", "machine design", "hvac design",
    "civil engineering", "structural engineering", "geotechnical engineering", "transportation engineering", "water resources engineering", "construction management",
    "chemical engineering", "process engineering", "material science", "biochemical engineering",
    "aerospace engineering", "aeronautical engineering", "astronautical engineering", "propulsion systems", "aerodynamics",
    "industrial engineering", "operations research", "ergonomics", "manufacturing processes",
    "materials engineering", "nanotechnology",
    "environmental engineering", "sustainability", "renewable energy",
    "biomedical engineering", "bioinstrumentation", "biomechanics",
    "cad (computer-aided design)", "autocad", "solidworks", "catia", "revit", "fusion 360",
    "cam (computer-aided manufacturing)",
    "fea (finite element analysis)", "ansys", "abaqus", "cfd (computational fluid dynamics)",
    "matlab", "simulink", "labview",
    "biology", "molecular biology", "genetics", "microbiology", "ecology", "zoology", "botany", "physiology", "neuroscience",
    "chemistry", "organic chemistry", "inorganic chemistry", "analytical chemistry", "physical chemistry", "biochemistry",
    "physics", "mechanics", "electromagnetism", "quantum mechanics", "thermodynamics", "optics", "astrophysics",
    "mathematics", "calculus", "linear algebra", "differential equations", "probability", "statistics", "discrete mathematics", "numerical analysis",
    "geology", "earth science", "oceanography", "meteorology", "climate science",
    "research methodology", "experimental design", "data collection", "scientific analysis", "literature review", "laboratory techniques", "microscopy", "spectroscopy", "chromatography", "pcr", "cell culture", "field research", "survey design", "statistical software (r, spss, sas)", "scientific writing", "grant writing", "peer review",
    "medicine", "diagnosis", "treatment planning", "surgery", "internal medicine", "pediatrics", "oncology", "cardiology", "neurology", "emergency medicine", "radiology", "pathology", "anesthesiology", "psychiatry", "dermatology", "ophthalmology", "obstetrics & gynecology",
    "nursing", "patient care", "patient assessment", "medication administration", "wound care", "critical care", "pediatric nursing", "geriatric nursing", "mental health nursing", "public health nursing", "electronic health records (ehr/emr)",
    "pharmacy", "pharmacology", "dispensing medication", "patient counseling",
    "dentistry", "dental hygiene", "oral surgery",
    "physical therapy", "rehabilitation", "exercise physiology",
    "occupational therapy",
    "medical technology", "laboratory testing", "phlebotomy", "histology", "radiologic technology",
    "veterinary medicine", "animal care",
    "medical billing", "medical coding (icd-10, cpt)", "healthcare administration", "public health", "epidemiology",
    "paramedic", "emergency medical technician (emt)", "first aid", "cpr",
    "teaching", "pedagogy", "curriculum development", "lesson planning", "instructional design", "classroom management", "student assessment", "differentiated instruction", "educational technology", "e-learning", "learning management systems (lms)", "adult education", "corporate training", "coaching", "mentoring", "special education", "early childhood education", "higher education", "library science",
    "welding", "mig welding", "tig welding", "stick welding", "fabrication",
    "plumbing", "pipefitting",
    "electrical work", "electrician", "wiring", "circuit installation",
    "carpentry", "framing", "finish carpentry", "cabinet making", "woodworking",
    "hvac", "heating, ventilation, and air conditioning", "refrigeration",
    "automotive repair", "mechanic", "engine repair", "diagnostics", "auto body repair",
    "machining", "cnc machining", "lathe operation", "milling machine operation", "metal fabrication", "tool and die making",
    "masonry", "bricklaying", "stonework", "concrete work",
    "painting", "industrial painting", "residential painting",
    "roofing",
    "landscaping", "gardening", "horticulture", "arboriculture",
    "heavy equipment operation", "crane operation", "forklift operation",
    "locksmithing",
    "tailoring", "sewing", "pattern making",
    "cooking", "culinary arts", "baking", "pastry", "food safety", "kitchen management", "bartending", "mixology",
    "english", "spanish", "french", "german", "mandarin chinese", "hindi", "arabic", "portuguese", "bengali", "russian", "japanese", "punjabi", "javanese", "wu chinese", "telugu", "turkish", "korean", "vietnamese", "marathi", "tamil", "italian", "urdu", "polish", "ukrainian", "romanian", "dutch",
    "sign language (e.g., asl, bsl)", "braille",
    "translation", "interpretation", "localization", "linguistics",
    "communication", "written communication", "verbal communication", "presentation skills", "public speaking", "active listening",
    "teamwork", "collaboration", "interpersonal skills",
    "problem-solving", "analytical thinking", "critical thinking", "logical reasoning",
    "creativity", "innovation", "lateral thinking",
    "leadership", "decision-making", "strategic thinking", "delegation", "motivation", "mentorship", "coaching",
    "adaptability", "flexibility", "resilience", "stress management",
    "time management", "organization", "planning", "prioritization",
    "attention to detail", "accuracy",
    "work ethic", "self-motivation", "proactiveness", "discipline", "reliability",
    "emotional intelligence", "empathy", "self-awareness", "social awareness", "relationship management",
    "conflict resolution", "negotiation", "persuasion", "influence",
    "customer focus", "client management",
    "cultural awareness", "diversity and inclusion",
    "learning agility", "curiosity", "openness to feedback",
    "driving", "commercial driving license (cdl)",
    "piloting", "aviation", "air traffic control",
    "maritime operations", "navigation",
    "event planning", "event management",
    "hospitality management", "hotel management", "concierge services",
    "real estate", "property management",
    "agriculture", "farming", "animal husbandry", "soil science",
    "forestry", "conservation",
    "archiving", "library science",
    "museum curation",
    "first aid", "cpr certification",
]
SKILLS_KEYWORDS = sorted(list(set(SKILLS_KEYWORDS)))



def extract_text_from_docx(file_path):
    """Extracts text from a .docx file."""
    try:
        doc = docx.Document(file_path)
        full_text = [para.text for para in doc.paragraphs]
        return '\n'.join(full_text)
    except Exception as e:
        return f"Error extracting from docx: {e}"

def extract_text_from_pdf(file_path):
    """Extracts text from a .pdf file."""
    try:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
            return text
    except Exception as e:
        return f"Error extracting from pdf: {e}"

def extract_sections(text):
    """
    Extracts different sections from the resume text by identifying headings.
    A section continues until the next recognized heading.
    Normalizes section names to handle variations (case-insensitive).
    """
    sections = {}
    section_headings = {
        "summary": ["summary", "professional summary", "career summary", "objective", "about me"],
        "experience": ["experience", "work experience", "professional experience", "employment history"],
        "education": ["education", "qualifications", "academic background"],
        "skills": ["skills", "technical skills", "key skills", "areas of expertise"],
        "projects": ["projects", "personal projects", "portfolio"],
        "certifications": ["certifications", "licenses", "accreditations"],
        "awards": ["awards", "honors", "achievements"]
    }
    heading_map = {}
    for normalized_name, aliases in section_headings.items():
        for alias in aliases:
            heading_map[alias] = normalized_name

    heading_pattern = r"(?i)\b(" + "|".join(heading_map.keys()) + r")\b[:\n\r]*"

    matches = list(re.finditer(heading_pattern, text))

    if not matches:
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
            print(f"Warning: Unrecognized heading '{matched_heading}'")

    return sections

def extract_skills_keywords(text):
    if not text:
        return []

    skills_found = set()
    text_lower = text.lower()
    for skill in SKILLS_KEYWORDS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            skills_found.add(skill) 
    return list(skills_found)

def process_resume(file_path):
    if file_path.lower().endswith('.docx'):
        text = extract_text_from_docx(file_path)
    elif file_path.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_path)
    else:
        return "Unsupported file format."

    if isinstance(text, str):
        sections = extract_sections(text)
        skills_by_section = {}
        for section_name, section_text in sections.items():
            skills_by_section[section_name] = extract_skills_keywords(section_text)
        return skills_by_section
    else:
        return {"error": text}
def getScore(skills_by_section,skills):
    dummyskills=[]
    for i in skills:
        dummyskills.append(i.lower())
    if(dummyskills!=[]):
        print(dummyskills)
    restskills=[]
    for i,j in skills_by_section.items():
        if(i!='Experience' and i!='Projects'):
            restskills.extend(j)
    score=0
    cnt=0
    if(len(dummyskills)>0):
        for i in skills_by_section['experience']:
            if i in dummyskills:
                cnt=cnt+1
        score+=(cnt/len(dummyskills))*0.4
        cnt=0
        for i in skills_by_section['projects']:
            if i in dummyskills:
                cnt=cnt+1
        score+=(cnt/len(dummyskills))*0.3
        cnt=0
        for i in restskills:
            if i in dummyskills:
                cnt=cnt+1
        score+=(cnt/len(dummyskills))*0.2
    if(len(restskills)>0):
        score+=((len(restskills)-cnt)/len(restskills))*0.1
    return score
def getAvgScore(skills_by_section,jobtitle):
    total=0
    cnt=0
    for i,row in df.iterrows():
        if row['jobtitle'] == jobtitle:
            cnt+=1
            soft_skills_str = row.get('skills', '')
            soft_skills_list = [skill.strip().lower() for skill in soft_skills_str.split(',')] if soft_skills_str else []
            job_skills_list = list(set(soft_skills_list))
            total+= getScore(skills_by_section, job_skills_list)
    if(cnt>0):
        total=total/cnt
    return total         
if __name__ == "__main__":
    file_path = "a.pdf"
    result = process_resume(file_path)
    print(result)
    x=getAvgScore(result,'Backend Developer')
    print(x)