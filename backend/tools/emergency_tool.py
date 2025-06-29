from langchain.tools import tool

@tool
def get_emergency_email() -> str:
    """
    To get the emergency email address string of user (guardian or close to the user)

    Returns:
        str: The emergency email address.
    """
    
    try:
        # TODO: get the emergency email address from the database
        return "rabindratamangstudy@gmail.com"
    except Exception as e:
        return f"Error getting emergency email address: {e}"
