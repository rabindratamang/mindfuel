from .mood_analyzer import MoodAnalyzerAgent
from .sleep_coach import SleepCoachAgent

AGENTS = {
    "mood_analyzer": MoodAnalyzerAgent(),
    "sleep_coach": SleepCoachAgent(),
}

def get_agent(name: str):
    return AGENTS.get(name) 