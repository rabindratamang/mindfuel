import requests
from langchain_core.tools import tool
from config.setting import settings
from typing import List, Dict
from isodate import parse_duration

@tool(return_direct=True)
def search_youtube_videos(query: str, region: str = "US", language: str = "en", num_videos: int = 6) -> List[Dict]:
    """
    Search for a video on YouTube using the YouTube Data API v3.

    Args:
        query (str): The search query.
        region (str): The region code (default: US).
        language (str): The language code (default: en).

    Returns:
        List[dict]: A list of dictionaries containing video details.
    """
    search_url = "https://www.googleapis.com/youtube/v3/search"
    videos_url = "https://www.googleapis.com/youtube/v3/videos"
    channels_url = "https://www.googleapis.com/youtube/v3/channels"

    try:
        search_params = {
            'part': 'snippet',
            'q': query,
            'regionCode': region,
            'relevanceLanguage': language,
            'type': 'video',
            'maxResults': num_videos,
            'key': settings.YOUTUBE_API_KEY
        }
        search_resp = requests.get(search_url, params=search_params)
        search_resp.raise_for_status()
        search_data = search_resp.json()

        video_ids = [item['id']['videoId'] for item in search_data.get('items', [])]
        channel_ids = list(set([item['snippet']['channelId'] for item in search_data.get('items', [])]))
        if not video_ids:
            return []

        videos_params = {
            'part': 'snippet,contentDetails,statistics',
            'id': ','.join(video_ids),
            'key': settings.YOUTUBE_API_KEY
        }
        videos_resp = requests.get(videos_url, params=videos_params)
        videos_resp.raise_for_status()
        videos_data = videos_resp.json()

        channel_avatars = {}
        if channel_ids:
            channels_params = {
                'part': 'snippet',
                'id': ','.join(channel_ids),
                'key': settings.YOUTUBE_API_KEY
            }
            channels_resp = requests.get(channels_url, params=channels_params)
            channels_resp.raise_for_status()
            channels_data = channels_resp.json()
            
            for channel in channels_data.get('items', []):
                channel_id = channel['id']
                thumbnails = channel['snippet']['thumbnails']
                avatar = thumbnails.get('medium', thumbnails.get('default', {})).get('url')
                channel_avatars[channel_id] = avatar

        results = []
        for video in videos_data.get('items', []):
            snippet = video.get('snippet', {})
            stats = video.get('statistics', {})
            content = video.get('contentDetails', {})
            video_id = video.get('id')
            channel_id = snippet.get('channelId')

            duration_iso = content.get('duration', 'PT0S')
            duration_seconds = int(parse_duration(duration_iso).total_seconds())

            result = {
                "video_id": video_id,
                "video_url": f"https://www.youtube.com/watch?v={video_id}",
                "title": snippet.get("title"),
                "description": snippet.get("description"),
                "duration_seconds": duration_seconds,
                "published_time": snippet.get("publishedAt"),
                "views": int(stats.get("viewCount", 0)),
                "thumbnail": snippet.get("thumbnails", {}).get("high", {}).get("url"),
                "channel": {
                    "title": snippet.get("channelTitle"),
                    "channel_id": channel_id,
                    "avatar": channel_avatars.get(channel_id),
                    "channel_url": f"https://www.youtube.com/channel/{channel_id}"
                }
            }
            results.append(result)

        return results

    except requests.exceptions.RequestException as e:
        return [{"error": f"Error during YouTube API request: {str(e)}"}]
    except Exception as e:
        return [{"error": f"Unexpected error: {str(e)}"}]