from fastapi import APIRouter, Depends, HTTPException
from models.user import UserInDB
from core.security import get_current_user
from models.mood_analysis import MoodAnalysisRepository

router = APIRouter()

@router.get("/")
async def get_all_mood_analysis(current_user_info = Depends(get_current_user)):
    repo = MoodAnalysisRepository()
    analyses = await repo.get_by_user_id(current_user_info["user"].id)
    return [a.model_dump() for a in analyses]     