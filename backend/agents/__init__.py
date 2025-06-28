from .mood_analyzer import MoodAnalyzerAgent
from .sleep_coach import SleepCoachAgent
from .youtube_agent_tc import YoutubeAgent
from .spotify_agent import SpotifyAgent
from .content_generator_agent import ContentGeneratorAgent
from .mood_analyzer_master import MoodAnalyzerMasterAgent
from .chat_agent import ChatAgent
from .meditation_agent import MeditationAgent
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
        elif name == "content_generator_agent":
            _agents[name] = ContentGeneratorAgent()
        elif name == "mood_analyzer_master":
            _agents[name] = MoodAnalyzerMasterAgent()
        elif name == "chat_agent":
            _agents[name] = ChatAgent()
        elif name == "meditation":
            _agents[name] = MeditationAgent()
        else:
            raise ValueError(f"Unknown agent: {name}")
    return _agents[name]

AGENT_NAMES = ["mood_analyzer", "sleep_coach", "youtube_agent", "spotify_agent", "mood_analyzer_master", "chat_agent", "meditation"] 