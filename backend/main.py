from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from contextlib import asynccontextmanager
from api import auth, agent
from config.database import mongodb_obj

@asynccontextmanager
async def lifespan(app: FastAPI):
    await mongodb_obj.connect_db()
    yield
    await mongodb_obj.close_db()

app = FastAPI(lifespan=lifespan)
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(agent.router, tags=["agent"])

@app.get("/health")
def health():
    return {"status": "ok"} 