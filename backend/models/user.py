from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
import uuid

class UserBase(BaseModel):
    email: EmailStr
    
    class Config:
        validate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class UserLogin(UserBase):
    password: str

class UserRegister(UserLogin):
    firstName: str
    lastName: str

class UserInDB(UserBase):
    firstName: str
    lastName: str
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hashedPassword: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class User(UserBase):
    id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        validate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        } 