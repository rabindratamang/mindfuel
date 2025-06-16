from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_refresh_token
from models.user import UserLogin, UserRegister, UserInDB, User
from config.database import mongodb_obj

router = APIRouter()

@router.post("/register")
async def register(register_data: UserRegister):
    existing_user = await mongodb_obj.db.users.find_one({"email": register_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_data = UserInDB(
        email=register_data.email,
        firstName=register_data.firstName,
        lastName=register_data.lastName,
        hashedPassword=hash_password(register_data.password)
    )
    
    result = await mongodb_obj.db.users.insert_one(user_data.model_dump())
    created_user = await mongodb_obj.db.users.find_one({"_id": result.inserted_id})
    
    access_token = create_access_token({
        "sub": str(created_user["_id"]),
        "email": created_user["email"],
        "firstName": created_user["firstName"],
        "lastName": created_user["lastName"]
    })
    refresh_token = create_refresh_token({
        "sub": str(created_user["_id"]),
        "email": created_user["email"]
    })
    
    return {
        "user": User(**created_user),
        "tokens": {
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "tokenType": "bearer"
        }
    }

@router.post("/login")
async def login(login_data: UserLogin):
    user = await mongodb_obj.db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["hashedPassword"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({
        "sub": str(user["_id"]),
        "email": user["email"],
        "firstName": user["firstName"],
        "lastName": user["lastName"]
    })
    refresh_token = create_refresh_token({
        "sub": str(user["_id"]),
        "email": user["email"]
    })
    
    return {
        "user": User(**user).model_dump(by_alias=True),
        "tokens": {
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "tokenType": "bearer"
        }
    }

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    payload = decode_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    # Get user from database
    user = await mongodb_obj.db.users.find_one({"_id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Create new access token
    new_access_token = create_access_token({
        "sub": str(user["_id"]),
        "email": user["email"],
        "firstName": user["firstName"],
        "lastName": user["lastName"]
    })
    
    return {
        "accessToken": new_access_token,
        "tokenType": "bearer"
    } 