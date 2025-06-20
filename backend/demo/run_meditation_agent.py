from dotenv import load_dotenv
load_dotenv()

from agents.meditation_agent import MeditationAgent
def main():
    agent = MeditationAgent()
    query = "mindful meditation that is relaxing for 10 minutes."
    result = agent.run(query)
    print(result)

if __name__ == "__main__":
    main()