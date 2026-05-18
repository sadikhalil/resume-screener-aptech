# 🤖 AI Resume Screener

An intelligent resume screening system that automatically parses resumes, extracts candidate information using NLP, matches them against job descriptions, and ranks candidates by a weighted AI-powered score.

---

## 📸 Features

- 📄 **Upload Resumes** — Supports PDF, DOCX, and PPTX formats
- 🧠 **NLP Extraction** — Automatically extracts name, email, phone, skills, education, and experience
- 🎯 **Smart Matching** — Compares resume meaning against job descriptions using AI embeddings
- 📊 **Ranking Score** — Weighted score (0–100) based on 4 criteria
- 📈 **Analytics Dashboard** — Score distribution charts and top candidates overview
- 💼 **Job Management** — Create and manage multiple job descriptions
- 👥 **Candidate Database** — Store and browse all candidate profiles

---

## 🛠️ Tech Stack

### Backend
| Tool | Purpose |
|---|---|
| **FastAPI** | REST API framework |
| **SQLAlchemy** | Database ORM |
| **SQLite** | Database (no installation needed) |
| **spaCy** | Named Entity Recognition (NER) |
| **NLTK** | Text cleaning and tokenization |
| **sentence-transformers** | AI embeddings for semantic matching |
| **scikit-learn** | Cosine similarity scoring |
| **PyMuPDF** | PDF text extraction |
| **python-docx** | DOCX text extraction |
| **python-pptx** | PPTX text extraction |

### Frontend
| Tool | Purpose |
|---|---|
| **React** | UI framework |
| **Vite** | Development server and build tool |
| **React Router** | Page navigation |
| **Axios** | API calls to backend |
| **Recharts** | Charts and data visualization |

---

## 📁 Project Structure

```
resumescreener/
│
├── backend/                         # FastAPI Python backend
│   ├── main.py                      # App entry point
│   ├── config.py                    # Settings and environment variables
│   ├── requirements.txt             # Python dependencies
│   │
│   ├── api/
│   │   └── routes/
│   │       ├── upload.py            # POST /api/upload — resume upload & scoring
│   │       ├── jobs.py              # CRUD /api/jobs — job descriptions
│   │       ├── candidates.py        # GET/DELETE /api/candidates
│   │       ├── ranking.py           # GET /api/rank?job_id=1
│   │       └── analytics.py         # GET /api/analytics/overview
│   │
│   ├── core/
│   │   ├── parsers/
│   │   │   ├── pdf_parser.py        # Extract text from PDF
│   │   │   ├── docx_parser.py       # Extract text from DOCX
│   │   │   ├── ppt_parser.py        # Extract text from PPTX
│   │   │   └── extractor.py         # Master file parser
│   │   │
│   │   ├── nlp/
│   │   │   ├── cleaner.py           # Text cleaning and stopword removal
│   │   │   ├── ner.py               # Named entity recognition (spaCy)
│   │   │   ├── skills.py            # Skill extraction and matching
│   │   │   ├── embedder.py          # Sentence embeddings
│   │   │   └── extractor.py         # Master NLP pipeline
│   │   │
│   │   └── matching/
│   │       ├── scorer.py            # Weighted scoring formula
│   │       └── ranker.py            # Rank candidates by score
│   │
│   ├── db/
│   │   ├── database.py              # SQLite connection and session
│   │   └── models/
│   │       ├── candidate.py         # Candidate table
│   │       ├── job.py               # Job table
│   │       └── score.py             # Score table
│   │
│   ├── schemas/                     # Pydantic request/response models
│   └── uploads/                     # Uploaded resume files stored here
│
├── frontend/                        # React frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx                  # Sidebar layout and routing
│       ├── main.jsx                 # React entry point
│       ├── index.css                # Global styles
│       ├── api/
│       │   └── client.js            # All Axios API calls
│       └── pages/
│           ├── DashboardPage.jsx    # Analytics overview
│           ├── JobsPage.jsx         # Create and manage jobs
│           ├── UploadPage.jsx       # Upload resume and view score
│           ├── CandidatesPage.jsx   # Browse all candidates
│           └── RankingPage.jsx      # Ranked candidates per job
│
└── ml/
    └── skills_taxonomy.json         # Master list of 80+ skills
```

---

## ⚙️ How It Works

### Resume Processing Pipeline

```
User uploads resume (PDF / DOCX / PPTX)
            ↓
    File Parser extracts raw text
            ↓
    NLP Pipeline runs:
      • Clean text (remove stopwords)
      • NER → extract name, email, phone, organizations
      • Skills extraction from taxonomy
      • Generate AI embedding vector
            ↓
    Matching Engine runs:
      • Semantic similarity (resume vs job description)
      • Skills overlap ratio
      • Experience comparison
      • Education level comparison
            ↓
    Weighted Score calculated (0–100)
            ↓
    Candidate + Score saved to SQLite database
            ↓
    Result returned to frontend
```

---

## 📊 Scoring Formula

The ranking score is a weighted combination of 4 components:

