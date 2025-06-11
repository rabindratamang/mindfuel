import os
import requests
from langchain_core.tools import tool
from config.setting import CLIENT_ID, CLIENT_SECRET
from typing import List


# Optional: Use a dataclass to format results more clearly
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
def search_spotify_playlists(query: str) -> str:
    """
    Search for Spotify playlists using a keyword (e.g., "sleep", "meditation").

    Returns the top 5 playlist names with their Spotify links.
    """

    # Replace with your actual credentials (or store securely)
    client_id = CLIENT_ID
    client_secret = CLIENT_SECRET

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
            return "No playlists found for your query."
        result = []
        for pl in playlists:
            if pl is None:
                continue  # Skip null entries

            name = pl.get('name', 'Unknown Title')
            link = pl.get('external_urls', {}).get('spotify', 'No URL available')
            desc = pl.get('description', 'None description')

            result.append(f"🎵 {name}\n🔗 {link} 📝 {desc.strip()[:100] or 'No description.'}")

        return "\n\n".join(result)

    except Exception as e:
        return f"Failed to search playlists: {e}"

