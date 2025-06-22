from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from core.chroma import get_collection
from config.setting import settings
import re, json
from datetime import datetime
from typing import Dict, Any, Optional
import asyncio

from models.mood_analysis import MoodAnalysis, MoodAnalysisRepository, Analysis, Insights, Recommendations, FollowUp, RiskAssessment, Metadata, Emotion, Sentiment, ContentRecommendations, YouTubeRecommendation, ArticlesRecommendation, SpotifyRecommendation, MeditationRecommendation
from database.mongo_client import get_database, init_database

class MoodAnalyzerAgent:
    def __init__(self):
        self.llm = OpenAI(openai_api_key=settings.OPENAI_API_KEY, model="gpt-4o-mini", max_tokens=10000)
        self.prompt = PromptTemplate(
            template="""
            [SYSTEM MESSAGE]
            You are a JSON-only response AI. Always respond with valid JSON and nothing else. Never include explanatory text, markdown, or code blocks.

            You are MindFuel's AI mood analysis expert. Analyze the user's input text and provide a comprehensive mood assessment in JSON format.
            `CONTEXT:
            {context}
            ANALYSIS REQUIREMENTS:
            1. Detect primary mood and emotional state
            2. Assess confidence level and intensity
            3. Identify key themes, triggers, and emotions
            4. Provide actionable suggestions
            5. Determine content recommendation preferences
            6. Assess any risk factors or concerns

            USER INPUT: "{input}"

            IMPORTANT: Respond ONLY with valid JSON. Do not include any explanatory text, markdown formatting, or code blocks. Start your response directly with the opening curly brace {{ and end with the closing curly brace }}.

            RESPONSE FORMAT (JSON):
            {{
            "analysis": {{
                "primaryMood": "string", // Main detected mood (Happy, Sad, Anxious, Frustrated, Calm, Excited, Depressed, Angry, Neutral, etc.)
                "moodCategory": "string", // positive, negative, neutral
                "confidence": number, // 0-100 confidence score
                "intensity": number, // 1-10 intensity level
                "emotions": [
                {{
                    "emotion": "string",
                    "score": number // 0-100
                }}
                ],
                "sentiment": {{
                "polarity": number, // -1 (very negative) to 1 (very positive)
                "subjectivity": number // 0 (objective) to 1 (subjective)
                }}
            }},
            "insights": {{
                "summary": "string", // 2-3 sentence summary of their emotional state
                "keyThemes": ["string"], // Main themes identified (work, relationships, health, etc.)
                "triggers": ["string"], // Potential triggers or stressors mentioned
                "strengths": ["string"], // Positive aspects or coping mechanisms noted
                "concerns": ["string"] // Areas that might need attention
            }},
            "recommendations": {{
                "immediate": ["string"], // 6 immediate actionable suggestions
                "content": {{
                "youtube": {{
                    "types": ["string"], // meditation, breathing exercises, motivational, educational, etc.
                    "keywords": ["string"], // at least 5 search keywords for relevant videos
                    "duration": "string", // short (0-10min), medium (10-30min), long (30min+)
                    "mood": "string" // target mood for content
                }},
                "articles": {{
                    "topics": ["string"], // psychology, self-help, mindfulness, etc relevant to the analysis.
                    "difficulty": "string", // beginner, intermediate, advanced
                    "focus": ["string"] // coping strategies, understanding emotions, etc relevant to the analysis.
                }},
                "spotify": {{
                    "keywords": ["string"], // at least 5 search keywords for relevant playlists
                    "genres": ["string"], // ambient, classical, nature sounds, podcast etc relevant to the analysis.
                    "energy": number, // 0-1 (0=calm, 1=energetic)
                    "valence": number, // 0-1 (0=sad, 1=happy)
                    "mood": "string" // relaxing, uplifting, focus, etc relevant to the analysis.
                }},
                "meditation": {{
                    "types": ["string"], // breathing, body scan, loving-kindness, etc.
                    "duration": number, // recommended minutes
                    "difficulty": "string" // beginner, intermediate, advanced
                }}
                }}
            }},
            "followUp": {{
                "questions": ["string"], // 2-3 follow-up questions to better understand their state
                "checkIn": "string", // suggested timeframe for next check-in (hours, days)
                "goals": ["string"] // suggested short-term goals based on their input
            }},
            "riskAssessment": {{
                "level": "string", // low, medium, high
                "indicators": ["string"], // specific risk indicators if any
                "recommendations": ["string"], // professional help suggestions if needed
                "urgency": "string" // none, monitor, immediate
            }},
            "metadata": {{
                "wordCount": number,
                "complexity": "string", // simple, moderate, complex
                "timeOfDay": "string", // morning, afternoon, evening, night (if mentioned)
                "context": ["string"] // work, home, social, health, etc.
            }}
            }}

            GUIDELINES:
            - Be empathetic and non-judgmental
            - Focus on actionable insights
            - Consider cultural sensitivity
            - If serious mental health concerns are detected, prioritize professional help recommendations
            - Tailor content suggestions to the specific mood and needs identified
            - Use clear, supportive language
            - Avoid medical diagnosis or treatment advice
            - Encourage professional help when appropriate

           [SYSTEM RULES]
            1. Respond **ONLY** with valid JSON that starts with `{{` and ends with `}}`.
            2. **Never** include:
            - Text before `{{` or after `}}`
            - Markdown/code blocks (```json```)
            - Explanatory comments
            3. If you violate this, the API will reject your response.

            [EXAMPLE OF CORRECT RESPONSE]
            {{
                "analysis": {{
                    "primaryMood": "Anxious",
                    "moodCategory": "negative"
                }}
            }}

            [EXAMPLE OF INCORRECT RESPONSE]
            USER INPUT: "{input}"\n           
            {{
                "analysis": {{
                    "primaryMood": "Anxious"
                }}
            }}
            
            Return only the JSON object with no additional text or formatting.
            """,
            input_variables=["context", "input"]
        )
        self.chain = self.prompt | self.llm
        self.collection = get_collection("mood_analyzer")

    def _parse_ai_response(self, result: str) -> Dict[str, Any]:
        try:
            try:
                parsed_result = json.loads(result.strip())
            except json.JSONDecodeError:
                json_str = re.search(r"\{[\s\S]*\}", result).group(0)
                parsed_result = json.loads(json_str)
            return parsed_result
        except Exception as e:
            print(f"JSON parsing error: {e}")
            raise

    def _create_mood_analysis_model(self, parsed_result: Dict[str, Any], user_id: str, user_input: str, context: dict) -> MoodAnalysis:
        try:
            analysis_data = parsed_result.get("analysis", {})
            insights_data = parsed_result.get("insights", {})
            recommendations_data = parsed_result.get("recommendations", {})
            followup_data = parsed_result.get("followUp", {})
            risk_data = parsed_result.get("riskAssessment", {})
            metadata_data = parsed_result.get("metadata", {})

            analysis = Analysis(
                primaryMood=analysis_data.get("primaryMood", "Neutral"),
                moodCategory=analysis_data.get("moodCategory", "neutral"),
                confidence=analysis_data.get("confidence", 50),
                intensity=analysis_data.get("intensity", 5),
                emotions=[Emotion(emotion=e["emotion"], score=e["score"]) for e in analysis_data.get("emotions", [])],
                sentiment=Sentiment(
                    polarity=analysis_data.get("sentiment", {}).get("polarity", 0),
                    subjectivity=analysis_data.get("sentiment", {}).get("subjectivity", 0.5)
                )
            )

            insights = Insights(
                summary=insights_data.get("summary", ""),
                keyThemes=insights_data.get("keyThemes", []),
                triggers=insights_data.get("triggers", []),
                strengths=insights_data.get("strengths", []),
                concerns=insights_data.get("concerns", [])
            )

            content_data = recommendations_data.get("content", {})
            content_recommendations = ContentRecommendations(
                youtube=YouTubeRecommendation(
                    types=content_data.get("youtube", {}).get("types", []),
                    keywords=content_data.get("youtube", {}).get("keywords", []),
                    duration=content_data.get("youtube", {}).get("duration", "medium"),
                    mood=content_data.get("youtube", {}).get("mood", "calm"),
                    videos=content_data.get("youtube", {}).get("videos", None)
                ),
                articles=ArticlesRecommendation(
                    topics=content_data.get("articles", {}).get("topics", []),
                    difficulty=content_data.get("articles", {}).get("difficulty", "beginner"),
                    focus=content_data.get("articles", {}).get("focus", [])
                ),
                spotify=SpotifyRecommendation(
                    genres=content_data.get("spotify", {}).get("genres", []),
                    energy=content_data.get("spotify", {}).get("energy", 0.5),
                    valence=content_data.get("spotify", {}).get("valence", 0.5),
                    mood=content_data.get("spotify", {}).get("mood", "relaxing"),
                    playlist=content_data.get("spotify", {}).get("playlist", None)
                ),
                meditation=MeditationRecommendation(
                    types=content_data.get("meditation", {}).get("types", []),
                    duration=content_data.get("meditation", {}).get("duration", 10),
                    difficulty=content_data.get("meditation", {}).get("difficulty", "beginner")
                )
            )

            recommendations = Recommendations(
                immediate=recommendations_data.get("immediate", []),
                content=content_recommendations
            )

            followup = FollowUp(
                questions=followup_data.get("questions", []),
                checkIn=followup_data.get("checkIn", "in 24 hours"),
                goals=followup_data.get("goals", [])
            )

            risk_assessment = RiskAssessment(
                level=risk_data.get("level", "low"),
                indicators=risk_data.get("indicators", []),
                recommendations=risk_data.get("recommendations", []),
                urgency=risk_data.get("urgency", "none")
            )

            metadata = Metadata(
                wordCount=metadata_data.get("wordCount", 0),
                complexity=metadata_data.get("complexity", "simple"),
                timeOfDay=metadata_data.get("timeOfDay", "unknown"),
                context=metadata_data.get("context", [])
            )

            return MoodAnalysis(
                userId=user_id,
                input=user_input,
                context={},
                analysis=analysis,
                insights=insights,
                recommendations=recommendations,
                followUp=followup,
                riskAssessment=risk_assessment,
                metadata=metadata
            )

        except Exception as e:
            print(f"Error creating MoodAnalysis model: {e}")
            raise

    async def run(self, user_input: str, user_id: str = None, context: str = None, save_to_db: bool = True) -> Dict[str, Any]:
        try:
            context_str = """
                - MindFuel is a mental wellness app that helps users track mood, get personalized content recommendations, and improve mental health
                - Users share their thoughts, feelings, and current state
                - Your analysis will be used to provide personalized YouTube videos, articles, Spotify playlists, and meditation recommendations
                - Be empathetic, supportive, and professional in your analysis
            """
            
            prompt_vars = {
                "context": context_str,
                "input": user_input,
            }

            result = await asyncio.to_thread(self.chain.invoke, prompt_vars)
            parsed_result = self._parse_ai_response(result)

            try:
                from agents import get_agent
                
                youtube_rec = parsed_result.get("recommendations", {}).get("content", {}).get("youtube")
                spotify_rec = parsed_result.get("recommendations", {}).get("content", {}).get("spotify")
                
                tasks = []
                if youtube_rec:
                    youtube_agent = get_agent("youtube_agent")
                    tasks.append(asyncio.to_thread(youtube_agent.get_youtube_video, youtube_rec, 6))
                
                if spotify_rec:
                    spotify_agent = get_agent("spotify_agent")
                    tasks.append(asyncio.to_thread(spotify_agent.get_spotify_recommendation, spotify_rec))

                if tasks:
                    recommendation_results = await asyncio.gather(*tasks)
                    
                    if youtube_rec:
                        parsed_result["recommendations"]["content"]["youtube"]["videos"] = recommendation_results.pop(0)
                    if spotify_rec:
                        parsed_result["recommendations"]["content"]["spotify"]["playlist"] = recommendation_results.pop(0)

            except Exception as e:
                print(f"Error getting content recommendations: {e}")

            db_info = {}
            full_analysis_model = self._create_mood_analysis_model(parsed_result, user_id, user_input, context)

            if save_to_db and user_id:
                try:
                    await init_database()
                    
                    full_repo = MoodAnalysisRepository()
                    full_analysis_id = await full_repo.create(full_analysis_model)
                    
                    db_info = {
                        "full_analysis_id": full_analysis_id,
                        "saved": True
                    }
                except Exception as e:
                    print(f"Error saving to database: {e}")
                    db_info = {"saved": False, "error": str(e)}
        
            return {
                "analysis": parsed_result,
                "frontend_format": full_analysis_model.from_mongo(full_analysis_model.to_mongo()),
                "database": db_info
            }

        except Exception as e:
            print(f"Run error: {e}")
            return {"error": str(e)}

    async def get_user_analyses(self, user_id: str, limit: int = 10, simple: bool = True) -> Dict[str, Any]:
        try:
            await init_database()
            
            repo = MoodAnalysisRepository()
            analyses = await repo.get_by_user_id(user_id, limit)
            
            if simple:
                return {
                    "analyses": [analysis.to_simple_format() for analysis in analyses],
                    "type": "simple"
                }
            else:
                return {
                    "analyses": [analysis.dict() for analysis in analyses],
                    "type": "full"
                }
        except Exception as e:
            print(f"Error getting user analyses: {e}")
            return {"error": str(e)}

    async def get_mood_trends(self, user_id: str, days: int = 30) -> Dict[str, Any]:
        try:
            await init_database()
            db = await get_database()
            repo = MoodAnalysisRepository(db)
            trends = await repo.get_user_mood_trends(user_id, days)
            return {"trends": trends}
        except Exception as e:
            print(f"Error getting mood trends: {e}")
            return {"error": str(e)}

    def run2(self, user_input, user_id=None, context=None):
        try:
            context_str = """
                - MindFuel is a mental wellness app that helps users track mood, get personalized content recommendations, and improve mental health
                - Users share their thoughts, feelings, and current state
                - Your analysis will be used to provide personalized YouTube videos, articles, Spotify playlists, and meditation recommendations
                - Be empathetic, supportive, and professional in your analysis
            """
            prompt_vars = {
                "context": context_str,
                "input": user_input,
            }
            return self.chain.invoke(prompt_vars) 
        except Exception as e:
            print(e)
            return {"error": str(e)}