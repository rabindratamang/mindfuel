from fastapi import APIRouter, Depends, HTTPException
from models.agent import AgentRequest, AgentResponse
from core.security import get_current_user
from agents import get_agent
from config.database import mongodb_obj

router = APIRouter()

@router.post("/agent/{agent_name}", response_model=AgentResponse)
async def run_agent(agent_name: str, req: AgentRequest, user=Depends(get_current_user)):
    agent = get_agent(agent_name)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    try:
        result = agent.run(req.input, user_id=user, context=req.context)
        
        response_data = AgentResponse(
            user_id=user,
            agent_name=agent_name,
            input=req.input,
            context=req.context,
            result=result
        )

        await mongodb_obj.db.agent_responses.insert_one(response_data.model_dump(by_alias=True))
        
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agent/history", response_model=list[AgentResponse])
async def get_agent_history(user=Depends(get_current_user)):
    responses = []
    async for doc in mongodb_obj.db.agent_responses.find({"user_id": user}).sort("created_at", -1).limit(10):
        responses.append(AgentResponse(**doc))
    return responses 