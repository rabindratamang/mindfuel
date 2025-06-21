import os
import requests
from langchain_core.tools import tool
from config.setting import settings

@tool
def search_youtube_video(query: str, region: str = "US", language: str = "en") -> dict:
    """
    Search for a video on YouTube using the RapidAPI YouTube138 API.

    Args:
        query (str): The search query (e.g., video title or keyword).
        region (str): The region code (default is 'US').
        language (str): The language code (default is 'en').

    Returns:
        dict: JSON containing details of the top video result.
    """
    url = "https://youtube138.p.rapidapi.com/search/"
    params = {
        "q": query,
        "hl": language,
        "gl": region
    }
    headers = {
        "x-rapidapi-key": settings.RAPID_API_KEY,  
        "x-rapidapi-host": "youtube138.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        for result in data.get("contents", []):
            video = result.get("video")
            if video:
                video_id = video.get("videoId")
                return {
                    "query": query,
                    "video_id": video_id,
                    "video_url": f"https://www.youtube.com/watch?v={video_id}",
                    "title": video.get("title"),
                    "description": video.get("descriptionSnippet"),
                    "duration_seconds": video.get("lengthSeconds"),
                    "published_time": video.get("publishedTimeText"),
                    "views": video.get("stats", {}).get("views"),
                    "thumbnail": video.get("thumbnails", [{}])[0].get("url"),
                    "channel": {
                        "title": video.get("author", {}).get("title"),
                        "channel_id": video.get("author", {}).get("channelId"),
                        "avatar": video.get("author", {}).get("avatar", [{}])[0].get("url"),
                        "channel_url": f"https://www.youtube.com/channel/{video.get('author', {}).get('channelId')}"
                    }
                }

        return {"message": "No video found for your query."}

    except requests.exceptions.RequestException as e:
        return {"error": f"Error during YouTube search: {str(e)}"}
    except (KeyError, IndexError, TypeError) as e:
        return {"error": f"Unexpected response format: {str(e)}"}