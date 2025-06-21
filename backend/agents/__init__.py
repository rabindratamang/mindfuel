from .mood_analyzer import MoodAnalyzerAgent
from .sleep_coach import SleepCoachAgent
from .youtube_agent import YoutubeAgent
from .spotify_agent import SpotifyAgent

_agents = {}

def get_agent(name: str):
    if name not in _agents:
        if name == "mood_analyzer":
            _agents[name] = MoodAnalyzerAgent()
        elif name == "sleep_coach":
            _agents[name] = SleepCoachAgent()
        elif name == "youtube_agent":
            _agents[name] = YoutubeAgent()
        elif name == "spotify_agent":
            _agents[name] = SpotifyAgent()
        else:
            raise ValueError(f"Unknown agent: {name}")
    return _agents[name]

AGENT_NAMES = ["mood_analyzer", "sleep_coach", "youtube_agent", "spotify_agent"] 