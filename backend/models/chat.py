from typing import Optional, List, Literal, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from database.mongo_client import get_database

class MessageModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    chatId: str
    userId: str
    content: str
    sender: Literal["user", "ai"]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    mood: Optional[str] = None
    suggestions: Optional[List[str]] = None

    class Config:
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}
        validate_by_name = True

    @classmethod
    def from_mongo(cls, data: Dict[str, Any]):
        if data is None:
            return None
        data = data.copy()
        if data.get("_id"):
            data["id"] = str(data["_id"])
            del data["_id"]
        return cls(**data)

class ChatModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}
        validate_by_name = True

    @classmethod
    def from_mongo(cls, data: Dict[str, Any]):
        if data is None:
            return None
        data = data.copy()
        if data.get("_id"):
            data["id"] = str(data["_id"])
            del data["_id"]
        return cls(**data)

class ChatRepository:
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
            self._collection = db.chats
        return self._collection

    async def create(self, chat: ChatModel) -> str:
        doc = chat.dict(by_alias=True, exclude={"id"})
        result = await (await self.collection).insert_one(doc)
        return str(result.inserted_id)

    async def get_by_id(self, chat_id: str) -> Optional[ChatModel]:
        doc = await (await self.collection).find_one({"_id": ObjectId(chat_id)})
        return ChatModel.from_mongo(doc) if doc else None

    async def get_by_user(self, user_id: str) -> list:
        cursor = (await self.collection).find({"userId": user_id})
        return [ChatModel.from_mongo(doc) async for doc in cursor]

    async def update(self, chat_id: str, updates: Dict[str, Any]) -> bool:
        updates["updatedAt"] = datetime.utcnow()
        result = await (await self.collection).update_one(
            {"_id": ObjectId(chat_id)},
            {"$set": updates}
        )
        return result.modified_count > 0

    async def delete(self, chat_id: str) -> bool:
        result = await (await self.collection).delete_one({"_id": ObjectId(chat_id)})
        return result.deleted_count > 0

class MessageRepository:
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
            self._collection = db.messages
        return self._collection

    async def create(self, message: MessageModel) -> str:
        doc = message.dict(by_alias=True, exclude={"id"})
        result = await (await self.collection).insert_one(doc)
        return str(result.inserted_id)

    async def get_by_id(self, message_id: str) -> Optional[MessageModel]:
        doc = await (await self.collection).find_one({"_id": ObjectId(message_id)})
        return MessageModel.from_mongo(doc) if doc else None

    async def get_by_chat(self, chat_id: str) -> list:
        cursor = (await self.collection).find({"chatId": chat_id})
        return [MessageModel.from_mongo(doc) async for doc in cursor]

    async def delete(self, message_id: str) -> bool:
        result = await (await self.collection).delete_one({"_id": ObjectId(message_id)})
        return result.deleted_count > 0 