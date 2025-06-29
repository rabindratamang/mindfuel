from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from tools.spotify_tools import search_spotify_playlists_csv
from config.setting import settings
import json
import re
import asyncio
from typing import Dict, Any
from database.mongo_client import get_database, init_database
from models.sleep_analysis import SleepAnalysis, SleepAnalysisRepository, SleepAssessment, RoutineRecommendation, SleepTips, SleepRecommendations, DisorderCheck, SleepFollowUp, SleepMetadata
from prompts.global_prompts import app_context_str
from langchain_core.messages import SystemMessage

class WindDownAgent:
    def __init__(self):
        self.model = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-4o-mini", max_tokens=10000)
        self.agent = create_react_agent(
            model=self.model,
            tools=[search_spotify_playlists_csv],
            prompt=(
                f"""
                [SYSTEM MESSAGE]
                {app_context_str}
                You are a wind down agent. You are responsible for helping the user wind down and get ready for sleep.
                based on  bedtime, duration (in minutes) and activities user gave you,
                create a personalized spotify playlists and wind-down routine for someone with these preferences:

                **Stress Level Adjustments:**
                - Stress 1-2: Focus on gentle activities, shorter meditation
                - Stress 3: Balanced routine with moderate relaxation
                - Stress 4-5: Longer meditation, breathing exercises, more calming activities

                Generate at least 3 activities that will fill the wind down duration
                Please create a routine that feels natural and sustainable for nightly use.

                Return at least 3 spotify playlists that will help the user wind down and sleep better. strictly use search_spotify_playlists_csv tool to get the playlists.
                """
            ),
            name="wind_down_agent"
        )

    def _parse_ai_response(self, result: str) -> Dict[str, Any]:
        import csv
        import io
        import re
        def extract_csv_between_delimiters(text, delimiter):
            # This regex matches the delimiter, optional whitespace/newlines, optional ```
            # then captures everything up to the next delimiter (with optional whitespace/newlines and optional ```)
            pattern = re.compile(
                rf"{re.escape(delimiter)}\s*`{{0,3}}\s*([\s\S]*?)\s*`{{0,3}}\s*{re.escape(delimiter)}",
                re.MULTILINE
            )
            matches = pattern.findall(text)
            return matches[0] if matches else None

        def clean_csv_block(csv_block):
            return re.sub(r"^```|```$", "", csv_block.strip(), flags=re.MULTILINE)

        def parse_csv_block(csv_block):
            csv_block = clean_csv_block(csv_block)
            reader = csv.DictReader(io.StringIO(csv_block))
            return [row for row in reader]

        try:
            wind_down_csv = extract_csv_between_delimiters(result, "###")
            wind_down_data = parse_csv_block(wind_down_csv) if wind_down_csv else []

            spotify_csv = extract_csv_between_delimiters(result, "---")
            spotify_data = parse_csv_block(spotify_csv) if spotify_csv else []

            return {
                "wind_down": wind_down_data,
                "spotify": spotify_data
            }
        except Exception as e:
            print(f"CSV parsing error: {e}")
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


    async def run(self, user_input: str, user_id: str = None, context: str = None, user_persona: str = None, save_to_db: bool = True) -> Dict[str, Any]:
        try:
            
            context_str = ""
            if user_persona:
                context_str += f"\n\nUser background: {user_persona}"

            output_format = """
                [OUTPUT FORMAT]
                start and end with three hash tags ###
                For wind down routine, return a csv with the following headers:
                time, activity, duration, description

                Example:
                for 30 minutes wind down with bedtime at 00:30 am:
                ###
                time, activity, duration, description
                00:00, meditation, 10, practice deep breathing and mindfulness to calm your mind
                00:10, reading, 10, read something light and enjoyable to wind down
                00:20, music, 10, listen to calming music or nature sounds
                00:30, lights out turn off all lights and dim the lights
                ###

                For spotify recommendations, return a csv with the following headers:
                use the search_spotify_playlists_csv tool to get the playlists
                start and end with three dashes ---
                id, title, artist, image, uri, description

                example:
                ---
                id, title, artist, image, uri, description, tracks_url, tracks_total
                1, Deep Sleep Sounds, Nature Sounds, https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da844d6cb4d7d0ab6a4ef942ae22, https://open.spotify.com/playlist/63sCiH22a44UxGge1gTuPi, Gentle rain and ocean waves for deep relaxation, https://open.spotify.com/playlist/63sCiH22a44UxGge1gTuPi, 100
                ---
                IMPORTANT: strictly follow the headers and format, do not add any other headers or fields.
                Example above is just for reference, do not copy the example.
            """
            user_input = f"""
                bedtime: {context.get("bedtime")}
                duration: {context.get("duration")} minutes
                stressLevel: {context.get("stressLevel")}
                activities: {context.get("activities")}
            """
            result = await asyncio.to_thread(
                self.agent.invoke,
                {
                    "messages": [
                        SystemMessage(content=context_str),
                        SystemMessage(content=output_format),
                        HumanMessage(content=user_input),
                    ]
                }
            )
            parsed_result = self._parse_ai_response(result["messages"][-1].content)
            
            return {
                "frontend_format": {
                    "wind_down": {
                        "totalDuration": context.get("duration"),
                        "activities": parsed_result.get("wind_down", [])
                    },
                    "spotify": {
                        "playlists": parsed_result.get("spotify", [])
                    }
                },
            }

        except Exception as e:
            print(f"Run error: {e}")
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