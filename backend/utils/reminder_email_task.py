import asyncio
from datetime import datetime, timedelta
from models.reminder import ReminderRepository
from models.user import UserRepository
from tools.email_tools import send_email_via_sendgrid_regular
import pytz

CHECK_INTERVAL = 10 

def parse_datetime(dt_str):
    try:
        return datetime.fromisoformat(dt_str)
    except Exception:
        return None

def get_next_time(current: datetime, repeat_type: str, interval: int) -> datetime:
    if repeat_type == "minute":
        return current + timedelta(minutes=interval)
    elif repeat_type == "hour":
        return current + timedelta(hours=interval)
    elif repeat_type == "day":
        return current + timedelta(days=interval)
    else:
        return None

async def reminder_email_task():
    reminder_repo = ReminderRepository()
    user_repo = UserRepository()
    while True:
        now = datetime.utcnow().replace(tzinfo=pytz.UTC)
        collection = await reminder_repo.collection
        reminders_cursor = collection.find({
            "isActive": True
        })
        reminders = await reminders_cursor.to_list(length=1000)
        for reminder_doc in reminders:
            reminder = reminder_doc     
            reminder_time = parse_datetime(reminder.get("datetime"))
            if not reminder_time:
                continue
            last_updated = reminder.get("updatedAt")
            if last_updated:
                last_updated = parse_datetime(last_updated)
            else:
                last_updated = reminder.get("createdAt")
                last_updated = parse_datetime(last_updated)

            repeat_type = reminder.get("repeatType", "none")
            repeat_interval = int(reminder.get("repeatInterval", 1))
            if repeat_type == "none":
                if reminder_time <= now:
                    await send_reminder_email(reminder, user_repo)
                    await reminder_repo.update(str(reminder["_id"]), {"isActive": False, "updatedAt": now.isoformat()})
            else:
                next_time = get_next_time(last_updated, repeat_type, repeat_interval)
                if next_time and next_time <= now:
                    await send_reminder_email(reminder, user_repo)
                    await reminder_repo.update(str(reminder["_id"]), {"updatedAt": now.isoformat()})
        await asyncio.sleep(CHECK_INTERVAL)

async def send_reminder_email(reminder, user_repo):
    user_id = str(reminder.get("userId"))
    user = await user_repo.get_by_id(user_id)
    if not user or not user.email:
        return
    subject = f"Reminder: {reminder.get('title', 'No Title')}"
    message = reminder.get("description", "You have a reminder!")
    sender_email = "mindfuelnepal@gmail.com"
    recipient_email = user.email
    send_email_via_sendgrid_regular(
        sender_email=sender_email,
        recipient_email=recipient_email,
        subject=subject,
        message=message
    ) 