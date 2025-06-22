from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
import uuid
from bson import ObjectId
from database.mongo_client import get_database

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
    id: Optional[str] = Field(default=None, alias="_id")
    hashedPassword: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

    def to_mongo(self) -> Dict[str, Any]:
        data = self.dict(exclude={"id"})
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data

    @classmethod
    def from_mongo(cls, data: Dict[str, Any]) -> "UserInDB":
        """Create instance from MongoDB document"""
        if data is None:
            return None
        
        # Create a copy to avoid modifying the original data
        data_copy = data.copy()
        if data_copy.get("_id"):
            data_copy["id"] = str(data_copy["_id"])
            del data_copy["_id"]  # Remove the ObjectId field
        return cls(**data_copy)

class User(UserBase):
    id: str
    firstName: str
    lastName: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        validate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

    @classmethod
    def from_mongo(cls, data: Dict[str, Any]) -> "User":
        if data is None:
            return None
        
        data_copy = data.copy()
        if data_copy.get("_id"):
            data_copy["id"] = str(data_copy["_id"])
            del data_copy["_id"]  # Remove the ObjectId field
        return cls(**data_copy)

class UserRepository:
    def __init__(self, db=None):
        self._db = db
        self._collection = None

    @property
    async def collection(self):
        if self._collection is None:
            if self._db is None:
                db = await get_database()
            else:
                db = self._db
            self._collection = db.users
        return self._collection

    async def create(self, user: UserInDB) -> str:
        doc = user.to_mongo()
        result = await (await self.collection).insert_one(doc)
        return str(result.inserted_id)

    async def get_by_id(self, user_id: str) -> Optional[UserInDB]:
        doc = await (await self.collection).find_one({"_id": ObjectId(user_id)})
        return UserInDB.from_mongo(doc) if doc else None

    async def get_by_email(self, email: str) -> Optional[UserInDB]:
        doc = await (await self.collection).find_one({"email": email})
        return UserInDB.from_mongo(doc) if doc else None

    async def get_user_for_response(self, user_id: str) -> Optional[User]:
        doc = await (await self.collection).find_one({"_id": ObjectId(user_id)})
        return User.from_mongo(doc) if doc else None

    async def update(self, user_id: str, updates: Dict[str, Any]) -> bool:
        updates["updatedAt"] = datetime.utcnow()
        result = await (await self.collection).update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates}
        )
        return result.modified_count > 0

    async def update_password(self, user_id: str, hashed_password: str) -> bool:
        result = await (await self.collection).update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "hashedPassword": hashed_password,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    async def delete(self, user_id: str) -> bool:
        result = await (await self.collection).delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    async def get_all_users(self, limit: int = 50, skip: int = 0) -> List[User]:
        cursor = (await self.collection).find().skip(skip).limit(limit).sort("createdAt", -1)
        docs = await cursor.to_list(length=limit)
        return [User.from_mongo(doc) for doc in docs]

    async def search_users(self, search_term: str, limit: int = 20) -> List[User]:
        cursor = (await self.collection).find({
            "$or": [
                {"firstName": {"$regex": search_term, "$options": "i"}},
                {"lastName": {"$regex": search_term, "$options": "i"}},
                {"email": {"$regex": search_term, "$options": "i"}}
            ]
        }).limit(limit).sort("createdAt", -1)
        docs = await cursor.to_list(length=limit)
        return [User.from_mongo(doc) for doc in docs]

    async def get_users_by_date_range(self, start_date: datetime, end_date: datetime) -> List[User]:
        cursor = (await self.collection).find({
            "createdAt": {"$gte": start_date, "$lte": end_date}
        }).sort("createdAt", -1)
        docs = await cursor.to_list(None)
        return [User.from_mongo(doc) for doc in docs]

    async def get_recent_users(self, limit: int = 20) -> List[User]:
        cursor = (await self.collection).find().sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [User.from_mongo(doc) for doc in docs]

    async def count_users(self) -> int:
        return await (await self.collection).count_documents({})

    async def get_users_by_name(self, first_name: str = None, last_name: str = None) -> List[User]:
        query = {}
        if first_name:
            query["firstName"] = {"$regex": first_name, "$options": "i"}
        if last_name:
            query["lastName"] = {"$regex": last_name, "$options": "i"}
        
        cursor = (await self.collection).find(query).sort("createdAt", -1)
        docs = await cursor.to_list(None)
        return [User.from_mongo(doc) for doc in docs]

    async def check_email_exists(self, email: str) -> bool:
        doc = await (await self.collection).find_one({"email": email})
        return doc is not None

    async def get_user_stats(self) -> Dict[str, Any]:
        pipeline = [
            {"$group": {
                "_id": None,
                "totalUsers": {"$sum": 1},
                "avgCreatedAt": {"$avg": {"$dateToString": {"date": "$createdAt", "format": "%Y-%m-%d"}}}
            }}
        ]
        result = await (await self.collection).aggregate(pipeline).to_list(None)
        return result[0] if result else {"totalUsers": 0, "avgCreatedAt": None} 