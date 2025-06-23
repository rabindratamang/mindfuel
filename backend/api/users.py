from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from models.user import User, UserRepository, UserInDB, Preferences, Goal
from core.security import get_current_user, create_access_token, create_refresh_token

router = APIRouter()
user_repository = UserRepository()

class ProfileUpdate(BaseModel):
    avatar: Optional[str] = None
    bio: Optional[str] = None
    dateOfBirth: Optional[datetime] = None
    gender: Optional[str] = None
    country: Optional[str] = None
    location: Optional[str] = None
    phoneNumber: Optional[str] = None

class UserProfileUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[EmailStr] = None
    profile: Optional[ProfileUpdate] = None

class PreferencesUpdate(BaseModel):
    preferences: Preferences

class GoalsUpdate(BaseModel):
    goals: List[Goal]

class OnboardingData(BaseModel):
    mentalHealthGoals: List[str]
    currentChallenges: List[str]
    wellnessInterests: List[str]
    experienceLevel: str
    preferredActivities: List[str]
    communicationStyle: str

@router.get("/profile", response_model=User)
async def get_user_profile(current_user_info: dict = Depends(get_current_user)):
    user = await user_repository.get_user_for_response(current_user_info["user"].id)
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
    updates: UserProfileUpdate,
    current_user_info: dict = Depends(get_current_user)
):
    update_data = updates.model_dump(exclude_unset=True)
    
    mongo_update_data = {}
    # Flatten profile fields
    if 'profile' in update_data:
        profile_updates = update_data.pop('profile')
        for key, value in profile_updates.items():
            mongo_update_data[f'profile.{key}'] = value
    
    # Add other top-level fields
    for key, value in update_data.items():
        mongo_update_data[key] = value

    if not mongo_update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    await user_repository.update(current_user_info["user"].id, mongo_update_data)
    
    updated_user = await user_repository.get_user_for_response(current_user_info["user"].id)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": "Profile updated successfully", "user": updated_user.model_dump(by_alias=True)}

@router.put("/preferences")
async def update_user_preferences(
    updates: Preferences,
    current_user_info: dict = Depends(get_current_user)
):
    update_data = {"preferences": updates.model_dump(exclude_unset=True)}
    
    if not update_data["preferences"]:
        raise HTTPException(status_code=400, detail="No preference fields to update")

    await user_repository.update(current_user_info["user"].id, update_data)
    
    updated_user = await user_repository.get_user_for_response(current_user_info["user"].id)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": "Preferences updated successfully", "user": updated_user.model_dump(by_alias=True)}

@router.post("/goals", response_model=User)
async def add_user_goal(
    goal: Goal,
    current_user_info: dict = Depends(get_current_user)
):
    success = await user_repository.add_goal(current_user_info["user"].id, goal)
    if not success:
        raise HTTPException(status_code=404, detail="User not found or goal not added")

    updated_user = await user_repository.get_user_for_response(current_user_info["user"].id)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return updated_user

@router.delete("/profile")
async def delete_user_profile(current_user_info: dict = Depends(get_current_user)):
    success = await user_repository.delete(current_user_info["user"].id)
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

@router.post("/onboarding")
async def complete_onboarding(
    onboarding_data: OnboardingData,
    current_user_info: dict = Depends(get_current_user)
):
    update_data = {
        "profile.mentalHealthGoals": onboarding_data.mentalHealthGoals,
        "profile.currentChallenges": onboarding_data.currentChallenges,
        "profile.wellnessInterests": onboarding_data.wellnessInterests,
        "profile.experienceLevel": onboarding_data.experienceLevel,
        "profile.preferredActivities": onboarding_data.preferredActivities,
        "preferences.communicationStyle": onboarding_data.communicationStyle,
        "isOnboardComplete": True
    }

    success = await user_repository.update(current_user_info["user"].id, update_data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update user profile with onboarding data")

    updated_user = await user_repository.get_user_for_response(current_user_info["user"].id)
    
    access_token = create_access_token({
        "sub": updated_user.id,
        "email": updated_user.email,
        "firstName": updated_user.firstName,
        "lastName": updated_user.lastName,
        "isOnboardComplete": updated_user.isOnboardComplete 
    })
    refresh_token = create_refresh_token({
        "sub": updated_user.id,
        "email": updated_user.email
    })
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found after update")
        
        
    return {
        "message": "Onboarding completed successfully", 
        "user": updated_user.model_dump(by_alias=True), 
        "tokens": {
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "tokenType": "bearer"
        }
    } 