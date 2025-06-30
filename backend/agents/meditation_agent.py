from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, SystemMessage
from tools.meditation_tools import rag_tool
from tools.youtube_tools import search_youtube_videos_chat
from config.setting import settings
import asyncio
import json
class MeditationAgent:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.model = ChatOpenAI(api_key=self.openai_api_key, model="gpt-4o-mini", verbose=True)
        self.agent = create_react_agent(
            model=self.model,
            tools=[search_youtube_videos_chat],
            prompt="""
                    You are a helpful Meditation assistant.
                    Always return your final answer in **valid JSON** format structured like this:

                    {
                    id: string
                    title: string
                    description: string
                    steps: Array<{
                        step: number
                        instruction: string
                        duration: number // seconds
                        type: "breathing" | "visualization" | "body_scan" | "mindfulness"
                    }>
                    totalDuration: number // seconds
                    category: string
                    moodBased: boolean
                    difficulty: "beginner" | "intermediate" | "advanced"
                    generatedAt: string,
                    youtube_videos: Array<YouTubeMeditation> // use search_youtube_videos_chat tool to get youtube videos
                    }

                    interface YouTubeMeditation {
                    id: string
                        title: string
                        description: string
                        videoId: string
                        channelName: string
                        channelAvatar?: string
                        thumbnail: string
                        duration: number
                        category: string
                        rating: number
                        viewCount: string
                    }

                    Ensure the JSON is syntactically valid and can be parsed by a machine.
                    """,
            name="meditation_agent"
        )

    async def run(self,user_input, user_id, context, user_persona):
        response = await asyncio.to_thread(self.agent.invoke, {
            "messages": [
                HumanMessage(content=f"User background: {user_persona}"),
                HumanMessage(content=f"{context.get('duration', '5')} min meditation for {context.get('goals', 'relaxation')}. Return your answer in JSON format."),
                SystemMessage(content=f"Use the search_youtube_videos_chat tool to get youtube videos.")
            ]
        }, config={"recursion_limit": 50})
        frontend_response = json.loads(response["messages"][-1].content)
        frontend_response["premiumAudios"] = [
            {
                "id": "1",
                "title": "Mindfulness Meditation",
                "description": "A meditation to help you stay present and focused.",
                "audioUrl": "/meditation_speech_1.mp3",
                "duration": 93,
                "category": "meditation",
                "rating": 4.5
            },
            {
                "id": "2",
                "title": "Breathing Meditation",
                "description": "A meditation to help you breathe better.",
                "audioUrl": "/meditation_speech.mp3",
                "duration": 66,
                "category": "meditation",
                "rating": 4.5
            }
        ] 
        return {
            "frontend_format": frontend_response,
        }