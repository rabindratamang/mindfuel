import os
import requests
from langchain_core.tools import tool
from config.setting import settings
from typing import List


def get_spotify_token(client_id: str, client_secret: str) -> str:
    """
    Fetches a bearer token from Spotify using client credentials.
    """
    url = 'https://accounts.spotify.com/api/token'
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    data = {'grant_type': 'client_credentials'}
    response = requests.post(url, headers=headers, data=data, auth=(client_id, client_secret))
    response.raise_for_status()
    return response.json()['access_token']


@tool
def search_spotify_playlists(query: str) -> dict:
    """
    Search for Spotify playlists using a keyword (e.g., "sleep", "meditation").

    Returns a JSON object with the top 5 playlists including name, description, image, link, owner, and track count.
    """
    client_id = settings.SPOTIFY_CLIENT_ID
    client_secret = settings.SPOTIFY_CLIENT_SECRET

    try:
        token = get_spotify_token(client_id, client_secret)
        headers = {
            'Authorization': f'Bearer {token}'
        }
        params = {
            'q': query,
            'type': 'playlist',
            'limit': 5
        }
        url = 'https://api.spotify.com/v1/search'
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        playlists = response.json().get('playlists', {}).get('items', [])

        if not playlists:
            return {"message": "No playlists found for your query."}

        result = {
            "query": query,
            "total": len(playlists),
            "playlists": []
        }

        for pl in playlists:
            if pl is None:
                continue

            result["playlists"].append({
                "name": pl.get('name'),
                "description": pl.get('description'),
                "external_url": pl.get('external_urls', {}).get('spotify'),
                "image": pl.get('images', [{}])[0].get('url'),
                "owner": {
                    "name": pl.get('owner', {}).get('display_name'),
                    "url": pl.get('owner', {}).get('external_urls', {}).get('spotify')
                },
                "tracks": {
                    "url": pl.get('tracks', {}).get('href'),
                    "total": pl.get('tracks', {}).get('total')
                }
            })

        return result

    except Exception as e:
        return {"error": str(e)}

