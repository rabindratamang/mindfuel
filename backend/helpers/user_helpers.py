from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from models.user import User

def get_user_context_string(user: "User") -> str:
    """
    Generates a concise and structured user context string for LLM prompts.
    This string is designed to be easily parsable and provide key information
    about the user's profile, preferences, and goals.
    """
    context = ["--- User Context ---"]

    context.append(f"Name: {user.firstName} {user.lastName}")
    if user.profile.gender:
        context.append(f"Gender: {user.profile.gender}")
    if user.profile.country:
        context.append(f"Country: {user.profile.country}")

    if user.profile.mentalHealthGoals:
        context.append(f"Primary Goals: {', '.join(user.profile.mentalHealthGoals)}")
    if user.profile.currentChallenges:
        context.append(f"Current Challenges: {', '.join(user.profile.currentChallenges)}")
    if user.profile.wellnessInterests:
        context.append(f"Interests: {', '.join(user.profile.wellnessInterests)}")
    if user.profile.experienceLevel:
        context.append(f"Experience Level: {user.profile.experienceLevel}")
    if user.profile.preferredActivities:
        context.append(f"Preferred Activities: {', '.join(user.profile.preferredActivities)}")
    if user.preferences.communicationStyle:
        context.append(f"Preferred Communication Style: {user.preferences.communicationStyle}")

    if user.goals:
        context.append("\n[Active Goals]")
        for goal in user.goals:
            context.append(f"- {goal.title}: {goal.current} / {goal.target} {goal.unit}")

    return "\n".join(context)
