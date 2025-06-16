from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.localization_tools import localize_to_nepali
from config.setting import OPENAI_API_KEY

class LocalizationAgent:
    def __init__(self):
        self.openai_api_key = OPENAI_API_KEY
        self.model = ChatOpenAI(api_key=self.openai_api_key, model="gpt-4o-mini", verbose=True)
        self.agent = create_react_agent(
            model=self.model,
            tools=[localize_to_nepali],
            prompt = (
            "You are a helpful Localization Assistant. "
            "Your job is to translate and adapt English content into the Nepali language, "
            "preserving the original meaning, tone, and cultural context. "
            "Always use the `localize_to_nepali` tool to translate any user input into Nepali. "
            "Do not respond on your own unless explicitly instructed."
            ),
            name="localization_assistant"
        )

    def run(self, user_input):
        response = self.agent.invoke({
            "messages": [HumanMessage(content=user_input)]
        }, config={"recursion_limit": 50})
        return response["messages"][-1].content