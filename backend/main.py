from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter
from contextlib import asynccontextmanager
from api import auth, agent
from config.database import mongodb_obj
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    await mongodb_obj.connect_db()
    yield
    await mongodb_obj.close_db()

app = FastAPI(lifespan=lifespan)

# CORS (Cross-Origin Resource Sharing) middleware configuration
# Allows cross-origin requests from any domain (*) with:
# - Credentials allowed 
# - All HTTP methods permitted
# - All headers accepted
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
app.include_router(api_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"} 