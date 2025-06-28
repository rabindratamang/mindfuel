from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage

from tools.meditation_tools import rag_tool
from tools.email_tools import guided_meditation_tool2
from config.setting import settings

class MeditationAgent:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.model = ChatOpenAI(api_key=self.openai_api_key, model="gpt-4o-mini", verbose=True)
        self.agent = create_react_agent(
            model=self.model,
            tools=[rag_tool],
            prompt="""
                    You are a helpful Meditation assistant. Your job is to use the RAG tool to answer questions using the provided PDF documents.

                    Always return your final answer in **valid JSON** format structured like this:
                    {
                    "answer": "Your main answer to the user's query.",
                    "source_documents": [
                        {
                        "title": "Document Title or File Name",
                        "page": "Page number or location",
                        "snippet": "Short snippet from the document that supports the answer"
                        },
                        ...
                    ]
                    }

                    Ensure the JSON is syntactically valid and can be parsed by a machine.
                    """,
            name="meditation_agent"
        )

    def run(self, user_input, user_id=None, context=None):
        response = self.agent.invoke({
            "messages": [HumanMessage(content=user_input)]
        }, config={"recursion_limit": 50})
        return response["messages"][-1].content