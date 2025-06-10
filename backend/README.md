# MindFuel Backend

This backend provides a scalable, multi-agent API system for the MindFuel platform. It leverages OpenAI, LangChain, and ChromaDB for Retrieval-Augmented Generation (RAG) and agent orchestration.

## Folder Structure

```
backend/
│
├── agents/                # All agent logic (one file per agent)
│   ├── __init__.py
│   ├── mood_analyzer.py
│   ├── sleep_coach.py
│   └── ... (other agents)
│
├── api/                   # API route definitions (FastAPI routers)
│   ├── __init__.py
│   ├── agent.py           # /agent/{agent_name} endpoint
│   └── auth.py            # /auth endpoints (login, register, etc.)
│
├── core/                  # Core utilities, config, and security
│   ├── __init__.py
│   ├── config.py          # Settings, env loading
│   ├── security.py        # JWT utilities, password hashing
│   └── chroma.py          # ChromaDB connection and helpers
│
├── models/                # Pydantic models (request/response/user)
│   ├── __init__.py
│   ├── agent.py
│   └── user.py
│
├── main.py                # FastAPI app entrypoint
├── requirements.txt
├── README.md
└── .env.example
```

## Features
- Modular agent architecture (Mood Analyzer, Sleep Coach, etc.)
- OpenAI-powered LLMs for reasoning and generation
- LangChain for agent workflow, chaining, and RAG
- ChromaDB for fast, scalable vector search and retrieval
- JWT-based user authentication and token validation
- RESTful API endpoints for each agent
- Easy extensibility for new agents and tools

## Agents
- **Mood Analyzer**: Detects stress/anxiety, suggests coping strategies
- **Sleep Coach**: Personalized wind-down routines, sleep tracking
- **Meditation**: Guided meditations, journaling prompts
- **Reminder**: Schedules check-ins, hydration, bedtime alerts
- **Localization**: Translates/adapts content
- **Content**: Fetches YouTube, podcasts, articles
- **Gamification**: Tracks streaks, rewards, challenges
- **Journaling**: Summarizes entries, detects mood trends
- **Community**: Fetches crowdsourced advice
- **Emergency**: Detects high-risk messages, triggers alerts

## Tech Stack
- **Python 3.10+**
- **FastAPI** (web framework)
- **LangChain** (agent orchestration, RAG)
- **ChromaDB** (vector database)
- **OpenAI** (LLM API)

## Quickstart
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Set your OpenAI API key and JWT secret in `.env`:
   ```env
   OPENAI_API_KEY=sk-...
   JWT_SECRET=your_jwt_secret
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints
- `/auth/register`: Register a new user
- `/auth/login`: Obtain JWT token
- `/agent/{agent_name}`: POST user input, get agent response (JWT required)
- `/health`: Health check

## Extending
- Add new agents in `agents/`
- Register new endpoints in `api/`
- Use ChromaDB for RAG in any agent as needed

---
See `MindFuelIdea.md` for agent design inspiration. 