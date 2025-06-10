from pydantic import BaseModel

class AgentRequest(BaseModel):
    user_id: str
    input: str
    context: dict = {} 