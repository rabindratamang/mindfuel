from dotenv import load_dotenv
load_dotenv()

from agents.localization_agent import LocalizationAgent
def main():
    agent = LocalizationAgent()
    query = "Hello. How are you doing?"
    result = agent.run(query)
    print(result)

if __name__ == "__main__":
    main()