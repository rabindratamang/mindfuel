from langchain_community.utilities import WikipediaAPIWrapper
from langchain.tools import tool
from typing import List
import requests 
 

wiki = WikipediaAPIWrapper()

@tool
def get_info_from_wikipedia(title: str) -> str:
    """Fetches information from Wikipedia."""
    result = wiki.run(title)
    return result