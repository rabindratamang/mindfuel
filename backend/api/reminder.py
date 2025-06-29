from fastapi import APIRouter, Depends, HTTPException
from models.reminder import Reminder, ReminderRepository
from core.security import get_current_user
from fastapi.encoders import jsonable_encoder

router = APIRouter()

@router.post("/", response_model=dict)
async def create_reminder(reminder: dict, current_user_info=Depends(get_current_user)):
    repo = ReminderRepository()
    reminder["userId"] = current_user_info["user"].id
    inserted_id = await repo.create(reminder)
    reminder_created = await repo.get_by_id(inserted_id)
    return jsonable_encoder(reminder_created)

@router.get("/", response_model=list)
async def get_reminders(current_user_info=Depends(get_current_user)):
    repo = ReminderRepository()
    reminders = await repo.get_by_user_id(current_user_info["user"].id)
    return [jsonable_encoder(r) for r in reminders]

@router.get("/{reminder_id}", response_model=dict)
async def get_reminder(reminder_id: str, current_user_info=Depends(get_current_user)):
    repo = ReminderRepository()
    reminder = await repo.get_by_id(reminder_id)
    if not reminder or reminder.userId != current_user_info["user"].id:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return jsonable_encoder(reminder)

@router.put("/{reminder_id}", response_model=dict)
async def update_reminder(reminder_id: str, updates: dict, current_user_info=Depends(get_current_user)):
    repo = ReminderRepository()
    reminder = await repo.get_by_id(reminder_id)
    if not reminder or reminder.userId != current_user_info["user"].id:
        raise HTTPException(status_code=404, detail="Reminder not found")
    success = await repo.update(reminder_id, updates)
    return {"success": success}

@router.delete("/{reminder_id}", response_model=dict)
async def delete_reminder(reminder_id: str, current_user_info=Depends(get_current_user)):
    repo = ReminderRepository()
    reminder = await repo.get_by_id(reminder_id)
    if not reminder or reminder.userId != current_user_info["user"].id:
        raise HTTPException(status_code=404, detail="Reminder not found")
    success = await repo.delete(reminder_id)
    return {"success": success} 