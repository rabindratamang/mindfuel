from langchain_core.tools import tool
import requests
import time
from config.setting import settings

@tool(return_direct=True)
def search_news_by_keyword(keyword: str, region: str = "en-US", num_articles: int = 3) -> dict:
    """
    Search Google News for articles matching a keyword using the google-news13 API.

    Args:
        keyword (str): The keyword to search for.
        region (str): Language-region code (default: 'en-US').

    Returns:
        dict: A JSON object containing the keyword and a list of top 3 news articles.
    """
    url = "https://google-news13.p.rapidapi.com/search"
    querystring = {"keyword": keyword, "lr": region}
    headers = {
        "x-rapidapi-key": settings.RAPID_API_KEY,  
        "x-rapidapi-host": "google-news13.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        data = response.json()
        items = data.get("items", [])

        articles = []
        for item in items[:num_articles]:
            timestamp = item.get("timestamp")
            readable_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(int(timestamp) / 1000)) if timestamp else None

            articles.append({
                "title": item.get("title", "No title"),
                "snippet": item.get("snippet", "No summary"),
                "news_url": item.get("newsUrl", "No link"),
                "thumbnail": item.get("images", {}).get("thumbnail", ""),
                "publisher": item.get("publisher", "Unknown"),
                "timestamp": timestamp,
                "published_time": readable_time
            })

        return {
            "query": keyword,
            "total": len(articles),
            "articles": articles
        }

    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}
    except (KeyError, TypeError) as e:
        return {"error": f"Unexpected response format: {str(e)}"}
    

@tool()
def search_news_by_keyword_chat(keyword: str, region: str = "en-US", num_articles: int = 3) -> dict:
    """
    Search Google News for articles matching a keyword using the google-news13 API.

    Args:
        keyword (str): The keyword to search for.
        region (str): Language-region code (default: 'en-US').

    Returns:
        dict: A JSON object containing the keyword and a list of top 3 news articles.
    """
    url = "https://google-news13.p.rapidapi.com/search"
    querystring = {"keyword": keyword, "lr": region}
    headers = {
        "x-rapidapi-key": settings.RAPID_API_KEY,  
        "x-rapidapi-host": "google-news13.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        data = response.json()
        items = data.get("items", [])

        articles = []
        for item in items[:num_articles]:
            timestamp = item.get("timestamp")
            readable_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(int(timestamp) / 1000)) if timestamp else None

            articles.append({
                "title": item.get("title", "No title"),
                "snippet": item.get("snippet", "No summary"),
                "news_url": item.get("newsUrl", "No link"),
                "thumbnail": item.get("images", {}).get("thumbnail", ""),
                "publisher": item.get("publisher", "Unknown"),
                "timestamp": timestamp,
                "published_time": readable_time
            })

        return {
            "query": keyword,
            "total": len(articles),
            "articles": articles
        }

    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}
    except (KeyError, TypeError) as e:
        return {"error": f"Unexpected response format: {str(e)}"}