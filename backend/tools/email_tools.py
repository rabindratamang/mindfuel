from langchain.tools import tool
from typing import List
import requests
from config.setting import settings
import sendgrid
import os
from sendgrid.helpers.mail import Mail, Email, To, Content

@tool
def send_email_via_sendgrid(
    sender_email: str,
    recipient_email: str,
    subject: str,
    message: str,
    content_type: str = "text/plain"
) -> dict:
    """
    Sends an email.

    Args:
        sender_email (str): The sender's verified email address.
        recipient_email (str): The recipient's email address.
        subject (str): The subject of the email.
        message (str): The message content of the email.
        content_type (str): The content type of the message (default is "text/plain").

    Returns:
        dict: A dictionary with status_code and response_headers.
    """
    #os.environ.get("SENDGRID_API_KEY")
    sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)

    from_email = Email(sender_email)
    to_email = To(recipient_email)
    content = Content(content_type, message)
    mail = Mail(from_email, to_email, subject, content)

    # Send the email
    try:
        response = sg.client.mail.send.post(request_body=mail.get())
        return {
            "status_code": response.status_code,
            "headers": dict(response.headers),
        }
    except Exception as e:
        return {
            "error": str(e)
        }
