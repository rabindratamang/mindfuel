from dotenv import load_dotenv
load_dotenv()
import os

from fastapi import FastAPI
from api import auth, agent

app = FastAPI()
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(agent.router, tags=["agent"])

@app.get("/health")
def health():
    return {"status": "ok"} 