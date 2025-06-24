from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter
from contextlib import asynccontextmanager
from api import auth, agent, users, chat
from database.mongo_client import init_database, close_database
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_database()
    yield
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
app.include_router(api_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"} 