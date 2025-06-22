from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class AgentRequest(BaseModel):
    input: str
    context: Optional[str] = None

class AgentResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    user_id: str
    agent_name: str
    input: str
    context: Optional[Dict[str, Any]] = None
    result: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        } 