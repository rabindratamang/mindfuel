from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from models.user import User, UserRepository, UserInDB
from core.security import get_current_user

router = APIRouter()
user_repository = UserRepository()

@router.get("/profile", response_model=User)
async def get_user_profile(current_user_id: str = Depends(get_current_user)):
    user = await user_repository.get_user_for_response(current_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    user = await user_repository.get_user_for_response(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/profile")
async def update_user_profile(
    updates: dict,
    current_user_id: str = Depends(get_current_user)
):
    allowed_updates = {k: v for k, v in updates.items() 
                      if k in ["firstName", "lastName", "email"]}
    
    if not allowed_updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    
    success = await user_repository.update(current_user_id, allowed_updates)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await user_repository.get_user_for_response(current_user_id)
    return {"message": "Profile updated successfully", "user": updated_user.model_dump(by_alias=True)}

@router.delete("/profile")
async def delete_user_profile(current_user_id: str = Depends(get_current_user)):
    success = await user_repository.delete(current_user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Account deleted successfully"}

@router.get("/search/", response_model=List[User])
async def search_users(
    q: str = Query(..., description="Search term for name or email"),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of results")
):
    """Search users by name or email"""
    users = await user_repository.search_users(q, limit)
    return users

@router.get("/recent/", response_model=List[User])
async def get_recent_users(
    limit: int = Query(20, ge=1, le=100, description="Maximum number of results")
):
    """Get recently created users"""
    users = await user_repository.get_recent_users(limit)
    return users

@router.get("/stats/")
async def get_user_statistics():
    """Get user statistics"""
    stats = await user_repository.get_user_stats()
    return stats

@router.get("/count/")
async def get_user_count():
    """Get total number of users"""
    count = await user_repository.count_users()
    return {"total_users": count}

@router.get("/by-name/", response_model=List[User])
async def get_users_by_name(
    first_name: Optional[str] = Query(None, description="First name filter"),
    last_name: Optional[str] = Query(None, description="Last name filter")
):
    """Get users filtered by first name and/or last name"""
    if not first_name and not last_name:
        raise HTTPException(status_code=400, detail="At least one name filter is required")
    
    users = await user_repository.get_users_by_name(first_name, last_name)
    return users

@router.get("/by-date-range/", response_model=List[User])
async def get_users_by_date_range(
    start_date: datetime = Query(..., description="Start date (ISO format)"),
    end_date: datetime = Query(..., description="End date (ISO format)")
):
    """Get users created within a date range"""
    if start_date >= end_date:
        raise HTTPException(status_code=400, detail="Start date must be before end date")
    
    users = await user_repository.get_users_by_date_range(start_date, end_date)
    return users

@router.get("/paginated/", response_model=List[User])
async def get_users_paginated(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of results")
):
    """Get users with pagination"""
    users = await user_repository.get_all_users(limit, skip)
    return users 