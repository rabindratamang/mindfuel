from langchain.tools import tool
from models.user import UserRepository
import asyncio

@tool
def get_emergency_email(user_id: str) -> str:
    """
    To get the emergency email address string of user (guardian or close to the user) from the database.
    Returns:
        str: The emergency email address.
    """
    async def _get():
        repo = UserRepository()
        user = await repo.get_by_id(user_id)
        if user and getattr(user, 'emergencyEmail', None):
            return user.emergencyEmail
        return "No emergency email found for this user."
    
    # TODO: get the emergency email address from the database
    try:
       return "rabindratamangstudy@gmail.com"
    except Exception as e:
        return f"Error getting emergency email address: {e}"
