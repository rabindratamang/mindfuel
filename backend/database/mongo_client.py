import motor.motor_asyncio
from typing import Optional
from config.setting import settings

class MongoDBClient:
    def __init__(self):
        self.client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
        self.db = None

    async def connect(self):
        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
            self.db = self.client[settings.MONGODB_DB_NAME]
            print(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")
            raise

    async def close(self):
        if self.client:
            self.client.close()
            print("MongoDB connection closed")

    def get_database(self):
        if self.db is None:
            raise Exception("Database not connected. Call connect() first.")
        return self.db

    async def ping(self):
        try:
            await self.client.admin.command('ping')
            return True
        except Exception as e:
            print(f"Database ping failed: {e}")
            return False


mongo_client = MongoDBClient()


async def get_database():
    return mongo_client.get_database()


async def init_database():
    await mongo_client.connect()


async def close_database():
    await mongo_client.close() 