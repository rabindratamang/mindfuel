from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import Tool
from langchain_core.messages import HumanMessage
from tools.youtube_tools import search_youtube_videos
from tools.spotify_tools import search_spotify_playlists
from config.setting import settings
import json

class YoutubeAgent:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.model = ChatOpenAI(
            api_key=self.openai_api_key,
            model="gpt-4o-mini",
            temperature=0.3,
            max_tokens=2000
        )
        
        # Convert the search function to a LangChain Tool
        self.youtube_tool = Tool.from_function(
            func=search_youtube_videos,
            return_direct=True ,
            name="search_youtube_videos",
            description="Search YouTube videos. Returns a list of videos with details including video_id, title, description, duration, and channel information."
        )
        
        # Define the system prompt similar to React agent
        self.system_prompt = """You are a helpful YouTube video assistant. Your job is to help users find YouTube videos 
            based on their search queries using the search_youtube_videos tool. 

            ALWAYS return ONLY a valid JSON array of video results with the following structure:
            [
            {{
                "query": string,
                "video_id": string,
                "video_url": string,
                "title": string,
                "description": string,
                "duration_seconds": integer,
                "published_time": string,
                "views": integer,
                "thumbnail": string,
                "channel": {{
                "title": string,
                "channel_id": string,
                "avatar": string,
                "channel_url": string
                }}
            }}
            ]

            Do not include any commentary or explanation outside the JSON array. Only return valid JSON."""
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}")
        ])
        
        self.agent = create_tool_calling_agent(
            llm=self.model,
            tools=[self.youtube_tool],
            prompt=self.prompt
        )
        
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=[self.youtube_tool],
            name="youtube_assitant",
            verbose=False,
            max_iterations=2,
        )

    def run(self, user_input, user_id=None, context=None):
        """
        Execute the agent with the given user input.
        
        Args:
            user_input (str): The user's search query
            user_id (str, optional): User ID for personalization
            context (dict, optional): Additional context
            
        Returns:
            dict: JSON array of video results or error message
        """
        try:
            response = self.agent_executor.invoke({"input": user_input})
            
            content = response.get("output", "")
            
            if isinstance(content, list):
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

    def get_youtube_video(self, youtube_recommendation: dict, num_videos: int = 1):
        """
        Find YouTube videos based on recommendation criteria.
        
        Args:
            youtube_recommendation (dict): Dictionary containing search criteria
            num_videos (int): Number of videos to return
            
        Returns:
            dict: JSON array of video results or error message
        """
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

            return self.run(prompt)
            
        except Exception as e:
            return {"error": f"Exception occurred: {str(e)}"}


# Example usage and testing
if __name__ == "__main__":
    # Create the agent
    agent = YoutubeAgent()
    
    # Test basic search
    print("Testing YouTube Tool Calling Agent:")
    print("=" * 50)
    
    # Test 1: Basic search
    print("\nTest 1: Basic search")
    result = agent.run("Find meditation videos")
    print(f"Result: {result}")
    
    # Test 2: Specific criteria
    print("\nTest 2: Specific criteria")
    recommendation = {
        "types": ["meditation", "breathing"],
        "keywords": ["stress relief", "calm"],
        "mood": "relaxing",
        "duration": "short"
    }
    result = agent.get_youtube_video(recommendation, num_videos=3)
    print(f"Result: {result}")
