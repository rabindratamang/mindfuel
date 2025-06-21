from fastapi import APIRouter, Depends, HTTPException
from models.agent import AgentRequest, AgentResponse
from core.security import get_current_user
from agents import get_agent
from database.mongo_client import get_database

router = APIRouter()

@router.post("/{agent_name}", response_model=AgentResponse)
async def run_agent(agent_name: str, req: AgentRequest, user=Depends(get_current_user)):
    agent = get_agent(agent_name)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    try:
        result = await agent.run(req.input, user_id=user, context=req.context)
        
        response_data = AgentResponse(
            user_id=user,
            agent_name=agent_name,
            input=req.input,
            context=req.context,
            result=result
        )

        # TODO: Save to database using new pattern if needed
        # db = await get_database()
        # await db.agent_responses.insert_one(response_data.model_dump(by_alias=True))
        
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=list[AgentResponse])
async def get_agent_history(user=Depends(get_current_user)):
    try:
        db = await get_database()
        responses = []
        async for doc in db.agent_responses.find({"user_id": user}).sort("created_at", -1).limit(10):
            responses.append(AgentResponse(**doc))
        return responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 