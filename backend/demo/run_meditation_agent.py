# import sys
# import os
# # Add backend directory to Python path
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
# print(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from dotenv import load_dotenv
load_dotenv()
from agents.meditation_agent import MeditationAgent
 

def main():
    agent = MeditationAgent()
    query = "How to do breathing exercises?"
    result = agent.run(query)
    print(result)

if __name__ == "__main__":
    main()