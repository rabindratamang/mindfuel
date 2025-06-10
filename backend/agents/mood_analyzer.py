import os
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from core.chroma import get_collection

class MoodAnalyzerAgent:
    def __init__(self):
        self.llm = OpenAI(openai_api_key=os.getenv("OPENAI_API_KEY"))
        self.chain = LLMChain(llm=self.llm, prompt="You are a mood analyzer. Analyze the user's mood and suggest coping strategies. Context: {context}\nInput: {input}")
        self.collection = get_collection("mood_analyzer")

    def run(self, user_input, user_id=None, context=None):
        results = self.collection.query(query_texts=[user_input], n_results=3)
        context_str = "\n".join([doc for doc in results.get("documents", [[]])[0]])
        prompt_vars = {
            "context": context_str,
            "input": user_input
        }
        return self.chain.run(prompt_vars) 