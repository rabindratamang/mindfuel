"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoodAnalyzer } from "@/components/mood-analyzer"
import { ContentRecommendations } from "@/components/content-recommendations"
import { useState, useEffect } from "react"
import { TrendingUp, ChevronRight, Calendar, BarChart3 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { MoodEntryDetail } from "@/components/mood-entry-detail"
import { apiClient } from "@/lib/api-client"
import { humanifyEntryDate } from "@/lib/utils"

export default function MoodPage() {
  // This would come from the MoodAnalyzer component in a real implementation
  const [currentMood, setCurrentMood] = useState<string | null>(null)
  const [moodScore, setMoodScore] = useState<number>(0)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [viewingJournalEntry, setViewingJournalEntry] = useState<any>(null)
  const [selectedVideo, setSelectedVideo] = useState<{ videoId: string; title: string } | null>(null)
  const [journalEntries, setJournalEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 5
  const totalPages = Math.ceil(journalEntries.length / entriesPerPage)
  const paginatedEntries = journalEntries.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)

  const handleMoodAnalyzed = (
    mood: string,
    score: number,
    analysis: string,
    suggestions: string[],
    fullResponse?: any,
  ) => {
    setCurrentMood(mood)
    setMoodScore(score)
    setApiResponse(fullResponse)
    setViewingJournalEntry(null) // Clear journal view when new analysis

    // Add the new entry to the journal entries list
    if (fullResponse) {
      const newEntry = {
        ...fullResponse,
        id: fullResponse._id || Date.now().toString(),
        date: new Date().toLocaleString(),
        preview: fullResponse.insights?.summary?.substring(0, 100) + "..." || "New mood entry",
        fullContent: fullResponse.insights?.summary || "Mood analysis completed",
      }
      setJournalEntries((prev) => [newEntry, ...prev])
    }
  }

  const handleViewJournalEntry = (entry: any) => {
    setViewingJournalEntry(entry)
    setCurrentMood(entry.analysis?.primaryMood || entry.mood)
    setMoodScore(entry.analysis?.confidence || entry.score)
    setApiResponse(entry)
  }

  const handleBackToJournal = () => {
    setViewingJournalEntry(null)
    setCurrentMood(null)
    setMoodScore(0)
    setApiResponse(null)
  }

  // Helper function to extract YouTube video ID from URL
  const extractVideoId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : ""
  }

  // Helper function to format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleContentClick = (content: any) => {
    if (content.video_url) {
      // YouTube video
      const videoId = extractVideoId(content.video_url)
      if (videoId) {
        setSelectedVideo({ videoId, title: content.title })
      } else {
        window.open(content.video_url, "_blank")
      }
    } else if (content.spotify_url) {
      // Spotify playlist
      window.open(content.spotify_url, "_blank")
    } else if (content.external_url) {
      // Other external content
      window.open(content.external_url, "_blank")
    } else {
      window.open(content.url, "_blank")
    }
  }

  // Fetch journal entries on component mount
  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        setLoading(true)
        // For now, we'll use mock data since we don't have the journal endpoint yet
        // Replace this with actual API call when available
        const entries = await apiClient.get("/mood")
        // entries.push(
        //     {
        //       _id: "6856d16cc6f5ddb1470a0f07",
        //       userId: "684dde1e2e116b51058674bc",
        //       date: "Today, 2:30 PM",
        //       preview: "You experienced a productive morning meeting that made you feel valued and happy...",
        //       fullContent:
        //         "Had a productive morning meeting where my contributions were valued, leading to a strong sense of confidence and happiness. The team was receptive to my ideas and I felt confident presenting.",
        //       analysis: {
        //         primaryMood: "Happy",
        //         moodCategory: "positive",
        //         confidence: 90,
        //         intensity: 8,
        //         emotions: [
        //           { emotion: "Joy", score: 85 },
        //           { emotion: "Satisfaction", score: 80 },
        //         ],
        //         sentiment: {
        //           polarity: 1,
        //           subjectivity: 0.8,
        //         },
        //       },
        //       insights: {
        //         summary:
        //           "You experienced a productive morning meeting that made you feel valued and happy. This positive engagement reflects a strong sense of accomplishment.",
        //         keyThemes: ["work", "achievement"],
        //         triggers: ["productive meeting", "valued contributions"],
        //         strengths: ["positive feedback", "team collaboration"],
        //         concerns: [],
        //       },
        //       recommendations: {
        //         immediate: [
        //           "Reflect on your contributions and how they made a difference.",
        //           "Share your positive experience with colleagues.",
        //           "Set new goals for upcoming meetings.",
        //           "Continue seeking opportunities for collaboration.",
        //           "Practice gratitude for your achievements.",
        //           "Engage in a short mindfulness exercise to maintain positivity.",
        //         ],
        //         content: {
        //           youtube: {
        //             videos: [
        //               {
        //                 title: "What Makes the Highest Performing Teams in the World | Simon Sinek",
        //                 video_url: "https://www.youtube.com/watch?v=zP9jpxitfb4",
        //                 duration_seconds: 82,
        //                 thumbnail: "https://i.ytimg.com/vi/zP9jpxitfb4/hqdefault.jpg",
        //                 channel: {
        //                   title: "Simon Sinek",
        //                   channel_id: "UCPmfPl-BsCd3wmE8i45LAoA",
        //                   avatar:
        //                     "https://yt3.ggpht.com/ytc/AIdro_l2t7UWFeHV7IKyIAM4rexGjLh0CeJ0tCo8b8pTAMjug9U=s240-c-k-c0x00ffffff-no-rj",
        //                   channel_url: "https://www.youtube.com/channel/UCPmfPl-BsCd3wmE8i45LAoA",
        //                 },
        //               },
        //               {
        //                 title: "THE POWER OF POSITIVITY - Best Motivational Video For Positive Thinking",
        //                 video_url: "https://www.youtube.com/watch?v=HwLK9dBQn0g",
        //                 duration_seconds: 764,
        //                 thumbnail: "https://i.ytimg.com/vi/HwLK9dBQn0g/hqdefault.jpg",
        //                 channel: {
        //                   title: "Motivation2Study",
        //                   channel_id: "UC8PICQUP0a_HsrA9S4IIgWw",
        //                   avatar:
        //                     "https://yt3.ggpht.com/ytc/AIdro_m8DuO0qNak58a-KpeERBOx8IuZvbZn6cjL33JUi6Te0p4=s240-c-k-c0x00ffffff-no-rj",
        //                   channel_url: "https://www.youtube.com/channel/UC8PICQUP0a_HsrA9S4IIgWw",
        //                 },
        //               },
        //             ],
        //           },
        //           spotify: {
        //             playlist: {
        //               playlists: [
        //                 {
        //                   name: "Energetic Upbeat lofi 🍉 Jazzhop Beats & Chillhop Music",
        //                   description:
        //                     "Study lo-fi vibes chill adhd focus for work 2025 new jazz hip hop instrumental covers low fi cafe bar fast uplifting feel good songs relax to stress relief tunes",
        //                   external_url: "https://open.spotify.com/playlist/5vImPKH5smp2ifK34N6XTd",
        //                   image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c6167208749bd9e763b85353d",
        //                   owner: {
        //                     name: "Chill Select",
        //                     url: "https://open.spotify.com/user/dor7cmlu5cn1dki1iqagc2ba6",
        //                   },
        //                   tracks: {
        //                     total: 426,
        //                   },
        //                 },
        //               ],
        //             },
        //           },
        //         },
        //       },
        //       followUp: {
        //         questions: [
        //           "What made the meeting feel productive for you?",
        //           "How do you plan to build on this positive experience?",
        //         ],
        //         checkIn: "2 days",
        //         goals: ["Continue to engage in productive meetings", "Seek feedback regularly"],
        //       },
        //       riskAssessment: {
        //         level: "low",
        //         indicators: [],
        //         recommendations: [],
        //         urgency: "none",
        //       },
        //       metadata: {
        //         wordCount: 17,
        //         complexity: "simple",
        //         timeOfDay: "morning",
        //         context: ["work"],
        //       },
        //       createdAt: "2025-06-22T04:25:46.333273",
        //       updatedAt: "2025-06-22T04:25:46.333277",
        //     }
        // )
        setJournalEntries(entries)
      } catch (error) {
        console.error("Failed to fetch journal entries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJournalEntries()
  }, [])

  // Mock data for trends - in real app this would come from API
  const moodTrendsData = {
    week: {
      scores: [6.2, 7.5, 4.8, 8.1, 6.5, 7.2, 8.5],
      intensity: [5, 7, 3, 8, 6, 7, 9],
      contexts: {
        work: [8, 6, 9, 4, 7, 5, 3],
        relationships: [3, 4, 2, 6, 4, 5, 7],
        health: [5, 6, 7, 8, 6, 7, 8],
        energy: [4, 7, 3, 8, 6, 7, 9],
      },
      emotions: {
        happy: [20, 35, 10, 60, 30, 40, 70],
        anxious: [60, 30, 80, 20, 40, 30, 10],
        calm: [15, 25, 5, 15, 25, 25, 15],
        excited: [5, 10, 5, 5, 5, 5, 5],
      },
    },
  }

  // Mock analytics data
  const analyticsData = {
    monthlyComparison: [
      { month: "Jan", score: 6.8 },
      { month: "Feb", score: 7.2 },
      { month: "Mar", score: 6.5 },
      { month: "Apr", score: 7.8 },
    ],
    timeOfDay: [
      { time: "Morning", score: 7.5, count: 12 },
      { time: "Afternoon", score: 6.2, count: 8 },
      { time: "Evening", score: 7.8, count: 15 },
      { time: "Night", score: 6.0, count: 5 },
    ],
    streaks: {
      current: 7,
      longest: 14,
      thisMonth: 23,
    },
  }

  const currentData = moodTrendsData.week

  // If viewing a journal entry, show the detailed view
  if (viewingJournalEntry) {
    return (
      <MoodEntryDetail entry={viewingJournalEntry} onBack={handleBackToJournal} onContentClick={handleContentClick} />
    )
  }

  // Default journal list view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mood Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400">Track and analyze your mood patterns with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>How are you feeling?</CardTitle>
              <CardDescription>
                Share your thoughts and our AI will analyze your mood and provide personalized suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[300px]">
              <MoodAnalyzer onMoodAnalyzed={handleMoodAnalyzed} onViewDetails={handleViewJournalEntry} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Mood Trends</CardTitle>
                  <CardDescription>Your emotional patterns</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Mood Chart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Mood Score</span>
                  <span className="text-slate-500">0-10</span>
                </div>
                <div className="h-32 flex items-end justify-between gap-2 bg-slate-50 dark:bg-slate-800/50 rounded p-2">
                  {currentData.scores.map((value, i) => {
                    const heightPercentage = (value / 10) * 100
                    const minHeight = 8 // Minimum height in pixels
                    const calculatedHeight = Math.max(heightPercentage, minHeight)

                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                        <div
                          className="bg-gradient-to-t from-teal-500 to-sky-500 rounded-t w-full relative group cursor-pointer hover:opacity-80 transition-all duration-200"
                          style={{
                            height: `${calculatedHeight}%`,
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {value}/10
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  <div className="font-medium text-green-700 dark:text-green-300">Best Day</div>
                  <div className="text-green-600 dark:text-green-400">Sunday (8.5)</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                  <div className="font-medium text-amber-700 dark:text-amber-300">Avg Score</div>
                  <div className="text-amber-600 dark:text-amber-400">6.8/10</div>
                </div>
              </div>

              {/* Trend Insights */}
              <div className="bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3 h-3 text-teal-600" />
                  <span className="text-xs font-medium text-teal-700 dark:text-teal-300">Weekly Insight</span>
                </div>
                <p className="text-xs text-teal-600 dark:text-teal-400">
                  Your mood improved by 37% this week! Work stress decreased significantly after Wednesday.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Recommendations - Show after mood analysis */}
      {currentMood && <ContentRecommendations mood={currentMood} moodScore={moodScore} apiResponse={apiResponse} />}

      <Tabs defaultValue="personal-journal">
        <TabsList className="mb-4">
          <TabsTrigger value="personal-journal">Personal Journal</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="personal-journal" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Personal Journal</CardTitle>
                  <CardDescription className="text-sm">Your mood analysis history and insights</CardDescription>
                </div>
                <div className="text-xs text-slate-500">{journalEntries.length} total entries</div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="text-slate-500 text-sm">Loading journal entries...</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="text-xs text-slate-500">
                      Showing {(currentPage - 1) * entriesPerPage + 1}-
                      {Math.min(currentPage * entriesPerPage, journalEntries.length)} of {journalEntries.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-7 px-2 text-xs"
                      >
                        Previous
                      </Button>
                      <span className="text-xs px-2">
                        {currentPage} of {totalPages}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-7 px-2 text-xs"
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  {/* Journal Entries */}
                  {paginatedEntries.map((entry) => (
                    <Collapsible
                      key={entry._id || entry.id}
                      open={expandedEntry === (entry._id || entry.id)}
                      onOpenChange={(open) => setExpandedEntry(open ? entry._id || entry.id : null)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="w-full p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                  <Calendar className="w-3 h-3" />
                                  {humanifyEntryDate(entry.createdAt)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        entry.analysis.moodCategory === "positive"
                                        ? "bg-green-500"
                                        : entry.analysis.moodCategory === "negative"
                                          ? "bg-red-500"
                                          : "bg-yellow-500"
                                    }`}
                                  />
                                  <span className="text-xs font-medium">
                                    {entry.analysis?.primaryMood || entry.mood}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    ({entry.analysis?.confidence || entry.score}/100)
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 truncate pr-2">{entry.input}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewJournalEntry(entry)
                                }}
                                className="h-7 px-2 text-xs"
                              >
                                View
                              </Button>
                              <ChevronRight
                                className={`w-3 h-3 text-slate-400 transition-transform ${
                                  expandedEntry === (entry._id || entry.id) ? "rotate-90" : ""
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="border-l-2 border-teal-500 pl-3 space-y-3 ml-1">
                          <div>
                            <h4 className="font-medium mb-1 text-sm">Full Entry</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {entry.input || entry.insights?.summary}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1 text-sm">AI Analysis</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {entry.insights?.summary || entry.analysis}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1 text-sm">Quick Preview</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-xs">
                                <div className="font-medium mb-1">Immediate Actions</div>
                                <div className="text-slate-600 dark:text-slate-400">
                                  {entry.recommendations?.immediate?.length || 0} suggestions available
                                </div>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-xs">
                                <div className="font-medium mb-1">Content Recommendations</div>
                                <div className="text-slate-600 dark:text-slate-400">
                                  {(entry.recommendations?.content?.youtube?.videos?.length || 0) +
                                    (entry.recommendations?.content?.spotify?.playlist?.playlists?.length || 0)}{" "}
                                  items curated
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}

                  {/* Empty State */}
                  {journalEntries.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <div className="text-slate-400 text-sm">No journal entries yet</div>
                      <div className="text-xs text-slate-500 mt-1">Start by analyzing your mood above</div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* Current Mood Analysis - Minimal */}
          {apiResponse && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Current Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Detected Mood</div>
                    <div className="font-semibold">{currentMood}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Confidence</div>
                    <div className="font-semibold">{moodScore}%</div>
                  </div>
                </div>

                {apiResponse.analysis?.emotions && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Emotional Breakdown</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {apiResponse.analysis.emotions.map((emotion: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className="capitalize">{emotion.emotion}</span>
                          <span className="font-medium">{emotion.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Patterns & Insights - Minimal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      <span className="font-medium">Stress Triggers</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">Work deadlines increase anxiety by 40%</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full" />
                      <span className="font-medium">Time Patterns</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">Mood dips between 2-4 PM daily</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="font-medium">Mood Boosters</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">Exercise and music improve mood by 60%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Content Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>YouTube Videos</span>
                    <span className="font-medium">80%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Music & Audio</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Articles</span>
                    <span className="font-medium">40%</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded text-xs text-slate-600 dark:text-slate-400">
                  💡 You engage most with motivational videos when feeling low
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations - Minimal */}
          {apiResponse?.recommendations && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Immediate Actions</div>
                    <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                      {apiResponse.recommendations.immediate?.slice(0, 3).map((rec: string, index: number) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Key Themes</div>
                    <div className="flex flex-wrap gap-1">
                      {apiResponse.insights?.keyThemes?.map((theme: string, index: number) => (
                        <span key={index} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm">
                  <div className="font-medium mb-1">🎯 Personalized Insight</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {apiResponse.insights?.summary ||
                      "Your mood analysis shows positive patterns and growth opportunities."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Overview - Minimal */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Wellness Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">7.2</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Average Mood</div>
                  <div className="text-xs text-green-600 dark:text-green-400">↑ 12%</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">23</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Check-ins</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Goal: 30</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">89%</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Success Rate</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Content helped</div>
                </div>
              </div>

              <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded">
                <div className="text-sm font-medium mb-2">AI Coach Insight</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your mood stability has improved significantly! Morning motivation videos and evening relaxation music
                  work well for your circadian rhythm.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Monthly Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-32 flex items-end justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 rounded p-3">
                  {analyticsData.monthlyComparison.map((month, i) => {
                    const heightPercentage = (month.score / 10) * 100
                    return (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                        <div className="text-xs text-slate-500">{month.score}</div>
                        <div
                          className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t w-full"
                          style={{ height: `${heightPercentage}%` }}
                        />
                        <div className="text-xs text-slate-500">{month.month}</div>
                      </div>
                    )
                  })}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 text-center">
                  Steady improvement over the past 4 months
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Time of Day Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.timeOfDay.map((time, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          time.score >= 7 ? "bg-green-500" : time.score >= 5 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      />
                      <span>{time.time}</span>
                      <span className="text-xs text-slate-500">({time.count} entries)</span>
                    </div>
                    <span className="font-medium">{time.score}/10</span>
                  </div>
                ))}
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded text-xs text-slate-600 dark:text-slate-400">
                  💡 You feel best in the evenings and mornings
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Streak Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {analyticsData.streaks.current}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Current Streak</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {analyticsData.streaks.longest}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Longest Streak</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {analyticsData.streaks.thisMonth}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">This Month</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 p-3 rounded text-xs text-slate-600 dark:text-slate-400">
                  🔥 You're on a 7-day streak! Keep it up to reach your personal best.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Context Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(currentData.contexts).map(([context, values]) => {
                  const avg = values.reduce((a, b) => a + b, 0) / values.length
                  const impact = avg > 6 ? "positive" : avg > 4 ? "neutral" : "negative"
                  return (
                    <div key={context} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            impact === "positive"
                              ? "bg-green-500"
                              : impact === "neutral"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span className="capitalize">{context}</span>
                      </div>
                      <span className="font-medium">{avg.toFixed(1)}/10</span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
