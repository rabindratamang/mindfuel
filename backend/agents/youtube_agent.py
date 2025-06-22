from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.youtube_tools import search_youtube_videos
from config.setting import settings
import json

class YoutubeAgent:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.model = ChatOpenAI(api_key=self.openai_api_key, model="gpt-4o-mini")
        self.agent = create_react_agent(
                        model=self.model,
                        tools=[search_youtube_videos],
                        prompt=(
                            "You are a helpful YouTube video assistant. Your job is to help users find YouTube videos "
                            "based on their search queries using the `search_youtube_videos` tool.\n\n"
                            "Think step-by-step and always call the tool using the user's query.\n"
                            "When returning the result to the user, **always format the output strictly as a JSON array** using the structure below, even if there is only one video:\n\n"
                            "[\n"
                            "  {\n"
                            '    "query": string,\n'
                            '    "video_id": string,\n'
                            '    "video_url": string,\n'
                            '    "title": string,\n'
                            '    "description": string,\n'
                            '    "duration_seconds": integer,\n'
                            '    "published_time": string,\n'
                            '    "views": integer,\n'
                            '    "thumbnail": string,\n'
                            '    "channel": {\n'
                            '      "title": string,\n'
                            '      "channel_id": string,\n'
                            '      "avatar": string,\n'
                            '      "channel_url": string\n'
                            "    }\n"
                            "  }\n"
                            "]\n\n"
                            "❗️Do not include any commentary or explanation outside the JSON. Only return a valid JSON array."
                        ),
                        name="youtube_assistant"
                    )

    def run(self, user_input, user_id=None, context=None):
        response = self.agent.invoke({
            "messages": [HumanMessage(content=user_input)]
        }, config={"recursion_limit": 50})
        return response["messages"][-1].content 
    
    def get_youtube_video(self, youtube_recommendation: dict, num_videos: int = 1):
        try:
            types = youtube_recommendation.get("types", [])
            keywords = youtube_recommendation.get("keywords", [])
            mood = youtube_recommendation.get("mood", "")
            duration = youtube_recommendation.get("duration", "")

            prompt = (
                f"Find {num_videos} YouTube videos that includes the following:\n"
                f"- Types: {', '.join(types)}\n"
                f"- Keywords: {', '.join(keywords)}\n"
                f"- Mood: {mood}\n"
                f"- Duration: {duration} (e.g., 0-10min=short, 10-30min=medium, 30min+=long)\n\n"
                "Only return array of JSON with: title, video_url, duration_seconds, thumbnail, and channel details. even if there is only one video"
                "Do not include any commentary or explanation outside the JSON array. Only return valid JSON array. Example do not wrap it in ```json or any markdown formatting"
            )

            response = self.agent.invoke({
                "messages": [HumanMessage(content=prompt)]
            })

            content = response["messages"][-1].content

            if isinstance(content, dict):
                return content 

            if isinstance(content, str):
                try:
                    return json.loads(content)
                except json.JSONDecodeError as e:
                    return {"error": f"Failed to parse JSON: {str(e)}"}

            return {"error": "Unknown content format from YouTube assistant."}

        except Exception as e:
            return {"error": f"Exception occurred: {str(e)}"}