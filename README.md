# AI Resume Enhancer

## 🚀 AI Resume Enhancer — Professional CV Optimizer
**AI Resume Enhancer** is an AI-powered tool that analyzes resumes and generates engineering-grade improvements.
It enhances text clarity, generates impactful bullet points, and extracts ATS keywords to increase hiring chances.

✅ **Built for job seekers:** simple, effective, and privacy-focused.

## ✨ Features

### ✅ Core AI Analysis
- Accepts resumes via text paste (expandable to file upload).
- Uses **Groq (Llama 3)** to generate structured improvements:
    - **Enhanced Text** with better flow and vocabulary.
    - **Bullet Points** optimized for impact.
    - **ATS Keywords** extraction.
    - **ATS Score** (0–100) estimation.
    - **Strengths & Suggestions** for further improvement.
    - **Flesch Reading Ease** analysis for readability.

### ✅ Explainable AI / Transparency
- **Readability Scores**: Calculates Flesch Reading Ease and Kincaid Grade to ensure clarity.
- **ATS Scoring**: Provides a heuristic score based on keyword matching and structure.

### ✅ Frontend UX
- **Clean Next.js UI** with Tailwind CSS.
- **Export Options**:
    - Generates **PDF** reports (using `jspdf`).
    - Generates **DOCX** files.
    - Exports **JSON** data.
- **Interactive Toggles**: Switch between Enhanced Text, Bullet Points, and Keywords views.
- **Responsive Design**: Works on desktop and mobile.

### ✅ History & Auth System
- **Secure Login + Register** with JWT authentication.
- **Password hashing** with bcrypt.
- **SQLite Database** for user management.

## 🧱 Tech Stack

### Backend
- **FastAPI** (Python)
- **Groq API** (Llama 3-70b)
- **SQLAlchemy + SQLite** (Database)
- **Textstat** (Readability metrics)
- **Python-jose** (JWT Auth)

### Frontend
- **Next.js** (React Framework)
- **Tailwind CSS** (Styling)
- **jsPDF** (PDF Generation)
- **TypeScript**

## 📁 Project Structure

```bash
resume-enhancer/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── services/
│   │   │   └── resume_enhancer.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   └── routes.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── login/
│   │   │   └── register/
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### 1) Clone the repository
```bash
git clone https://github.com/yourusername/resume-enhancer.git
cd resume-enhancer
```

### 2) Install dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3) Add environment variables
Create a `.env` file in `backend/` with:
```env
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_jwt_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4) Run the Application

**Start the BACKEND (FastAPI)**
```bash
cd backend
# Windows
uvicorn app.main:app --reload
```
Expected output: `Uvicorn running on http://127.0.0.1:8000`

**Start the FRONTEND (Next.js)**
```bash
cd frontend
npm run dev
```
Expected output: `Local URL: http://localhost:3000`

## ⚠️ Manual Test Cases (Demo Checklist)
- [ ] **Register/Login user**: Verify auth flow works.
- [ ] **Analyze Resume**: Paste text and verify enhancement.
- [ ] **Check Scores**: Verify ATS Score and Flesch Readability are displayed.
- [ ] **Export PDF**: Click button and check `resume.pdf` content.
- [ ] **Export DOCX/JSON**: Verify file generation.
- [ ] **Clear Form**: Ensure state resets correctly.

## 🔒 Security Notes
- Passwords are hashed using `bcrypt`.
- JWT tokens used for session management.
- No sensitive keys committed to repo (use `.env`).

## ⚠️ Limitations
- **ATS Score** is a simulation based on AI heuristics, not a real ATS scan.
- **Groq Llama 3** results may vary slightly between runs.
