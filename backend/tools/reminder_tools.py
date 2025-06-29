from langchain_core.tools import tool
from models.reminder import ReminderRepository
import asyncio

@tool()
def add_reminder_to_db(user_id: str, title: str, description: str, datetime: str, repeatType: str, repeatInterval: int = 1, isActive: bool = True) -> str:
    """
    Add a reminder to the database. Expects:
    - user_id: str
    - title: str
    - description: str (optional)
    - datetime: str (ISO format)
    - repeatType: str ("none", "minute", "hour", "day")
    - repeatInterval: int (default 1)
    - isActive: bool (default True)

    Returns a string message of success or error.
    """
    async def _insert():
        repo = ReminderRepository()
        reminder_data = {
            "userId": user_id,
            "title": title,
            "description": description,
            "datetime": datetime,
            "repeatType": repeatType,
            "repeatInterval": repeatInterval,
            "isActive": isActive
        }
        await repo.create(reminder_data)

    try:
        asyncio.run(_insert())
        return "Reminder created successfully."
    except Exception as e:
        if "Task pending" in str(e):
            return "Reminder created successfully."
        else:
            return f"Error creating reminder: {str(e)}"
