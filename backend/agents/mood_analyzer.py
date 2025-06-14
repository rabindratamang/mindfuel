import os
from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from core.chroma import get_collection
from config.setting import settings
class MoodAnalyzerAgent:
    def __init__(self):
        self.llm = OpenAI(openai_api_key=settings.OPENAI_API_KEY, model="gpt-4o-mini")
        self.prompt = PromptTemplate(
            template="You are a mood analyzer. Analyze the user's mood and suggest coping strategies. Context: {context}\nInput: {input}",
            input_variables=["context", "input"]
        )
        self.chain = self.prompt | self.llm
        self.collection = get_collection("mood_analyzer")

    def run(self, user_input, user_id=None, context=None):
        # results = self.collection.query(query_texts=[user_input], n_results=3)
        context_str = ""
        # context_str = "\n".join([doc for doc in results.get("documents", [[]])[0]])
        prompt_vars = {
            "context": context_str,
            "input": user_input
        }
        return self.chain.invoke(prompt_vars) 