from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_refresh_token
from models.user import UserCreate, UserInDB, User
from config.database import mongodb_obj

router = APIRouter()

@router.post("/register", response_model=User)
async def register(register_data: UserCreate):
    existing_user = await mongodb_obj.db.users.find_one({"username": register_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user_data = UserInDB(
        username=register_data.username,
        email=register_data.email,
        hashed_password=hash_password(register_data.password)
    )
    
    result = await mongodb_obj.db.users.insert_one(user_data.model_dump(by_alias=True))
    created_user = await mongodb_obj.db.users.find_one({"_id": result.inserted_id})
    
    return User(**created_user)

@router.post("/login")
async def login(login_data: UserCreate):
    user = await mongodb_obj.db.users.find_one({"username": login_data.username})
    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": user["username"]})
    refresh_token = create_refresh_token({"sub": user["username"]})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    payload = decode_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    new_access_token = create_access_token({"sub": payload["sub"]})
    return {"access_token": new_access_token, "token_type": "bearer"} 