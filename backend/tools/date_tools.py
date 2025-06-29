from langchain.tools import tool
from datetime import datetime

@tool
def get_current_datetime() -> str:
    """
    Returns the current date and time.

    Returns:
        str: The current date and time in format 'YYYY-MM-DD HH:MM:SS'
    """
    try:
        current_datetime = datetime.now()
        return current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    except Exception as e:
        return f"Error getting current datetime: {e}"
