"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ContentRecommendations } from "@/components/content-recommendations"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  Brain,
  MessageCircle,
  Zap,
  Star,
  AlertTriangle,
} from "lucide-react"

interface MoodEntryDetailProps {
  entry: any
  onBack: () => void
  onContentClick: (content: any) => void
}

export function MoodEntryDetail({ entry, onBack, onContentClick }: MoodEntryDetailProps) {
  // Helper function to get mood category color
  const getMoodCategoryColor = (category: string) => {
    switch (category) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800"
      case "negative":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800"
      case "neutral":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-900/20 dark:border-slate-800"
    }
  }

  // Helper function to get risk level color
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Clean Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Journal
        </Button>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold">{entry.analysis?.primaryMood || entry.mood}</h1>
            <Badge className={getMoodCategoryColor(entry.analysis?.moodCategory || "neutral")} variant="outline">
              {entry.analysis?.moodCategory || "neutral"}
            </Badge>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {entry.date}
            </div>
            {entry.metadata?.timeOfDay && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {entry.metadata.timeOfDay}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Brain className="w-4 h-4" />
              {entry.analysis?.confidence || entry.score}% confidence
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics - Simplified */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">{entry.analysis?.confidence || entry.score}%</div>
          <div className="text-sm text-slate-600">Confidence</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-600">{entry.analysis?.intensity || "N/A"}/10</div>
          <div className="text-sm text-slate-600">Intensity</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600 capitalize">{entry.riskAssessment?.level || "Low"}</div>
          <div className="text-sm text-slate-600">Risk Level</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-600">{entry.insights?.keyThemes?.length || 0}</div>
          <div className="text-sm text-slate-600">Key Themes</div>
        </Card>
      </div>

      {/* Main Content - Organized with Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Your Journal Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{entry.fullContent}</p>

              {entry.metadata?.context && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {entry.metadata.context.map((context: string, index: number) => (
                    <Badge key={index} variant="secondary" className="capitalize">
                      {context}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {entry.insights?.summary || entry.analysis}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-8 mt-6">
          {/* Emotional Profile Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Emotional Profile</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">AI-powered analysis of your emotional state</p>
            </div>

            {/* Emotional Breakdown - More Compact Layout */}
            {entry.analysis?.emotions && (
              <Card>
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-lg">Emotion Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {entry.analysis.emotions.map((emotion: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <span className="font-medium text-sm">{emotion.emotion}</span>
                          </div>
                          <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                            {emotion.score}%
                          </div>
                        </div>
                        <Progress value={emotion.score} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sentiment Analysis */}
            {entry.analysis?.sentiment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {(entry.analysis.sentiment.polarity * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-slate-600">Sentiment Polarity</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {entry.analysis.sentiment.polarity > 0
                        ? "Positive"
                        : entry.analysis.sentiment.polarity < 0
                          ? "Negative"
                          : "Neutral"}
                    </div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {(entry.analysis.sentiment.subjectivity * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-slate-600">Subjectivity</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {entry.analysis.sentiment.subjectivity > 0.5 ? "Subjective" : "Objective"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Key Insights Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Key Insights</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Important patterns and themes identified in your entry
              </p>
            </div>

            {/* Key Themes - Better Visual Design */}
            {entry.insights?.keyThemes && (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Identified Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-3">
                    {entry.insights.keyThemes.map((theme: string, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-full"
                      >
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300 capitalize">{theme}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insights Grid - Cleaner Organization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Positive Insights */}
              {entry.insights?.strengths && entry.insights.strengths.length > 0 && (
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader className="bg-green-50 dark:bg-green-900/20">
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
                      <Star className="w-5 h-5" />
                      Strengths & Positives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {entry.insights.strengths.map((strength: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Areas for Attention */}
              {entry.insights?.triggers && entry.insights.triggers.length > 0 && (
                <Card className="border-amber-200 dark:border-amber-800">
                  <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <Zap className="w-5 h-5" />
                      Triggers & Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {entry.insights.triggers.map((trigger: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{trigger}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Concerns - Only show if they exist */}
              {entry.insights?.concerns && entry.insights.concerns.length > 0 && (
                <Card className="border-red-200 dark:border-red-800 lg:col-span-2">
                  <CardHeader className="bg-red-50 dark:bg-red-900/20">
                    <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                      <AlertTriangle className="w-5 h-5" />
                      Areas of Concern
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {entry.insights.concerns.map((concern: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{concern}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Metadata Section */}
          {entry.metadata && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Entry Details</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Technical analysis of your journal entry</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {entry.metadata.wordCount && (
                  <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                      {entry.metadata.wordCount}
                    </div>
                    <div className="text-sm text-slate-600">Words</div>
                  </Card>
                )}
                {entry.metadata.complexity && (
                  <Card className="text-center p-4">
                    <div className="text-lg font-bold text-slate-700 dark:text-slate-300 capitalize">
                      {entry.metadata.complexity}
                    </div>
                    <div className="text-sm text-slate-600">Complexity</div>
                  </Card>
                )}
                {entry.metadata.timeOfDay && (
                  <Card className="text-center p-4">
                    <div className="text-lg font-bold text-slate-700 dark:text-slate-300 capitalize">
                      {entry.metadata.timeOfDay}
                    </div>
                    <div className="text-sm text-slate-600">Time of Day</div>
                  </Card>
                )}
                {entry.riskAssessment?.level && (
                  <Card className={`text-center p-4 ${getRiskLevelColor(entry.riskAssessment.level)}`}>
                    <div className="text-lg font-bold capitalize">{entry.riskAssessment.level}</div>
                    <div className="text-sm">Risk Level</div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-6 mt-6">
          {/* Immediate Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Immediate Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {entry.recommendations?.immediate?.map((action: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Follow-up Questions */}
          {entry.followUp?.questions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-yellow-500" />
                  Reflection Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entry.followUp.questions.map((question: string, index: number) => (
                    <div key={index} className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <span className="text-sm font-medium">{question}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Goals */}
          {entry.followUp?.goals && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Suggested Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entry.followUp.goals.map((goal: string, index: number) => (
                    <div key={index} className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <span className="text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Content Tab - Now using ContentRecommendations component */}
        <TabsContent value="content" className="space-y-6 mt-6">
          <ContentRecommendations
            mood={entry.analysis?.primaryMood || entry.mood}
            moodScore={entry.analysis?.confidence || entry.score}
            apiResponse={entry}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
