from .mood_analyzer import MoodAnalyzerAgent
from .sleep_coach import SleepCoachAgent
from .youtube_agent import YoutubeAgent
from .meditation_agent import MeditationAgent
AGENTS = {
    "mood_analyzer": MoodAnalyzerAgent(),
    "sleep_coach": SleepCoachAgent(),
    "youtube_agent": YoutubeAgent(),
    "meditation_agent": MeditationAgent(),   
}

def get_agent(name: str):
    return AGENTS.get(name) 