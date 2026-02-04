from fastapi import APIRouter, HTTPException, Depends
import logging
from app.auth import get_current_user
from app.schemas import ResumeRequest, ResumeResponse, ResumeHistory
from app.services.resume_enhancer import enhance
from app import models
from app.database import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter()

@router.get("/")
def health():
    return {"status": "ok"}

@router.get("/auth/debug")
def auth_debug():
    return {"status": "auth router is working"}

@router.post("/enhance", response_model=ResumeResponse)
def enhance_route(
    payload: ResumeRequest, 
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        logging.info(f"Processing enhance request for user: {current_user.email}")
        result = enhance(payload.text)
        
        if "error" in result and not result.get("success"):
             logging.error(f"Enhance service returned error: {result}")
        
        # Save to History
        if result.get("success"):
            user = db.query(models.User).filter(models.User.email == current_user.email).first()
            if user:
                db_resume = models.Resume(
                    original_text=payload.text,
                    enhanced_text=result.get("enhanced_text", ""),
                    ats_score=result.get("ats_score", 0),
                    user_id=user.id
                )
                db.add(db_resume)
                db.commit()
                db.refresh(db_resume)

        return result
    except Exception as e:
        logging.error(f"Route exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[ResumeHistory])
def get_history(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user.email).first()
    if not user:
         raise HTTPException(status_code=404, detail="User not found")
    
    resumes = db.query(models.Resume).filter(models.Resume.user_id == user.id).order_by(models.Resume.created_at.desc()).all()
    
    # Map to schema
    history = []
    for r in resumes:
        # Create a short summary snippet
        snippet = r.enhanced_text[:100] + "..." if r.enhanced_text else "No content"
        history.append({
            "id": r.id,
            "ats_score": r.ats_score,
            "created_at": r.created_at,
            "enhanced_summary": snippet
        })
    
    return history
