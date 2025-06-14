from dotenv import load_dotenv
load_dotenv()

from agents.email_agent import EmailAgent
def main():
    agent = EmailAgent()
    query = "Send an email on physical fitness to shashwotpradhan@gmail.com and rabindratamangstudy@gmail.com subject should be 💪 Prioritize Your Health: The Power of Physical Fitness. Email is from mindfuelnepal@gmail.com"
    result = agent.run(query)
    print(result)

if __name__ == "__main__":
    main()