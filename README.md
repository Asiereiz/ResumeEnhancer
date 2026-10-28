# AI Resume Enhancer

A web app that takes your resume as text and uses an LLM to suggest improvements. It rewrites the text, generates bullet points, extracts ATS keywords and gives an estimated ATS score.

I built it as a personal project to practice working with LLM APIs in a full-stack app.

## What it does

- Takes a resume pasted as text
- Uses Groq (Llama 3) to generate:
  - An improved version of the text
  - Bullet points focused on impact
  - ATS keywords
  - An estimated ATS score (0-100)
  - Strengths and suggestions
- Calculates readability with Flesch Reading Ease and Kincaid Grade
- Exports the results as PDF, DOCX or JSON
- Lets you switch between the enhanced text, bullet points and keywords views
- Has user registration and login (JWT)
- Works on desktop and mobile

## Tech stack

**Backend**
- FastAPI (Python)
- Groq API (Llama 3 70B)
- SQLAlchemy + SQLite
- Textstat (readability metrics)
- python-jose (JWT)
- bcrypt (password hashing)

**Frontend**
- Next.js + TypeScript
- Tailwind CSS
- jsPDF (PDF export)

## Project structure

```
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
│   │   └── app/
│   │       ├── page.tsx
│   │       ├── login/
│   │       └── register/
│   └── package.json
└── README.md
```

## Setup

### 1. Clone the repository

```
git clone https://github.com/Asiereiz/ResumeEnhancer.git
cd ResumeEnhancer
```

### 2. Install dependencies

Backend:

```
cd backend
pip install -r requirements.txt
```

Frontend:

```
cd frontend
npm install
```

### 3. Environment variables

Create a `.env` file inside `backend/`:

```
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_jwt_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

You can get a Groq API key from https://console.groq.com.

### 4. Run it

Backend:

```
cd backend
uvicorn app.main:app --reload
```

It should be running on `http://127.0.0.1:8000`.

Frontend (in another terminal):

```
cd frontend
npm run dev
```

It should be running on `http://localhost:3000`.

## Testing it manually

- Register a user and log in
- Paste a resume and run the analysis
- Check that the ATS score and readability scores show up
- Export the PDF, DOCX and JSON files and open them
- Clear the form and check that everything resets

## Security

- Passwords are hashed with bcrypt
- Sessions use JWT tokens
- Secrets go in `.env`, which should not be committed to the repo

## Limitations

- The ATS score is an estimate made by the model, not a real ATS scan
- Llama 3 results can change a bit between runs
- Resumes can only be pasted as text for now (file upload is not implemented yet)
