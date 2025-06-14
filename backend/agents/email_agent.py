from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.email_tools import send_email_via_sendgrid
from config.setting import OPENAI_API_KEY

class EmailAgent:
    def __init__(self):
        self.openai_api_key = OPENAI_API_KEY
        self.model = ChatOpenAI(api_key=self.openai_api_key, model="gpt-4o-mini", verbose=True)
        self.agent = create_react_agent(
            model=self.model,
            tools=[send_email_via_sendgrid],
            prompt = (
              "You are a helpful Email assistant. Your job is to help users send emails."
              "based on their requests. Use the tool to send emails to respective people."

            ),
            name="email_assistant"
        )

    def run(self, user_input):
        response = self.agent.invoke({
            "messages": [HumanMessage(content=user_input)]
        }, config={"recursion_limit": 50})
        return response["messages"][-1].content