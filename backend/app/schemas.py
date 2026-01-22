from pydantic import BaseModel
from typing import List, Optional

class ResumeRequest(BaseModel):
    text: str

class ResumeResponse(BaseModel):
    enhanced_text: str
    bullet_points: List[str]
    ats_keywords: List[str]
    ats_score: int
    strengths: List[str]
    suggestions: List[str]
    readability_flesch: float = None
    readability_kincaid: float = None

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True
