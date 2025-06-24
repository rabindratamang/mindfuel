from dotenv import load_dotenv
load_dotenv()

from backend.agents.youtube_agent_tc import YoutubeAgent
def main():
    agent = YoutubeAgent()
    query = "5 minute yoga video"
    result = agent.run(query)
    print(result)

if __name__ == "__main__":
    main() 