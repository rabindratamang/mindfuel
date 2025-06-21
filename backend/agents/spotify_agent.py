import json
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.spotify_tools import search_spotify_playlists
from config.setting import settings

class SpotifyAgent:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.model = ChatOpenAI(api_key=self.openai_api_key, model="gpt-4o-mini", verbose=True)
        self.agent = create_react_agent(
                        model=self.model,
                        tools=[search_spotify_playlists],
                        prompt=(
                            "You are a helpful Spotify assistant. Your job is to help users discover Spotify playlists "
                            "based on their search queries using the tool provided.\n\n"
                            "🧠 Think step-by-step, and always call the `search_spotify_playlists` tool with the user query.\n"
                            "📦 When returning results to the user, format the final output in **JSON** using this structure:\n\n"
                            "{\n"
                            '  "query": string,\n'
                            '  "total": integer,\n'
                            '  "playlists": [\n'
                            "    {\n"
                            '      "name": string,\n'
                            '      "description": string,\n'
                            '      "external_url": string,\n'
                            '      "image": string,\n'
                            '      "owner": {"name": string, "url": string},\n'
                            '      "tracks": {"url": string, "total": integer}\n'
                            "    },\n"
                            "    ...\n"
                            "  ]\n"
                            "}\n\n"
                            "Only return JSON. Do not add any extra commentary or text outside of the JSON structure."
                        ),
                        name="spotify_assistant"
                    )

    def run(self, user_input):
        response = self.agent.invoke({
            "messages": [HumanMessage(content=user_input)]
        }, config={"recursion_limit": 50})
        return response["messages"][-1].content

    def get_spotify_recommendation(self, spotify_recommendation: dict):
        try:
            genres = spotify_recommendation.get("genres", [])
            mood = spotify_recommendation.get("mood", "")
            energy = spotify_recommendation.get("energy", "")
            valence = spotify_recommendation.get("valence", "")

            prompt = (
                "Find a Spotify playlist or track recommendation with the following:\n"
                f"- Genres: {', '.join(genres)}\n"
                f"- Mood: {mood}\n"
                f"- Energy level: {energy} (0=low, 1=high)\n"
                f"- Valence (positivity): {valence} (0=sad, 1=happy)\n\n"
                "Only return JSON with: title, spotify_url, duration_seconds, thumbnail, and artist/playlist details."
            )

            response = self.agent.invoke({
                "messages": [HumanMessage(content=prompt)]
            })
    
            content = response["messages"][-1].content

            if isinstance(content, dict):
                return content  # already a dict

            if isinstance(content, str):
                try:
                    return json.loads(content)
                except json.JSONDecodeError as e:
                    return {"error": f"Failed to parse JSON: {str(e)}"}

            return {"error": "Unknown content format from Spotify assistant."}

        except Exception as e:
            return {"error": f"Exception occurred: {str(e)}"}