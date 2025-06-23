from fastapi import APIRouter, Depends, HTTPException, status, Request
from models.chat import ChatModel, MessageModel
from models.user import UserInDB
from database.mongo_client import get_database
from typing import Any, Dict
from datetime import datetime
from bson import ObjectId
from models.chat import ChatRepository, MessageRepository
from core.security import get_current_user
from agents import get_agent

chat_repository = ChatRepository()
message_repository = MessageRepository()

router = APIRouter()



@router.post("/initialize")
async def initialize_chat(current_user_info = Depends(get_current_user)):
    current_user = current_user_info["user"]
    chat = ChatModel(
        userId=current_user.id,
    )
    chat_id = await chat_repository.create(chat)
    return {"chatId": str(chat_id)}

@router.post("/{chatId}/message")
async def send_message(
    chatId: str,
    body: Dict[str, Any],
    current_user_info = Depends(get_current_user)
):
    current_user = current_user_info["user"]
    chat = await chat_repository.get_by_id(chatId)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    user_message = MessageModel(
        chatId=chatId,
        userId=current_user.id,
        content=body["message"],
        sender="user",
        timestamp=datetime.utcnow(),
    )
    await message_repository.create(user_message)
    context = body.get("context", {})
    recent_messages = context.get("recentMessages", [])
    
    chat_agent = get_agent("chat_agent")
    ai_response = await chat_agent.run(
        user_input=body["message"],
        user_id=current_user.id,
        context=None,
        user_persona=current_user_info["user_persona"],
        recent_messages=recent_messages
    )
    ai_message = MessageModel(
        chatId=chatId,
        userId=current_user.id,
        content=ai_response["message"],
        sender="ai",
        timestamp=datetime.utcnow(),
        mood=ai_response.get("mood"),
        suggestions=ai_response.get("suggestions"),
    )
    await message_repository.create(ai_message)
    return ai_response 