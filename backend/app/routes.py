from fastapi import APIRouter, HTTPException, Depends
from app.auth import get_current_user
from app.schemas import ResumeRequest, ResumeResponse
from app.services.resume_enhancer import enhance

router = APIRouter()

@router.get("/")
def health():
    return {"status": "ok"}

@router.get("/auth/debug")
def auth_debug():
    return {"status": "auth router is working"}

@router.post("/enhance", response_model=ResumeResponse)
def enhance_route(payload: ResumeRequest, current_user: dict = Depends(get_current_user)):
    try:
        print(f"DEBUG: Processing enhance request for user: {current_user.email}")
        result = enhance(payload.text)
        if "error" in result and not result.get("success"):
             print(f"DEBUG: Enhance service returned error: {result}")
        return result
    except Exception as e:
        print(f"DEBUG: Route exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))
