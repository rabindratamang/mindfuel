from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.youtube_tools import search_youtube_video
from config.setting import OPENAI_API_KEY

class YoutubeAgent:
    def __init__(self):
        self.openai_api_key = OPENAI_API_KEY
        self.model = ChatOpenAI(api_key=self.openai_api_key, model="gpt-4o-mini", verbose=True)
        self.agent = create_react_agent(
            model=self.model,
            tools=[search_youtube_video],
            prompt=(
                "You are a helpful YouTube video assistant. Your job is to help users find YouTube videos "
                "based on their search queries. Use the tool to perform a search and return the top result. "
                "Once the top result is found, return it as 'Final Answer: <result>' and stop."
            ),
            name="youtube_assistant"
        )

    def run(self, user_input):
        response = self.agent.invoke({
            "messages": [HumanMessage(content=user_input)]
        }, config={"recursion_limit": 50})
        return response["messages"][-1].content 