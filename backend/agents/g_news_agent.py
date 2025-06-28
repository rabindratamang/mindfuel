from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.g_news_tools import search_g_news_by_keyword
from config.setting import settings

class GoogleNewsAgent:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.model = ChatOpenAI(api_key=self.openai_api_key, model="gpt-4o-mini", verbose=True)
        self.agent = create_react_agent(
            model=self.model,
            tools=[search_g_news_by_keyword],
            prompt=(
                "You are a helpful G News assistant. Your task is to help users find recent news articles based on their search queries.\n\n"
                "Use the `search_g_news_by_keyword` tool by passing the keyword provided by the user.\n\n"
                "Always return the results strictly in this JSON format:\n"
                "{\n"
                '  "query": string,\n'
                '  "total": integer,\n'
                '  "articles": [\n'
                '    {\n'
                '      "title": string,\n'
                '      "snippet": string,\n'
                '      "news_url": string,\n'
                '      "thumbnail": string,\n'
                '      "source": {{"name": string, "url": string}},\n'
                '      "published_time": string\n'
                '    },\n'
                "    ... (up to 3 items)\n"
                "  ]\n"
                "}\n\n"
                "Do not include markdown, extra explanations, or formatting — only return clean JSON."
            ),
            name="g_news_assistant"
        )

    def run(self, user_input):
        response = self.agent.invoke({
            "messages": [HumanMessage(content=user_input)]
        }, config={"recursion_limit": 50})
        return response["messages"][-1].content
    
    def get_news_article(self, news_recommendation: dict, num_articles: int = 1):
        """
        Find news articles based on recommendation criteria.
        
        Args:
            news_recommendation (dict): Dictionary containing search criteria
            num_articles (int): Number of articles to return
            
        Returns:
            dict: JSON array of news article results or error message
        """
        try:
            keywords = news_recommendation.get("keywords", [])
            mood = news_recommendation.get("mood", "")
            duration = news_recommendation.get("duration", "")

            prompt = (
                f"Find {num_articles} news articles that includes the following:\n"
                f"- Keywords: {', '.join(keywords)}\n"
                f"- Mood: {mood}\n"
                f"- Duration: {duration} (e.g., 0-10min=short, 10-30min=medium, 30min+=long)\n\n"
                "Only return array of JSON with: title, snippet, news_url, thumbnail, publisher, timestamp, and published_time. even if there is only one article"
                "Do not include any commentary or explanation outside the JSON array. Only return valid JSON array. Example do not wrap it in ```json or any markdown formatting"
            )

            return self.run(prompt)
            
        except Exception as e:
            return {"error": f"Exception occurred: {str(e)}"}
