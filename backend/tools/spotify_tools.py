import os
import requests
from langchain_core.tools import tool
from config.setting import settings
from typing import List
import csv
import io
import re

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


@tool(return_direct=True)
def search_spotify_playlists(query: str, num_playlists: int = 1) -> dict:
    """
    Search for Spotify playlists using a keyword (e.g., "sleep", "meditation").

    Args:
        query (str): The search query.
        num_playlists (int): The number of playlists to return (default: 6).

    Returns:
        dict: A dictionary containing playlist details.
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
            'limit': num_playlists
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


@tool()
def search_spotify_playlists_csv(query: str, num_playlists: int = 1) -> dict:
    """
    Search for Spotify playlists using a keyword (e.g., "sleep", "meditation").

    Args:
        query (str): The search query.
        num_playlists (int): The number of playlists to return (default: 6).

    Returns:
        csv: A csv containing playlist details.

        example:
        "name", "description", "url", "image", "owner_name", "tracks_url", "tracks_total"
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
            'limit': num_playlists
        }
        url = 'https://api.spotify.com/v1/search'
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        playlists = response.json().get('playlists', {}).get('items', [])

        if not playlists:
            return "message\nNo playlists found for your query."

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "name", "description", "url", "image", "owner_name", "tracks_url", "tracks_total"
        ])
        for pl in playlists:
            if pl is None:
                continue
            writer.writerow([
                pl.get('name', ''),
                re.sub(r'[^A-Za-z0-9 ]+', '', pl.get('description', '')),
                pl.get('external_urls', {}).get('spotify', ''),
                pl.get('images', [{}])[0].get('url', ''),
                pl.get('owner', {}).get('display_name', ''),
                pl.get('tracks', {}).get('href', ''),
                pl.get('tracks', {}).get('total', '')
            ])
        return output.getvalue()

    except Exception as e:
        return f"error\n{str(e)}"