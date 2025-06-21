from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class MoodAnalysisSimple(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str
    mood: str
    score: int = Field(ge=0, le=100)
    analysis: str
    suggestions: List[str]
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True

    def to_mongo(self) -> dict:
        data = self.dict(exclude={"id"})
        if self.id:
            data["_id"] = ObjectId(self.id)
        data["userId"] = ObjectId(data["userId"])
        return data

    @classmethod
    def from_mongo(cls, data: dict) -> "MoodAnalysisSimple":
        if data.get("_id"):
            data["id"] = str(data["_id"])
        if data.get("userId"):
            data["userId"] = str(data["userId"])
        return cls(**data)


class MoodAnalysisSimpleRepository:
    def __init__(self, db):
        self.collection = db.mood_analyses_simple

    async def create(self, mood_analysis: MoodAnalysisSimple) -> str:
        doc = mood_analysis.to_mongo()
        result = await self.collection.insert_one(doc)
        return str(result.inserted_id)

    async def get_by_id(self, analysis_id: str) -> Optional[MoodAnalysisSimple]:
        doc = await self.collection.find_one({"_id": ObjectId(analysis_id)})
        return MoodAnalysisSimple.from_mongo(doc) if doc else None

    async def get_by_user_id(self, user_id: str, limit: int = 10) -> List[MoodAnalysisSimple]:
        cursor = self.collection.find({"userId": ObjectId(user_id)}).sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [MoodAnalysisSimple.from_mongo(doc) for doc in docs]

    async def update(self, analysis_id: str, updates: dict) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(analysis_id)},
            {"$set": updates}
        )
        return result.modified_count > 0

    async def delete(self, analysis_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(analysis_id)})
        return result.deleted_count > 0

    async def get_recent_analyses(self, limit: int = 20) -> List[MoodAnalysisSimple]:
        cursor = self.collection.find().sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [MoodAnalysisSimple.from_mongo(doc) for doc in docs]

    async def get_analyses_by_mood(self, mood: str, limit: int = 10) -> List[MoodAnalysisSimple]:
        cursor = self.collection.find({"mood": mood}).sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [MoodAnalysisSimple.from_mongo(doc) for doc in docs] 