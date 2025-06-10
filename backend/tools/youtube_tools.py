import os
import requests
from langchain_core.tools import tool

@tool
def search_youtube_video(query: str, region: str = "US", language: str = "en") -> str:
    """
    Search for a video on YouTube using the RapidAPI YouTube138 API.
    """
    rapidapi_key = os.getenv("RAPIDAPI_KEY")
    url = "https://youtube138.p.rapidapi.com/search/"
    params = {"q": query, "hl": language, "gl": region}
    headers = {
        "x-rapidapi-key": rapidapi_key,
        "x-rapidapi-host": "youtube138.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        for result in data.get("contents", []):
            video = result.get("video")
            if video:
                title = video.get("title")
                video_id = video.get("videoId")
                video_url = f"https://www.youtube.com/watch?v={video_id}"
                return f"Final Answer: Top result:\nTitle: {title}\nURL: {video_url}"
        return "Final Answer: No video found for your query."
    except requests.exceptions.RequestException as e:
        return f"Error during YouTube search: {str(e)}"
    except (KeyError, IndexError, TypeError) as e:
        return f"Unexpected response format: {str(e)}" 