from fastapi import APIRouter, Depends, HTTPException
from models.sleep_record import SleepRecord, SleepRecordRepository
from core.security import get_current_user
from fastapi.encoders import jsonable_encoder

router = APIRouter()

@router.post("/", response_model=dict)
async def create_sleep_record(record: dict, current_user_info=Depends(get_current_user)):
    repo = SleepRecordRepository()
    record["userId"] = current_user_info["user"].id
    inserted_id = await repo.create(record)
    return {"id": inserted_id}

@router.get("/", response_model=list)
async def get_sleep_records(current_user_info=Depends(get_current_user)):
    repo = SleepRecordRepository()
    records = await repo.get_by_user_id(current_user_info["user"].id)
    return [jsonable_encoder(r) for r in records]

@router.get("/{record_id}", response_model=dict)
async def get_sleep_record(record_id: str, current_user_info=Depends(get_current_user)):
    repo = SleepRecordRepository()
    record = await repo.get_by_id(record_id)
    if not record or record.userId != current_user_info["user"].id:
        raise HTTPException(status_code=404, detail="Sleep record not found")
    return jsonable_encoder(record)

@router.put("/{record_id}", response_model=dict)
async def update_sleep_record(record_id: str, updates: dict, current_user_info=Depends(get_current_user)):
    repo = SleepRecordRepository()
    record = await repo.get_by_id(record_id)
    if not record or record.userId != current_user_info["user"].id:
        raise HTTPException(status_code=404, detail="Sleep record not found")
    success = await repo.update(record_id, updates)
    return {"success": success}

@router.delete("/{record_id}", response_model=dict)
async def delete_sleep_record(record_id: str, current_user_info=Depends(get_current_user)):
    repo = SleepRecordRepository()
    record = await repo.get_by_id(record_id)
    if not record or record.userId != current_user_info["user"].id:
        raise HTTPException(status_code=404, detail="Sleep record not found")
    success = await repo.delete(record_id)
    return {"success": success} 