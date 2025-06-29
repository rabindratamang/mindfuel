from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from database.mongo_client import get_database

class Reminder(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str = Field(alias="userId")
    title: str
    description: Optional[str] = None
    datetime: str
    repeatType: str  # "none", "minute", "hour", "day"
    repeatInterval: int = 1
    isActive: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)

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
        data["userId"] = ObjectId(self.userId)
        return data

    @classmethod
    def from_mongo(cls, data: Dict[str, Any]) -> "Reminder":
        if data is None:
            return None
        data_copy = data.copy()
        if data_copy.get("_id"):
            data_copy["id"] = str(data_copy["_id"])
            del data_copy["_id"]
        if data_copy.get("userId"):
            data_copy["userId"] = str(data_copy["userId"])
        return cls(**data_copy)

class ReminderRepository:
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
            self._collection = db.reminders
        return self._collection

    async def create(self, reminder: dict) -> str:
        doc = reminder
        result = await (await self.collection).insert_one(doc)
        return str(result.inserted_id)

    async def get_by_id(self, reminder_id: str) -> Optional[Reminder]:
        doc = await (await self.collection).find_one({"_id": ObjectId(reminder_id)})
        return Reminder.from_mongo(doc) if doc else None

    async def get_by_user_id(self, user_id: str, limit: int = 50) -> List[Reminder]:
        cursor = (await self.collection).find({"userId": user_id}).sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [Reminder.from_mongo(doc) for doc in docs]

    async def update(self, reminder_id: str, updates: Dict[str, Any]) -> bool:
        result = await (await self.collection).update_one(
            {"_id": ObjectId(reminder_id)},
            {"$set": updates}
        )
        return result.modified_count > 0

    async def delete(self, reminder_id: str) -> bool:
        result = await (await self.collection).delete_one({"_id": ObjectId(reminder_id)})
        return result.deleted_count > 0 