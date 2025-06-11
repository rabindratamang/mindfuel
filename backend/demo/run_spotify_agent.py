from dotenv import load_dotenv
load_dotenv()

from agents.spotify_agent import SpotifyAgent
def main():
    agent = SpotifyAgent()
    query = "I can't sleep well."
    result = agent.run(query)
    print(result)

if __name__ == "__main__":
    main()