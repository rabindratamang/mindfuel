from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_refresh_token
from models.user import User

router = APIRouter()
fake_users_db = {}

@router.post("/register")
def register(register_data: User):
    if register_data.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    fake_users_db[register_data.username] = {
        "username": register_data.username,
        "hashed_password": hash_password(register_data.password)
    }
    return {"msg": "User registered"}

@router.post("/login")
def login(login_data: User):
    db_user = fake_users_db.get(login_data.username)
    if not db_user or not verify_password(login_data.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": db_user["username"]})
    refresh_token = create_refresh_token({"sub": db_user["username"]})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
def refresh_token(refresh_token: str):
    payload = decode_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    new_access_token = create_access_token({"sub": payload["sub"]})
    return {"access_token": new_access_token, "token_type": "bearer"} 