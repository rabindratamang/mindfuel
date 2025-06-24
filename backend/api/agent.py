from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from models.agent import AgentRequest, AgentResponse
from core.security import get_current_user
from agents import get_agent
from database.mongo_client import get_database

router = APIRouter()

@router.post("/{agent_name}", response_model=AgentResponse)
async def run_agent(agent_name: str, req: AgentRequest, current_user_info: dict = Depends(get_current_user)):
    agent = get_agent(agent_name)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    user = current_user_info["user"]
    user_persona = current_user_info["user_persona"]

    try:
        result = await agent.run(user_input=req.input, user_id=user.id, context=req.context, user_persona=user_persona)
        if result.get("error"):
            raise HTTPException(status_code=500, detail=result.get("error"))
        
        return JSONResponse(content=jsonable_encoder(result.get("frontend_format")))
    except Exception as e:
        # Log the full error for debugging
        print(f"Error running agent '{agent_name}': {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred while running the agent: {e}")

@router.get("/history", response_model=list[AgentResponse])
async def get_agent_history(current_user_info: dict = Depends(get_current_user), agent_name: str = "mood_analyzer"):
    try:
        db = await get_database()
        cursor = db.agent_responses.find(
            {"user_id": current_user_info["user"].id, "agent_name": agent_name}
        ).sort("createdAt", -1).limit(20)
        
        responses = [AgentResponse(**doc) async for doc in cursor]
        return responses
    except Exception as e:
        print(f"Error fetching agent history: {e}")
        raise HTTPException(status_code=500, detail="Could not retrieve agent history.") 