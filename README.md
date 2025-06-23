# MindFuel: Multi-Agent Mental Fitness System

AI Agents Working Together for Stress, Sleep & Mindfulness

## Vision
MindFuel is a multi-agent AI system designed to support mental fitness through personalized, culturally relevant, and proactive digital interventions. Each agent specializes in a core aspect of mental health, collaborating to deliver a holistic user experience.

## Core Agents & Responsibilities
| Agent               | Responsibilities                                                      | Tools/APIs Used                                  |
|---------------------|-----------------------------------------------------------------------|--------------------------------------------------|
| Mood Analyzer       | Detects stress/anxiety from text/voice, suggests coping strategies    | OpenAI GPT-40-mini, Youtube Agent, Spotify Agent                       |
| Sleep Coach         | Personalized wind-down routines, sleep tracking                       | ChromaDB (RAG), Spotify API, PubMed              |
| Meditation          | Guided meditations, journaling prompts                                | ElevenLabs (TTS), Notion API, GPT-4              |
| Reminder            | Schedules check-ins, hydration, bedtime alerts                        | Google Calendar API, Twilio, Telegram            |
| Localization        | Translates/adapts content to local languages/cultures                 | Hugging Face (NLLB), DeepL API                   |
| Content             | Fetches YouTube, podcasts, articles                                   | YouTube Data API, Pocket/Readwise                |
| Gamification        | Tracks streaks, rewards, challenges                                   | Firebase, DALL-E, GPT-4                          |
| Journaling          | Summarizes entries, detects mood trends                               | GPT-4, Notion API                                |
| Community           | Fetches crowdsourced advice from Reddit/Quora                         | Reddit API, GPT-4                                |
| Emergency           | Detects high-risk messages, triggers alerts                           | Crisis Text Line API, GPT-4, emergency contacts  |

## Key Features & Improvements
- **Personalized Content**: Agents fetch and filter resources (e.g., YouTube, articles) based on user context and preferences.
- **Localization**: Beyond translation—adapts metaphors and advice to local cultures.
- **Proactive Nudges**: Reminder Agent uses SMS, Telegram, and calendar integrations for timely interventions.
- **Gamification**: Tracks streaks, awards badges, and generates AI-powered rewards to reinforce positive behavior.
- **Retrieval-Augmented Generation (RAG)**: Uses ChromaDB and PubMed for evidence-based recommendations.
- **Agent Collaboration**: Agents communicate and trigger each other for seamless user journeys.

## Example Workflow
**User:** "I'm overwhelmed with work and can't sleep."
1. **Mood Analyzer Agent** detects stress and sleep issues → alerts Sleep Coach Agent.
2. **Sleep Coach Agent** generates a custom wind-down routine (Spotify playlist + RAG tips).
3. **Reminder Agent** schedules a "5 PM break reminder" via SMS.
4. **YouTube Agent** suggests a "10-minute office yoga video."
5. **Gamification Agent** awards a "Stress Buster Badge."

## Architecture
- **Frontend**: Next.js, React, Tailwind, Radix UI, shadcn/ui ([Frontend README](frontend/README.md))
- **Backend**: FastAPI, LangChain, ChromaDB, OpenAI, JWT Auth ([Backend README](backend/README.md))

## Contributing
See our [CONTRIBUTOR.md](CONTRIBUTOR.md) for guidelines on how to contribute to this project.