from dotenv import load_dotenv
load_dotenv()
import os

from fastapi import FastAPI, APIRouter
from contextlib import asynccontextmanager
from api import auth, agent, users, chat, mood, sleep, reminder
from database.mongo_client import init_database, close_database
from fastapi.middleware.cors import CORSMiddleware
from utils.reminder_email_task import reminder_email_task
import asyncio


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_database()
    task = asyncio.create_task(reminder_email_task())
    try:
        yield
    finally:
        task.cancel()
    await close_database()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(agent.router, prefix="/agent", tags=["agent"])
api_router.include_router(users.router, prefix="/user", tags=["users"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(mood.router, prefix="/mood", tags=["mood"])
api_router.include_router(sleep.router, prefix="/sleep", tags=["sleep"])
api_router.include_router(reminder.router, prefix="/reminder", tags=["reminder"])
app.include_router(api_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"} 