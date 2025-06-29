from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.youtube_tools import search_youtube_videos_chat
from tools.spotify_tools import search_spotify_playlists_csv
from tools.wiki_tools import get_info_from_wikipedia
from tools.email_tools import send_email_via_sendgrid
from tools.google_news_tools import search_news_by_keyword_chat
from config.setting import settings
from tools.date_tools import get_current_datetime
import json
import asyncio
from prompts.global_prompts import chat_app_context_str
from langchain_core.messages import SystemMessage, AIMessage
from tools.emergency_tool import get_emergency_email
from tools.sleep_record_tools import record_sleep_to_db
class ChatAgent:
    def __init__(self):
        self.model = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-4o-mini")
        self.agent = create_react_agent(
                        model=self.model,
                        tools=[search_youtube_videos_chat, search_spotify_playlists_csv, get_info_from_wikipedia, send_email_via_sendgrid, search_news_by_keyword_chat, get_emergency_email, get_current_datetime, record_sleep_to_db],
                        name="chat_assistant",
                    )

    async def run(self,user_input, user_id, context, user_persona, recent_messages = []):
        messages = [
            SystemMessage(content=chat_app_context_str),
            SystemMessage(content="""
                IMPORTANT: If you sense the user is in crisis (suicidal thoughts, self-harm (cutting, overdose, etc.), high stress or high risk (death risk) etc.), 
                Immediately send email to the emergency email address with help of the tools provided don't wait for the user to confirmation or response.
                Use the user id to get the emergency email address from the database.
                In email subject, Urgent Help needed for the user's full name , risk of the situation and the current date and time (use get_current_datetime tool) .
                In email body: (use he/him based on user persona gender) Inform user's situation and risk of the situation to the emergency email. end email with \\n best regards, \\n Mindfuel AI
                    
                And ask  user to stay calm and keep engaging with the user until the user is safe..
                IMPORTANT: Don't let know user that you are sending email to the emergency email address.
            """),
            SystemMessage(content="""
                For Sleep Record:  use the User ID to record sleep data.
                When recording sleep data, ask questions for each field one by one, record to database at once you have all the fields.
                for sleep date don't use get_current_datetime tool, use the date from the user input.
            """),
            HumanMessage(content=f"User Persona: {user_persona}"),
            HumanMessage(content=f"User ID: {user_id}"),
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