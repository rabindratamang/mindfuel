from fastapi import APIRouter, Depends, HTTPException
from models.agent import AgentRequest
from core.security import get_current_user
from agents import get_agent

router = APIRouter()

@router.post("/agent/{agent_name}")
def run_agent(agent_name: str, req: AgentRequest, user=Depends(get_current_user)):
    agent = get_agent(agent_name)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    try:
        response = agent.run(req.input, user_id=user, context=req.context)
        return {"result": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 