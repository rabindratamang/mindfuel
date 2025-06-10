from .mood_analyzer import MoodAnalyzerAgent
from .sleep_coach import SleepCoachAgent
from .youtube_agent import YoutubeAgent
AGENTS = {
    "mood_analyzer": MoodAnalyzerAgent(),
    "sleep_coach": SleepCoachAgent(),
    "youtube_agent": YoutubeAgent(),
}

def get_agent(name: str):
    return AGENTS.get(name) 