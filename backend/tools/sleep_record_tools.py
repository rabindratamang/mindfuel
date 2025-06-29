from langchain_core.tools import tool
from models.sleep_record import SleepRecordRepository
import asyncio

@tool()
def record_sleep_to_db(user_id: str, date: str, bedtime: str, wakeTime: str, duration: str, quality: str, factors: list, mood: str, notes: str = "")  -> dict:
    """
    Record a sleep entry to MongoDB. Expects a dict with keys:
    date, bedtime, wakeTime, duration, quality, factors, mood, notes.


    quality options = [
        { value: 1, label: "Poor", emoji: "😴" },
        { value: 2, label: "Fair", emoji: "😐" },
        { value: 3, label: "Good", emoji: "🙂" },
        { value: 4, label: "Great", emoji: "😊" },
        { value: 5, label: "Excellent", emoji: "🌟" },
    ]

    factors options = [
        { value: "caffeine", label: "Caffeine"  },
        { value: "screen", label: "Screen Time" },
        { value: "exercise", label: "Exercise" },
        { value: "stress", label: "Stress" },
        { value: "reading", label: "Reading" },
        { value: "music", label: "Relaxing Music" },
    ]

    mood options = [
        { value: "energized", label: "Energized", emoji: "⚡" },
        { value: "refreshed", label: "Refreshed", emoji: "✨" },
        { value: "tired", label: "Still Tired", emoji: "😴" },
        { value: "groggy", label: "Groggy", emoji: "🥱" },
    ]

    example of data to be inserted:
    "date":"2025-06-28"
    "bedtime":"22:40"
    "wakeTime":"07:40"
    "duration":"9h 0m"
    "quality": 2
    "factors": ["reading","screen","music"]
    "mood":"refreshed"
    "notes":""

    Returns string message of success or error.
    """


    async def _insert():
        repo = SleepRecordRepository()
        sleep_data = {
            "date": date,
            "bedtime": bedtime,
            "wakeTime": wakeTime,
            "duration": duration,
            "quality": quality,
            "factors": factors,
            "mood": mood,
            "notes": notes,
            "userId": user_id
        }
        await repo.create(sleep_data)

    try:
        asyncio.run(_insert())
    except Exception as e:
        if "Task pending" in str(e):
            return "Sleep record created successfully."
        else:
            return "Error creating sleep record"
