import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "mindfuel")

class Database:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect_db(cls):
        cls.client = AsyncIOMotorClient(MONGODB_URL)
        cls.db = cls.client[DATABASE_NAME]

    @classmethod
    async def close_db(cls):
        if cls.client:
            cls.client.close()

mongodb_obj = Database()