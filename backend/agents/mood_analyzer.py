import os
from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from core.chroma import get_collection
from config.setting import settings
class MoodAnalyzerAgent:
    def __init__(self):
        self.llm = OpenAI(openai_api_key=settings.OPENAI_API_KEY, model="gpt-4o-mini")
        self.prompt = PromptTemplate(
            template="""
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
                "immediate": ["string"], // 3-4 immediate actionable suggestions
                "content": {{
                "youtube": {{
                    "types": ["string"], // meditation, breathing exercises, motivational, educational, etc.
                    "keywords": ["string"], // search keywords for relevant videos
                    "duration": "string", // short (0-10min), medium (10-30min), long (30min+)
                    "mood": "string" // target mood for content
                }},
                "articles": {{
                    "topics": ["string"], // psychology, self-help, mindfulness, etc.
                    "difficulty": "string", // beginner, intermediate, advanced
                    "focus": ["string"] // coping strategies, understanding emotions, etc.
                }},
                "spotify": {{
                    "genres": ["string"], // ambient, classical, nature sounds, etc.
                    "energy": number, // 0-1 (0=calm, 1=energetic)
                    "valence": number, // 0-1 (0=sad, 1=happy)
                    "mood": "string" // relaxing, uplifting, focus, etc.
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

            Analyze the user input and give response in JSON format following the above RESPONSE FORMAT.
            MAKE SURE TO COMPLETE THE ENTIRE JSON STRUCTURE INCLUDING ALL SECTIONS.
            DO NOT TRUNCATE THE RESPONSE.

            IMPORTANT: Your response MUST be a complete JSON object with all sections filled out.
            The response MUST end with the closing brackets for all opened sections.
            DO NOT stop generating until the JSON is complete.`
            """,
            input_variables=["context", "input"]
        )
        self.chain = self.prompt | self.llm
        self.collection = get_collection("mood_analyzer")

    def run(self, user_input, user_id=None, context=None):
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
        



        from langchain.chains import SequentialChain

def run(self, user_input):
    # Step 1: Mood Analysis
    analysis_chain = analysis_prompt | self.llm
    analysis_json = analysis_chain.invoke({"input": user_input})
    
    # Validate JSON
    try:
        analysis_data = json.loads(analysis_json)
    except json.JSONDecodeError:
        return {"error": "Analysis step failed"}

    # Step 2: Insights
    insights_chain = insights_prompt | self.llm
    insights_json = insights_chain.invoke({"analysis_json": analysis_json})
    
    try:
        insights_data = json.loads(insights_json)
    except json.JSONDecodeError:
        return {"error": "Insights step failed"}

    # Step 3: Recommendations
    recommendations_chain = recommendations_prompt | self.llm
    recommendations_json = recommendations_chain.invoke({
        "analysis_json": analysis_json,
        "insights_json": insights_json
    })

    try:
        recommendations_data = json.loads(recommendations_json)
    except json.JSONDecodeError:
        return {"error": "Recommendations step failed"}

    # Combine all outputs
    return {
        **analysis_data,
        **insights_data,
        **recommendations_data
    }