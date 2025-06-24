from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.spotify_tools import search_spotify_playlists
from config.setting import settings
import json
import re
import asyncio
from typing import Dict, Any
from database.mongo_client import get_database, init_database
from models.sleep_analysis import SleepAnalysis, SleepAnalysisRepository, SleepAssessment, RoutineRecommendation, SleepTips, SleepRecommendations, DisorderCheck, SleepFollowUp, SleepMetadata

class SleepCoachAgent:
    def __init__(self):
        self.model = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-4o-mini", max_tokens=10000)
        self.agent = create_react_agent(
            model=self.model,
            tools=[search_spotify_playlists],
            prompt=(
                """
                [SYSTEM MESSAGE]
                You are a JSON-only response AI. Always respond with valid JSON and nothing else. Never include explanatory text, markdown, or code blocks.

                You are MindFuel's AI sleep coach expert. Analyze the user's input text and provide a comprehensive sleep assessment in JSON format.

                For spotify recommendations, you will use the search_spotify_playlists tool strictly for the "playlist" field.

                ANALYSIS REQUIREMENTS:
                1. Identify the user's sleep issue, need, or question
                2. Extract important sleep data (time, feelings, habits, metrics)
                3. Provide a brief but insightful summary of the user's sleep pattern
                4. Detect mood and emotional cues if present
                5. Generate a personalized wind-down routine
                6. Recommend optimal sleep and wake-up timing
                7. Suggest behavior/environment improvements
                8. Perform a basic sleep disorder screening
                9. Propose follow-up actions and metrics to track
                10. Tag context categories (e.g., stress, diet, tech use)

                IMPORTANT: Respond ONLY with valid JSON. Do not include any explanatory text, markdown formatting, or code blocks. Start your response directly with the opening curly brace {{ and end with the closing curly brace }}.

                RESPONSE FORMAT (JSON):
                {{
                  "sleepAssessment": {{
                    "issue": "string",  // e.g. 'difficulty falling asleep'
                    "confidence": number,  // 0.0 to 1.0
                    "severity": "low" | "medium" | "high",
                    "summary": "string",
                    "sleepHistoryDetected": boolean,
                    "userMood": "tired" | "refreshed" | "anxious" | "groggy" | "unknown",
                    "sleepDurationTrend": "increasing" | "decreasing" | "stable" | "unknown"
                  }},
                  "routineRecommendation": {{
                    "windDown": ["string"],  // calming activities
                    "avoidBeforeBed": ["string"],  // caffeine, screens, etc.
                    "optimalSleepTime": "string",  // e.g. "10:45 PM"
                    "optimalWakeTime": "string",  // e.g. "6:30 AM"
                    "reminders": ["string"]
                  }},
                  "tips": {{
                    "immediateActions": ["string"],  // changes starting tonight
                    "lifestyleChanges": ["string"],  // longer-term habits
                    "environmentSuggestions": ["string"]  // bedroom, lighting, etc.
                  }},
                  "recommendations": {{
                      "immediate": ["string"], // 3-4 immediate actionable suggestions
                      "content": {{
                      "spotify": {{
                          "genres": ["string"], // ambient, classical, nature sounds, etc.
                          "energy": number, // 0-1 (0=calm, 1=energetic)
                          "valence": number, // 0-1 (0=sad, 1=happy)
                          "mood": "string" // relaxing, uplifting, focus, etc.
                          "playlist": [{{ // use search_spotify_playlists tool to get the playlist, IMPORTANT: do only one tool call strictly for this field, also directly use the tool call response for this field, do not parse the response yourself
                            "name": "string",
                            "description": "string",
                            "external_url": "string (URL)",
                            "image": "string (URL)",
                            "owner": {{
                                "name": "string",
                                "url": "string (URL)"
                            }},
                            "tracks": {{
                                "url": "string (API endpoint URL)",
                                "total": "integer"
                            }}
                          }}]
                      }},
                      }}
                  }},
                  "disorderCheck": {{
                    "riskLevel": "low" | "medium" | "high",
                    "symptoms": ["string"],
                    "recommendations": ["string"],
                    "complianceRisk": "low" | "medium" | "high"  // likelihood user may not follow
                  }},
                  "followUp": {{
                    "checkInPeriod": "daily" | "weekly" | "custom",
                    "trackMetrics": ["string"],  // e.g. "hours slept", "interruptions"
                    "goals": ["string"]  // e.g. "reduce latency to < 20 minutes"
                  }},
                  "metadata": {{
                    "wordCount": number,
                    "timeOfDayMentioned": "morning" | "afternoon" | "evening" | "night" | "unknown",
                    "contextTags": ["string"]  // e.g. ["stress", "caffeine", "screen use"]
                  }}
                }}

                GUIDELINES:
                - Be empathetic and non-judgmental
                - Focus on actionable insights
                - Consider cultural sensitivity
                - If serious sleep health concerns are detected, prioritize professional help recommendations
                - Tailor content suggestions to the specific sleep needs identified
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
                    "sleepAssessment": {{
                        "issue": "Difficulty falling asleep",
                        "confidence": 0.8
                    }}
                }}

                [EXAMPLE OF INCORRECT RESPONSE]
                USER INPUT: "{input}"\n
                {{
                    "sleepAssessment": {{
                        "issue": "Difficulty falling asleep"
                    }}
                }}

                Return only the JSON object with no additional text or formatting.
                """
            ),
            name="sleep_coach_agent"
        )
        self.collection = get_collection("sleep_coach")

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

    def _create_sleep_analysis_model(self, parsed_result: Dict[str, Any], user_id: str, user_input: str, context: dict) -> SleepAnalysis:
        try:
            sleep_assessment_data = parsed_result.get("sleepAssessment", {})
            routine_data = parsed_result.get("routineRecommendation", {})
            tips_data = parsed_result.get("tips", {})
            recommendations_data = parsed_result.get("recommendations", {})
            disorder_data = parsed_result.get("disorderCheck", {})
            followup_data = parsed_result.get("followUp", {})
            metadata_data = parsed_result.get("metadata", {})

            sleep_assessment = SleepAssessment(
                issue=sleep_assessment_data.get("issue", "unknown"),
                confidence=sleep_assessment_data.get("confidence", 0.5),
                severity=sleep_assessment_data.get("severity", "low"),
                summary=sleep_assessment_data.get("summary", ""),
                sleepHistoryDetected=sleep_assessment_data.get("sleepHistoryDetected", False),
                userMood=sleep_assessment_data.get("userMood", "unknown"),
                sleepDurationTrend=sleep_assessment_data.get("sleepDurationTrend", "unknown")
            )

            routine_recommendation = RoutineRecommendation(
                windDown=routine_data.get("windDown", []),
                avoidBeforeBed=routine_data.get("avoidBeforeBed", []),
                optimalSleepTime=routine_data.get("optimalSleepTime", ""),
                optimalWakeTime=routine_data.get("optimalWakeTime", ""),
                reminders=routine_data.get("reminders", [])
            )

            tips = SleepTips(
                immediateActions=tips_data.get("immediateActions", []),
                lifestyleChanges=tips_data.get("lifestyleChanges", []),
                environmentSuggestions=tips_data.get("environmentSuggestions", [])
            )

            content_data = recommendations_data.get("content", {})
            recommendations = SleepRecommendations(
                immediate=recommendations_data.get("immediate", []),
                content={
                    "spotify": {
                        "genres": content_data.get("spotify", {}).get("genres", []),
                        "energy": content_data.get("spotify", {}).get("energy", 0.5),
                        "valence": content_data.get("spotify", {}).get("valence", 0.5),
                        "mood": content_data.get("spotify", {}).get("mood", "relaxing"),
                        "playlist": content_data.get("spotify", {}).get("playlist", None)
                    }
                }
            )

            disorder_check = DisorderCheck(
                riskLevel=disorder_data.get("riskLevel", "low"),
                symptoms=disorder_data.get("symptoms", []),
                recommendations=disorder_data.get("recommendations", []),
                complianceRisk=disorder_data.get("complianceRisk", "medium")
            )

            followup = SleepFollowUp(
                checkInPeriod=followup_data.get("checkInPeriod", "weekly"),
                trackMetrics=followup_data.get("trackMetrics", []),
                goals=followup_data.get("goals", [])
            )

            metadata = SleepMetadata(
                wordCount=metadata_data.get("wordCount", 0),
                timeOfDayMentioned=metadata_data.get("timeOfDayMentioned", "unknown"),
                contextTags=metadata_data.get("contextTags", [])
            )

            return SleepAnalysis(
                userId=user_id,
                input=user_input,
                context=context,
                sleepAssessment=sleep_assessment,
                routineRecommendation=routine_recommendation,
                tips=tips,
                recommendations=recommendations,
                disorderCheck=disorder_check,
                followUp=followup,
                metadata=metadata
            )

        except Exception as e:
            print(f"Error creating SleepAnalysis model: {e}")
            raise

    async def run(self, user_input: str, user_id: str = None, context: dict = None, save_to_db: bool = True) -> Dict[str, Any]:
        try:
            prompt = (
                f"""
                CONTEXT:
                    - MindFuel is a mental wellness app that helps users track sleep, get personalized content recommendations, and improve sleep health
                    - Users share their sleep patterns, issues, and current state
                    - Your analysis will be used to provide personalized Spotify playlists and sleep recommendations
                    - Be empathetic, supportive, and professional in your analysis

                USER INPUT:
                {user_input}
                """
            )

            response = await asyncio.to_thread(self.agent.invoke, {
                "input": prompt
            })
    
            content = response.get("output", "")

            if isinstance(content, dict):
                parsed_result = content  # already a dict
            elif isinstance(content, str):
                try:
                    parsed_result = json.loads(content)
                except json.JSONDecodeError as e:
                    return {"error": f"Failed to parse JSON: {str(e)}"}
            else:
                return {"error": "Unknown content format from sleep coach."}

            db_info = {}
            full_analysis_model = self._create_sleep_analysis_model(parsed_result, user_id, user_input, context)

            if save_to_db and user_id:
                try:
                    await init_database()
                    
                    full_repo = SleepAnalysisRepository()
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

    async def run3(self, user_input: str, user_id: str = None, context: str = None, save_to_db: bool = True) -> Dict[str, Any]:
        try:
            context_str = """
                - MindFuel is a mental wellness app that helps users track sleep, get personalized content recommendations, and improve sleep health
                - Users share their sleep patterns, issues, and current state
                - Your analysis will be used to provide personalized Spotify playlists and sleep recommendations
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
                
                spotify_rec = parsed_result.get("recommendations", {}).get("content", {}).get("spotify")
                
                tasks = []
                if spotify_rec:
                    spotify_agent = get_agent("content_generator_agent")
                    tasks.append(asyncio.to_thread(spotify_agent.run, "spotify", spotify_rec))

                if tasks:
                    recommendation_results = await asyncio.gather(*tasks)
                    
                    if spotify_rec:
                        parsed_result["recommendations"]["content"]["spotify"]["playlist"] = recommendation_results.pop(0)

            except Exception as e:
                print(f"Error getting content recommendations: {e}")

            db_info = {}
            full_analysis_model = self._create_sleep_analysis_model(parsed_result, user_id, user_input, context)

            if save_to_db and user_id:
                try:
                    await init_database()
                    
                    full_repo = SleepAnalysisRepository()
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

    def run2(self, user_input, user_id=None, context=None):
        try:
            context_str = """
                - MindFuel is a mental wellness app that helps users track sleep, get personalized content recommendations, and improve sleep health
                - Users share their sleep patterns, issues, and current state
                - Your analysis will be used to provide personalized Spotify playlists and sleep recommendations
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

    async def get_user_analyses(self, user_id: str, limit: int = 10, simple: bool = True) -> Dict[str, Any]:
        try:
            await init_database()
            
            repo = SleepAnalysisRepository()
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

    async def get_sleep_trends(self, user_id: str, days: int = 30) -> Dict[str, Any]:
        try:
            await init_database()
            db = await get_database()
            repo = SleepAnalysisRepository(db)
            trends = await repo.get_user_sleep_trends(user_id, days)
            return {"trends": trends}
        except Exception as e:
            print(f"Error getting sleep trends: {e}")
            return {"error": str(e)}