```
Final Score = (Semantic Similarity × 50%)
            + (Skills Overlap      × 30%)
            + (Experience Match    × 10%)
            + (Education Match     × 10%)

Multiplied by 100 → gives a score from 0 to 100
```

### Score Meaning

| Score | Label | Meaning |
|---|---|---|
| 75 – 100 | 🟢 Strong Match | Shortlist this candidate |
| 50 – 74 | 🟡 Average Match | Worth reviewing |
| 0 – 49 | 🔴 Weak Match | Likely not a good fit |

---

## 🚀 Installation & Setup

### Requirements

- Python 3.10 or above
- Node.js 18 or above
- Git

---

### Backend Setup

**Step 1 — Go to backend folder**
```cmd
cd resumescreener\backend
```

**Step 2 — Create virtual environment**
```cmd
python -m venv venv
```

**Step 3 — Activate virtual environment**
```cmd
# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate
```

**Step 4 — Install dependencies**
```cmd
pip install -r requirements.txt
```

**Step 5 — Download spaCy language model**
```cmd
python -m spacy download en_core_web_sm
```

**Step 6 — Start the backend server**
```cmd
uvicorn main:app --reload
```

Backend runs at: **http://localhost:8000**
API docs available at: **http://localhost:8000/docs**

---

### Frontend Setup

Open a **new terminal** and run:

**Step 1 — Go to frontend folder**
```cmd
cd resumescreener\frontend
```

**Step 2 — Install packages**
```cmd
npm install
```

**Step 3 — Start the frontend**
```cmd
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

### Running Both Together

| Terminal | Directory | Command | URL |
|---|---|---|---|
| Terminal 1 | `backend/` | `uvicorn main:app --reload` | http://localhost:8000 |
| Terminal 2 | `frontend/` | `npm run dev` | http://localhost:3000 |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API health check |
| `GET` | `/docs` | Interactive Swagger API docs |
| `POST` | `/api/upload/` | Upload resume and calculate score |
| `GET` | `/api/jobs/` | List all job descriptions |
| `POST` | `/api/jobs/` | Create a new job |
| `GET` | `/api/jobs/{id}/` | Get a single job |
| `PUT` | `/api/jobs/{id}/` | Update a job |
| `DELETE` | `/api/jobs/{id}/` | Delete a job |
| `GET` | `/api/candidates/` | List all candidates |
| `GET` | `/api/candidates/{id}/` | Get a single candidate |
| `DELETE` | `/api/candidates/{id}/` | Delete a candidate |
| `GET` | `/api/rank/?job_id=1` | Get ranked candidates for a job |
| `GET` | `/api/analytics/overview/` | Get dashboard analytics |

---

## 🗄️ Database Tables

### candidates
| Column | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| name | String | Extracted from resume |
| email | String | Extracted from resume |
| phone | String | Extracted from resume |
| skills | JSON | List of matched skills |
| education | String | Education level |
| experience | Integer | Years of experience |
| resume_text | String | Full extracted text |
| file_path | String | Path to uploaded file |
| created_at | DateTime | Upload timestamp |

### jobs
| Column | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| title | String | Job title |
| description | String | Full job description |
| required_skills | JSON | List of required skills |
| required_edu | String | Minimum education level |
| required_exp | Integer | Minimum years of experience |
| created_at | DateTime | Creation timestamp |

### scores
| Column | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| candidate_id | Integer | Foreign key to candidates |
| job_id | Integer | Foreign key to jobs |
| final_score | Float | Score out of 100 |
| breakdown | JSON | Individual component scores |
| created_at | DateTime | Timestamp |

---

## 🎨 Color Palette

| Name | Hex | Used For |
|---|---|---|
| Dark Brown | `#8A5F41` | Primary buttons, active nav, headings |
| Medium Brown | `#A77F60` | Secondary text, hover states |
| Cream | `#F3E4C9` | Backgrounds, sidebar |
| Lime Green | `#CCD67F` | Score highlights, skill tags |

---

## ⚠️ Common Issues & Fixes

### spaCy model not found
```cmd
python -m spacy download en_core_web_sm
```

### Database disk I/O error
```cmd
# Stop the server, delete the DB file, restart
del resume_screener.db
uvicorn main:app --reload
```

### 307 Redirect error
Add `redirect_slashes=False` to `main.py`:
```python
app = FastAPI(title="AI Resume Screener", redirect_slashes=False)
```

### ModuleNotFoundError
Make sure your virtual environment is activated:
```cmd
venv\Scripts\activate
```

### Frontend 404 error
Make sure `index.html` is in the `frontend/` root folder, not inside `src/`.

---

## 🚀 Deployment

### Backend — Railway (Recommended)
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click **New Project → Deploy from GitHub**
4. Set root directory to `backend`
5. Add environment variables
6. Deploy — Railway handles everything automatically

### Frontend — Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Deploy — Vercel builds and hosts automatically

---

## 👨‍💻 Author

Built as part of an AI-powered HR automation project.

---

## 📄 License

This project is for educational purposes.