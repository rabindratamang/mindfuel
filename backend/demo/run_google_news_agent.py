from dotenv import load_dotenv
load_dotenv()

from agents.google_news_agent import GoogleNewsAgent
def main():
    agent = GoogleNewsAgent()
    query = "mental health"
    result = agent.run(query)
    print(result)

if __name__ == "__main__":
    main()