from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId
from database.mongo_client import get_database


class SleepAssessment(BaseModel):
    issue: str
    confidence: float = Field(ge=0, le=1)
    severity: str  # low, medium, high
    summary: str
    sleepHistoryDetected: bool
    userMood: str  # tired, refreshed, anxious, groggy, unknown
    sleepDurationTrend: str  # increasing, decreasing, stable, unknown


class RoutineRecommendation(BaseModel):
    windDown: List[str]
    avoidBeforeBed: List[str]
    optimalSleepTime: str
    optimalWakeTime: str
    reminders: List[str]


class SleepTips(BaseModel):
    immediateActions: List[str]
    lifestyleChanges: List[str]
    environmentSuggestions: List[str]


class SpotifyPlaylist(BaseModel):
    name: str
    description: str
    external_url: str
    image: str
    owner: Dict[str, str]
    tracks: Dict[str, Any]


class SleepContentRecommendations(BaseModel):
    spotify: Dict[str, Any]  # Contains spotify playlist recommendations


class SleepRecommendations(BaseModel):
    immediate: List[str]
    content: SleepContentRecommendations


class DisorderCheck(BaseModel):
    riskLevel: str  # low, medium, high
    symptoms: List[str]
    recommendations: List[str]
    complianceRisk: str  # low, medium, high


class SleepFollowUp(BaseModel):
    checkInPeriod: str  # daily, weekly, custom
    trackMetrics: List[str]
    goals: List[str]


class SleepMetadata(BaseModel):
    wordCount: int
    timeOfDayMentioned: str  # morning, afternoon, evening, night, unknown
    contextTags: List[str]  # e.g., ["stress", "caffeine", "screen use"]


class SleepAnalysis(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str = Field(alias="userId")
    input: str = ""
    context: dict = {}
    sleepAssessment: SleepAssessment
    routineRecommendation: RoutineRecommendation
    tips: SleepTips
    recommendations: SleepRecommendations
    disorderCheck: DisorderCheck
    followUp: SleepFollowUp
    metadata: SleepMetadata
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
    def from_mongo(cls, data: Dict[str, Any]) -> "SleepAnalysis":
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

    def to_simple_format(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "userId": self.userId,
            "issue": self.sleepAssessment.issue,
            "severity": self.sleepAssessment.severity,
            "summary": self.sleepAssessment.summary,
            "recommendations": self.recommendations.immediate[:3],
            "createdAt": self.createdAt.isoformat()
        }


class SleepAnalysisRepository:
    def __init__(self, db=None):
        self._db = db
        self._collection = None

    @property
    async def collection(self):
        if self._collection is None:
            if self._db is None:
                db = await get_database()
            else:
                db = self._db
            self._collection = db.sleep_analyses
        return self._collection

    async def create(self, sleep_analysis: SleepAnalysis) -> str:
        doc = sleep_analysis.to_mongo()
        result = await (await self.collection).insert_one(doc)
        return str(result.inserted_id)

    async def get_by_id(self, analysis_id: str) -> Optional[SleepAnalysis]:
        doc = await (await self.collection).find_one({"_id": ObjectId(analysis_id)})
        return SleepAnalysis.from_mongo(doc) if doc else None

    async def get_by_user_id(self, user_id: str, limit: int = 10) -> List[SleepAnalysis]:
        cursor = (await self.collection).find({"userId": ObjectId(user_id)}).sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [SleepAnalysis.from_mongo(doc) for doc in docs]

    async def update(self, analysis_id: str, updates: Dict[str, Any]) -> bool:
        updates["updatedAt"] = datetime.utcnow()
        result = await (await self.collection).update_one(
            {"_id": ObjectId(analysis_id)},
            {"$set": updates}
        )
        return result.modified_count > 0

    async def delete(self, analysis_id: str) -> bool:
        result = await (await self.collection).delete_one({"_id": ObjectId(analysis_id)})
        return result.deleted_count > 0

    async def get_recent_analyses(self, limit: int = 20) -> List[SleepAnalysis]:
        cursor = (await self.collection).find().sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [SleepAnalysis.from_mongo(doc) for doc in docs]

    async def get_analyses_by_issue(self, issue: str, limit: int = 10) -> List[SleepAnalysis]:
        cursor = (await self.collection).find({"sleepAssessment.issue": issue}).sort("createdAt", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [SleepAnalysis.from_mongo(doc) for doc in docs]

    async def get_user_sleep_trends(self, user_id: str, days: int = 30) -> List[Dict[str, Any]]:
        pipeline = [
            {"$match": {"userId": ObjectId(user_id)}},
            {"$match": {"createdAt": {"$gte": datetime.utcnow() - timedelta(days=days)}}},
            {"$group": {
                "_id": "$sleepAssessment.issue",
                "count": {"$sum": 1},
                "avgConfidence": {"$avg": "$sleepAssessment.confidence"},
                "avgSeverity": {"$avg": {
                    "$switch": {
                        "branches": [
                            {"case": {"$eq": ["$sleepAssessment.severity", "low"]}, "then": 1},
                            {"case": {"$eq": ["$sleepAssessment.severity", "medium"]}, "then": 2},
                            {"case": {"$eq": ["$sleepAssessment.severity", "high"]}, "then": 3}
                        ],
                        "default": 0
                    }
                }}
            }},
            {"$sort": {"count": -1}}
        ]
        return await (await self.collection).aggregate(pipeline).to_list(None)

    async def get_analyses_by_date_range(self, user_id: str, start_date: datetime, end_date: datetime) -> List[SleepAnalysis]:
        cursor = (await self.collection).find({
            "userId": ObjectId(user_id),
            "createdAt": {"$gte": start_date, "$lte": end_date}
        }).sort("createdAt", -1)
        docs = await cursor.to_list(None)
        return [SleepAnalysis.from_mongo(doc) for doc in docs]

    async def get_high_risk_analyses(self, user_id: str) -> List[SleepAnalysis]:
        cursor = (await self.collection).find({
            "userId": ObjectId(user_id),
            "disorderCheck.riskLevel": {"$in": ["high", "medium"]}
        }).sort("createdAt", -1)
        docs = await cursor.to_list(None)
        return [SleepAnalysis.from_mongo(doc) for doc in docs]

    async def get_analyses_by_time_of_day(self, user_id: str, time_of_day: str) -> List[SleepAnalysis]:
        cursor = (await self.collection).find({
            "userId": ObjectId(user_id),
            "metadata.timeOfDayMentioned": time_of_day
        }).sort("createdAt", -1)
        docs = await cursor.to_list(None)
        return [SleepAnalysis.from_mongo(doc) for doc in docs]

    async def get_analyses_by_context_tag(self, user_id: str, tag: str) -> List[SleepAnalysis]:
        cursor = (await self.collection).find({
            "userId": ObjectId(user_id),
            "metadata.contextTags": tag
        }).sort("createdAt", -1)
        docs = await cursor.to_list(None)
        return [SleepAnalysis.from_mongo(doc) for doc in docs]