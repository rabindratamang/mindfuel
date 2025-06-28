from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import Tool
from langchain_core.messages import HumanMessage
from tools.youtube_tools import search_youtube_videos
from tools.spotify_tools import search_spotify_playlists
from tools.g_news_tools import search_g_news_by_keyword
from config.setting import settings
import json

class ContentGeneratorAgent:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.model = ChatOpenAI(
            api_key=self.openai_api_key,
            model="gpt-4o-mini",
            temperature=0.3,
            max_tokens=2000
        )
        
        self.system_prompt = """You are a helpful content generator agent. Your job is to help users get content based on their needs.
            You will be given a user's needs and you will need to use the search_youtube_videos or search_spotify_playlists tools to get the content.
            ALWAYS return ONLY a valid JSON array of video results with the following structure:
            Do not include any commentary or explanation outside the JSON array. Only return valid JSON."""
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}")
        ])
        
        self.agent = create_tool_calling_agent(
            llm=self.model,
            tools=[search_youtube_videos, search_spotify_playlists, search_g_news_by_keyword],
            prompt=self.prompt
        )
        
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=[search_youtube_videos, search_spotify_playlists, search_g_news_by_keyword],
            name="content_generator_agent",
            verbose=False,
            max_iterations=1,
        )

    def run(self, content_type: str, recommendation: dict):
        """
        Execute the agent with the given user input.
        
        Args:
            content_type (str): The type of content to generate (youtube or spotify)
            recommendation (dict): The recommendation from the mood analyzer (youtube_rec or spotify_rec)
                for example:
                youtube_rec = {
                    "types": ["string"], // meditation, breathing exercises, motivational, educational, etc.
                    "keywords": ["string"], // at least 5 search keywords for relevant videos
                    "duration": "string", // short (0-10min), medium (10-30min), long (30min+)
                    "mood": "string" // target mood for content,
                    "num_videos": number // exactly 6 videos
                }

                spotify_rec = {
                    "keywords": ["string"], // at least 5 search keywords for relevant playlists
                    "genres": ["string"], // ambient, classical, nature sounds, podcast etc relevant to the analysis.
                    "energy": number, // 0-1 (0=calm, 1=energetic)
                    "valence": number, // 0-1 (0=sad, 1=happy)
                    "mood": "string" // relaxing, uplifting, focus, etc relevant to the analysis.
                }
        Returns:
            for youtube:
                array of dicts with video results
            for spotify:
                dict with playlist results
        """
        
        if content_type == "youtube":
            types = recommendation.get("types", [])
            keywords = recommendation.get("keywords", [])
            mood = recommendation.get("mood", "")
            duration = recommendation.get("duration", "")
            num_videos = recommendation.get("num_videos", 1)
            user_input = (
                f"Find {num_videos} YouTube videos that includes the following:\n"
                f"- Types: {', '.join(types)}\n"
                f"- Keywords: {', '.join(keywords)}\n"
                f"- Mood: {mood}\n"
                f"- Duration: {duration} (e.g., 0-10min=short, 10-30min=medium, 30min+=long)\n\n"
                "Prepare a comprehensive search query based on all the above fields for the search_youtube_videos tool"
                "IMPORTANT: Do not use the search_spotify_playlists or search_news_by_keyword tool for this field, only use the search_youtube_videos tool strictly for this field, use single tool call for this field"
                "Only return array of JSON with: title, video_url, duration_seconds, thumbnail, and channel details. even if there is only one video"
                "Do not include any commentary or explanation outside the JSON array. Only return valid JSON array. Example do not wrap it in ```json or any markdown formatting"
            )
        elif content_type == "spotify":
            num_playlists = recommendation.get("num_playlists", 1)
            mood = recommendation.get("mood", "")
            genres = recommendation.get("genres", [])
            keywords = recommendation.get("keywords", [])
            energy = recommendation.get("energy", "")
            valence = recommendation.get("valence", "")
            duration = recommendation.get("duration", "")
            user_input = (
                f"Find {num_playlists} Spotify playlists that includes the following:\n"
                f"- Keywords: {', '.join(keywords)}\n"
                f"- Genres: {', '.join(genres)}\n"
                f"- Mood: {mood}\n"
                f"- Energy: {energy}\n"
                f"- Valence: {valence}\n"
                f"- Duration: {duration} (e.g., 0-10min=short, 10-30min=medium, 30min+=long)\n\n"
                "Generate a comprehensive search query based on all the above fields for the search_spotify_playlists tool \n "
                "IMPORTANT: Do not use the search_youtube_videos or search_news_by_keyword tool for this field, only use the search_spotify_playlists tool strictly for this field, use single tool call for this field"
                "Only return array of JSON with: name, description, image, link, owner, and track count. even if there is only one playlist"
            )
        elif content_type == "articles":
            num_articles = recommendation.get("num_articles", 1)
            keywords = recommendation.get("keywords", [])
            focus = recommendation.get("focus", [])
            user_input = (
                f"Find {num_articles} news articles that includes the following:\n"
                f"- Keywords: {', '.join(keywords)}\n"
                f"- Focus: {', '.join(focus)}\n"
                "Generate a comprehensive search query based on all the above fields for the search_news_by_keyword tool \n "
                "IMPORTANT: Do not use the search_youtube_videos or search_spotify_playlists tool for this field, only use the search_news_by_keyword tool strictly for this field, use single tool call for this field"
                "Only return array of JSON with: title, snippet, news_url, thumbnail, publisher, timestamp, and published_time. even if there is only one article"
            )
        else:
            raise ValueError(f"Invalid content type: {content_type}")
        try:
            response = self.agent_executor.invoke({"input": user_input}) 
            
            content = response.get("output", "")
            
            if isinstance(content, list):
                return content
            
            if isinstance(content, dict):
                return content
            
            if isinstance(content, str):
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    if '```json' in content:
                        json_str = content.split('```json')[1].split('```')[0].strip()
                        return json.loads(json_str)
                    return {"error": "Failed to parse JSON response"}
            
            return {"error": "Unexpected response format"}
            
        except Exception as e:
            return {"error": f"Exception occurred: {str(e)}"}