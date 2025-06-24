from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.youtube_tools import search_youtube_videos
from tools.spotify_tools import search_spotify_playlists
from config.setting import settings
import json
import asyncio
from prompts.global_prompts import chat_app_context_str
from langchain_core.messages import SystemMessage, AIMessage

class ChatAgent:
    def __init__(self):
        self.model = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-4o-mini")
        self.agent = create_react_agent(
                        model=self.model,
                        tools=[search_youtube_videos, search_spotify_playlists],
                        name="chat_assistant",
                    )

    async def run(self,user_input, user_id, context, user_persona, recent_messages = []):
        messages = [
            SystemMessage(content=chat_app_context_str),
            HumanMessage(content=f"User Persona: {user_persona}"),
            HumanMessage(content=f"Context: {context}"),
        ]

        for message in recent_messages:
            if(message.get("sender") == "user"):
                messages.append(HumanMessage(content=message.get("content")))   
            else:
                messages.append(AIMessage(content=message.get("content")))

        messages.append(HumanMessage(content=user_input))
        response = await asyncio.to_thread(self.agent.invoke, {"messages": messages})
        return {
            "message": response["messages"][-1].content,
            "mood": response.get("mood", "" ),
            "suggestions": response.get("suggestions", []),
            "resources": response.get("resources", []),
        } 