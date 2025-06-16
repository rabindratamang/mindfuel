from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.spotify_tools import search_spotify_playlists
from config.setting import settings

class GoogleNewsAgent:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.model = ChatOpenAI(api_key=self.openai_api_key, model="gpt-4o-mini", verbose=True)
        self.agent = create_react_agent(
            model=self.model,
            tools=[search_news_by_keyword],
            prompt = (
              "You are a helpful Google search assistant. Your job is to help users find Google articles "
              "based on their search queries. Use the tool to perform a search and return the top result. "
              "Once the top result is found, return it as 'Final Answer: <result>' and stop."
            ),
            name="google_news_assistant"
        )

    def run(self, user_input):
        response = self.agent.invoke({
            "messages": [HumanMessage(content=user_input)]
        }, config={"recursion_limit": 50})
        return response["messages"][-1].content