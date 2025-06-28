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
                            "You are a helpful Spotify assistant. Your ONLY task is to help users discover Spotify playlists "
                            "based on their search queries using the tool provided.\n\n"
                            "RULES YOU MUST FOLLOW:\n"
                            "1. ALWAYS call the `search_spotify_playlists` tool with the user query\n"
                            "2. Your FINAL response MUST be EXACTLY in this JSON format:\n"
                            "{\n"
                            '  "query": "user\'s original search query",\n'
                            '  "total": number_of_results,\n'
                            '  "playlists": [\n'
                            "    {\n"
                            '      "name": "playlist name",\n'
                            '      "description": "playlist description",\n'
                            '      "external_url": "https://spotify.com/...",\n'
                            '      "image": "https://image.url",\n'
                            '      "owner": {"name": "owner name", "url": "owner url"},\n'
                            '      "tracks": {"url": "tracks url", "total": number_of_tracks}\n'
                            "    }\n"
                            "  ]\n"
                            "}\n\n"
                            "3. Your response must ONLY contain valid JSON - NO other text, NO markdown, NO explanations\n"
                            "4. If you cannot find results, return empty playlists array but maintain the structure\n"
                            "5. If you violate these rules, the application will FAIL\n\n"
                            "EXAMPLE OUTPUT:\n"
                            '{"query":"chill vibes","total":1,"playlists":[{"name": "Epic Emotional Music | Uplifting Inspirational", "description": " Ｏｒｃｈｅｓｔｒａｌ · Ｂｅａｕｔｉｆｕｌ · Ｆａｎｔａｓｙ · Ｈｅｒｏｉｃ", "external_url": "https://open.spotify.com/playlist/6MyTOl5TsKpoGCmbLrXD79", "image": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da847a9a381db427fd08da2e1899", "owner": {"name": "kainser", "url": "https://open.spotify.com/user/jbxz5ezbhylij5jr4czsdx3ew"}, "tracks": {"url": "https://api.spotify.com/v1/playlists/6MyTOl5TsKpoGCmbLrXD79/tracks", "total": 716}}]}'
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
            keywords = spotify_recommendation.get("keywords", [])
            mood = spotify_recommendation.get("mood", "")
            energy = spotify_recommendation.get("energy", "")
            valence = spotify_recommendation.get("valence", "")

            prompt = (
                "Find a Spotify playlist or track recommendation with the following:\n"
                f"- Genres: {', '.join(genres)}\n"
                f"- Keywords: {', '.join(keywords)}\n"
                f"- Mood: {mood}\n"
                f"- Energy level: {energy} (0=low, 1=high)\n"
                f"- Valence (positivity): {valence} (0=sad, 1=happy)\n\n"
                "Do not include any commentary or explanation outside the JSON. Only return valid JSON. Example do not wrap it in ```json or any markdown formatting"
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