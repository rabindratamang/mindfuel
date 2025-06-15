import asyncio
from langchain.tools import tool
from typing import List
import os
from googletrans import Translator

@tool
def localize_to_nepali(content: str) -> str:
    """
    Translates English text into Nepali using an async translator wrapped in sync.
    """
    async def translate_async():
        translator = Translator()
        translated = await translator.translate(content, src='en', dest='ne')
        return translated.text

    try:
        return asyncio.run(translate_async())
    except Exception as e:
        return f"Translation failed due to: {str(e)}"
