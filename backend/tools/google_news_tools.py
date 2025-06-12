from langchain_core.tools import tool
import requests
import os
from config.setting import RAPIDAPI_KEY
@tool
def search_news_by_keyword(keyword: str, region: str = "en-US") -> str:
    """
    Search Google News for articles matching a keyword using the google-news13 API.

    Args:
        keyword (str): The keyword to search for.
        region (str): Language-region code (default: 'en-US').

    Returns:
        str: A summary of the top 3 news articles with title, summary, and link.
    """
    rapidapi_key = RAPIDAPI_KEY
    url = "https://google-news13.p.rapidapi.com/search"
    querystring = {"keyword": keyword, "lr": region}
    headers = {
        "x-rapidapi-key": rapidapi_key,
        "x-rapidapi-host": "google-news13.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        data = response.json()
        items = data.get("items", [])

        if not items:
            return f"No news found for keyword: {keyword}"

        result = f"📰 Top News for '{keyword}':\n"
        for idx, item in enumerate(items[:3], start=1):  # Top 3 items
            title = item.get("title", "No title")
            snippet = item.get("snippet", "No summary")
            link = item.get("newsUrl", "No link")
            result += f"\n{idx}. {title}\n📄 {snippet}\n🔗 {link}\n"
        return result.strip()

    except requests.exceptions.RequestException as e:
        return f"❌ Error fetching news: {str(e)}"
    except (KeyError, TypeError) as e:
        return f"❌ Unexpected response format: {str(e)}"
