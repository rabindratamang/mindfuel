from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from database.mongo_client import get_database

class SleepRecord(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str = Field(alias="userId")
    date: str
    bedtime: str
    wakeTime: str
    duration: str
    quality: int
    factors: List[str] = []
    mood: str = ""
    notes: str = ""
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
        data["userId"] = ObjectId(self.userId)
        return data

    @classmethod
    def from_mongo(cls, data: Dict[str, Any]) -> "SleepRecord":
        if data is None:
            return None
        data_copy = data.copy()
        if data_copy.get("_id"):
            data_copy["id"] = str(data_copy["_id"])
            del data_copy["_id"]
        if data_copy.get("userId"):
            data_copy["userId"] = str(data_copy["userId"])
        return cls(**data_copy)

class SleepRecordRepository:
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
            self._collection = db.sleep_records
        return self._collection

    async def create(self, record: dict) -> str:
        doc = record
        result = await (await self.collection).insert_one(doc)
        return str(result.inserted_id)

    async def get_by_id(self, record_id: str) -> Optional[SleepRecord]:
        doc = await (await self.collection).find_one({"_id": ObjectId(record_id)})
        return SleepRecord.from_mongo(doc) if doc else None

    async def get_by_user_id(self, user_id: str, limit: int = 30) -> List[SleepRecord]:
        cursor = (await self.collection).find({"userId": user_id}).sort("date", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [SleepRecord.from_mongo(doc) for doc in docs]

    async def update(self, record_id: str, updates: Dict[str, Any]) -> bool:
        updates["updatedAt"] = datetime.utcnow()
        result = await (await self.collection).update_one(
            {"_id": ObjectId(record_id)},
            {"$set": updates}
        )
        return result.modified_count > 0

    async def delete(self, record_id: str) -> bool:
        result = await (await self.collection).delete_one({"_id": ObjectId(record_id)})
        return result.deleted_count > 0 