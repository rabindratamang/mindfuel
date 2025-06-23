from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_refresh_token, get_current_user
from models.user import UserLogin, UserRegister, UserInDB, User, UserRepository
from utils.user_helpers import UserHelpers

router = APIRouter()
user_repository = UserRepository()
user_helpers = UserHelpers(user_repository)

@router.post("/register")
async def register(register_data: UserRegister):
    validation = await user_helpers.validate_user_registration(
        register_data.email,
        register_data.password,
        register_data.firstName,
        register_data.lastName
    )
    
    if not validation["valid"]:
        raise HTTPException(status_code=400, detail={"message": "Validation failed", "errors": validation["errors"]})
    
    user_data = UserInDB(
        email=register_data.email,
        firstName=register_data.firstName,
        lastName=register_data.lastName,
        hashedPassword=hash_password(register_data.password)
    )
    
    user_id = await user_repository.create(user_data)
    created_user = await user_repository.get_user_for_response(user_id)
    
    access_token = create_access_token({
        "sub": user_id,
        "email": created_user.email,
        "firstName": created_user.firstName,
        "lastName": created_user.lastName,
        "isOnboardComplete": created_user.isOnboardComplete 
    })
    refresh_token = create_refresh_token({
        "sub": user_id,
        "email": created_user.email
    })
    
    return {
        "user": created_user.model_dump(by_alias=True),
        "tokens": {
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "tokenType": "bearer"
        }
    }

@router.post("/login")
async def login(login_data: UserLogin):
    validation = await user_helpers.validate_user_login(login_data.email, login_data.password)
    
    if not validation["valid"]:
        raise HTTPException(status_code=401, detail={"message": "Login failed", "errors": validation["errors"]})
    
    user = validation["user"]
    
    access_token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "isOnboardComplete": user.isOnboardComplete
    })
    refresh_token = create_refresh_token({
        "sub": user.id,
        "email": user.email
    })
    
    user_response = await user_repository.get_user_for_response(user.id)
    
    return {
        "user": user_response.model_dump(by_alias=True),
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
    
    user = await user_repository.get_by_id(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    new_access_token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "isOnboardComplete": user.isOnboardComplete
    })
    
    return {
        "accessToken": new_access_token,
        "tokenType": "bearer"
    }

@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user_info: dict = Depends(get_current_user)
):
    """Change user password with validation"""
    result = await user_helpers.change_user_password(current_user_info["user"].id, current_password, new_password)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail={"message": "Password change failed", "errors": result["errors"]})
    
    return {"message": "Password changed successfully"} 