from langchain_core.tools import tool
import requests
import time
from config.setting import settings

@tool(return_direct=True)
def search_g_news_by_keyword(query: str, language: str = "en", country: str = "us", num_articles: int = 3) -> dict:
    """
    Search G News for articles matching a query.

    Args:
        query (str): The query to search for.
        language (str): Language code (default: 'en').
        country (str): Country code (default: 'us').
        num_articles (int): Number of articles to return (default: 3).

    Returns:
        dict: A JSON object containing the query and a list of top n news articles.
    """
    url = "https://gnews.io/api/v4/search"
    
    query_words = query.split()
    processed_query = process_query_words(query_words)
    querystring = {"q": processed_query, "lang": language, "country": country, "max": num_articles, "apikey": "c7cc8df87db23287fd0f60e44dd4fea2"}

    try:
        response = requests.get(url, params=querystring)
        response.raise_for_status()
        data = response.json()
        items = data.get("articles", [])

        articles = []
        for item in items[:num_articles]:
            articles.append({
                "title": item.get("title", "No title"),
                "snippet": item.get("description", "No summary"),
                "news_url": item.get("url", "No link"),
                "thumbnail": item.get("image", ""),
                "source": {
                    "name": item.get("source", {}).get("name", "Unknown"),
                    "url": item.get("source", {}).get("url", "No link")
                },
                "published_time": item.get("publishedAt", "Unknown")
            })

        return {
            "query": query,
            "total": len(articles),
            "articles": articles
        }

    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}
    except (KeyError, TypeError) as e:
        return {"error": f"Unexpected response format: {str(e)}"}

def process_query_words(query_words):
    words = [w.replace("-", "").replace("_", "") for w in query_words]
    groups = []
    i = 0
    while i < 4:
        if i + 3 == len(words):
            group = f"({words[i]} OR {words[i+1]} OR {words[i+2]})"
            groups.append(group)
            break
        elif i + 1 < len(words):
            group = f"({words[i]} OR {words[i+1]})"
            groups.append(group)
            i += 2
        else:
            groups[-1] = groups[-1][:-1] + f" OR {words[i]})"
            i += 1
    return " AND ".join(groups)