from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId
from database.mongo_client import get_database


class Emotion(BaseModel):
    emotion: str
    score: int = Field(ge=0, le=100)


class Sentiment(BaseModel):
    polarity: float = Field(ge=-1, le=1)
    subjectivity: float = Field(ge=0, le=1)


class Analysis(BaseModel):
    primaryMood: str
    moodCategory: str
    confidence: int = Field(ge=0, le=100)
    intensity: int = Field(ge=1, le=10)
    emotions: List[Emotion]
    sentiment: Sentiment


class Insights(BaseModel):
    summary: str
    keyThemes: List[str]
    triggers: List[str]
    strengths: List[str]
    concerns: List[str]


class YouTubeVideo(BaseModel):
    title: str
    video_url: str
    duration_seconds: int
    thumbnail: str
    channel: Dict[str, str]


class YouTubeRecommendation(BaseModel):
    types: List[str]
    keywords: List[str]
    duration: str
    mood: str
    video: Optional[YouTubeVideo] = None


class ArticlesRecommendation(BaseModel):
    topics: List[str]
    difficulty: str
    focus: List[str]


class SpotifyPlaylist(BaseModel):
    name: str
    description: str
    external_url: str
    image: str
    owner: Dict[str, str]
    tracks: Dict[str, Any]


class SpotifyRecommendation(BaseModel):
    genres: List[str]
    energy: float = Field(ge=0, le=1)
    valence: float = Field(ge=0, le=1)
    mood: str
    playlist: Optional[Dict[str, Any]] = None


class MeditationRecommendation(BaseModel):
    types: List[str]
    duration: int
    difficulty: str


class ContentRecommendations(BaseModel):
    youtube: YouTubeRecommendation
    articles: ArticlesRecommendation
    spotify: SpotifyRecommendation
    meditation: MeditationRecommendation


class Recommendations(BaseModel):
    immediate: List[str]
    content: ContentRecommendations


class FollowUp(BaseModel):
    questions: List[str]
    checkIn: str
    goals: List[str]


class RiskAssessment(BaseModel):
    level: str
    indicators: List[str]
    recommendations: List[str]
    urgency: str


class Metadata(BaseModel):
    wordCount: int
    complexity: str
    timeOfDay: str
    context: List[str]


class MoodAnalysis(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str = Field(alias="userId")
    analysis: Analysis
    insights: Insights
    recommendations: Recommendations
    followUp: FollowUp
    riskAssessment: RiskAssessment
    metadata: Metadata
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

    def to_mongo(self) -> Dict[str, Any]:
        """Convert to MongoDB document format"""
        data = self.dict(exclude={"id"})
        if self.id:
            data["_id"] = ObjectId(self.id)
        data["userId"] = ObjectId(data["userId"])
        return data

    @classmethod
    def from_mongo(cls, data: Dict[str, Any]) -> "MoodAnalysis":
        """Create instance from MongoDB document"""
        if data is None:
            return None
        
        # Create a copy to avoid modifying the original data
        data_copy = data.copy()
        if data_copy.get("_id"):
            data_copy["id"] = str(data_copy["_id"])
            del data_copy["_id"]  # Remove the ObjectId field
        if data_copy.get("userId"):
            data_copy["userId"] = str(data_copy["userId"])
        return cls(**data_copy)


class MoodAnalysisRepository:
    def __init__(self, db=None):
        self._db = db
        self._collection = None

    @property
    async def collection(self):
        """Get collection with automatic initialization"""
        if self._collection is None:
            if self._db is None:
                db = await get_database()
            else:
                db = self._db
            self._collection = db.mood_analyses
        return self._collection

    async def create(self, mood_analysis: MoodAnalysis) -> str:
        """Create a new mood analysis"""
        doc = mood_analysis.to_mongo()
        result = await (await self.collection).insert_one(doc)
        return str(result.inserted_id)

    async def get_by_id(self, analysis_id: str) -> Optional[MoodAnalysis]:
        """Get mood analysis by ID"""
        doc = await (await self.collection).find_one({"_id": ObjectId(analysis_id)})
        return MoodAnalysis.from_mongo(doc) if doc else None

    async def get_by_user_id(self, user_id: str, limit: int = 10) -> List[MoodAnalysis]:
        """Get mood analyses for a user"""
        cursor = (await self.collection).find({"userId": ObjectId(user_id)}).sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [MoodAnalysis.from_mongo(doc) for doc in docs]

    async def update(self, analysis_id: str, updates: Dict[str, Any]) -> bool:
        """Update a mood analysis"""
        updates["updatedAt"] = datetime.utcnow()
        result = await (await self.collection).update_one(
            {"_id": ObjectId(analysis_id)},
            {"$set": updates}
        )
        return result.modified_count > 0

    async def delete(self, analysis_id: str) -> bool:
        """Delete a mood analysis"""
        result = await (await self.collection).delete_one({"_id": ObjectId(analysis_id)})
        return result.deleted_count > 0

    async def get_recent_analyses(self, limit: int = 20) -> List[MoodAnalysis]:
        """Get recent mood analyses"""
        cursor = (await self.collection).find().sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [MoodAnalysis.from_mongo(doc) for doc in docs]

    async def get_analyses_by_mood(self, mood: str, limit: int = 10) -> List[MoodAnalysis]:
        """Get analyses by primary mood"""
        cursor = (await self.collection).find({"analysis.primaryMood": mood}).sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [MoodAnalysis.from_mongo(doc) for doc in docs]

    async def get_user_mood_trends(self, user_id: str, days: int = 30) -> List[Dict[str, Any]]:
        """Get mood trends for a user over specified days"""
        pipeline = [
            {"$match": {"userId": ObjectId(user_id)}},
            {"$match": {"createdAt": {"$gte": datetime.utcnow() - timedelta(days=days)}}},
            {"$group": {
                "_id": "$analysis.primaryMood",
                "count": {"$sum": 1},
                "avgConfidence": {"$avg": "$analysis.confidence"},
                "avgIntensity": {"$avg": "$analysis.intensity"}
            }},
            {"$sort": {"count": -1}}
        ]
        return await (await self.collection).aggregate(pipeline).to_list(None)

    async def get_analyses_by_date_range(self, user_id: str, start_date: datetime, end_date: datetime) -> List[MoodAnalysis]:
        """Get analyses within a date range"""
        cursor = (await self.collection).find({
            "userId": ObjectId(user_id),
            "createdAt": {"$gte": start_date, "$lte": end_date}
        }).sort("createdAt", -1)
        docs = await cursor.to_list(None)
        return [MoodAnalysis.from_mongo(doc) for doc in docs]

    async def get_high_risk_analyses(self, user_id: str) -> List[MoodAnalysis]:
        """Get analyses with high risk assessment"""
        cursor = (await self.collection).find({
            "userId": ObjectId(user_id),
            "riskAssessment.level": {"$in": ["high", "medium"]}
        }).sort("createdAt", -1)
        docs = await cursor.to_list(None)
        return [MoodAnalysis.from_mongo(doc) for doc in docs]

    async def get_analyses_by_time_of_day(self, user_id: str, time_of_day: str) -> List[MoodAnalysis]:
        """Get analyses by time of day"""
        cursor = (await self.collection).find({
            "userId": ObjectId(user_id),
            "metadata.timeOfDay": time_of_day
        }).sort("createdAt", -1)
        docs = await cursor.to_list(None)
        return [MoodAnalysis.from_mongo(doc) for doc in docs] 