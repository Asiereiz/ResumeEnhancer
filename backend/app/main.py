from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Import the actual implementation


from app import models
from app.database import engine
from app.routers import auth
from app import routes

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(routes.router)

# CORS FIX → REQUIRED FOR NEXT.JS FRONTEND
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


