"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpotifyPlayer } from "@/components/spotify-player"
import {
  Moon,
  Clock,
  TrendingUp,
  Zap,
  Brain,
  Star,
  Coffee,
  Phone,
  Book,
  Music,
  Play,
  Sparkles,
  Wind,
  Timer,
  Volume2,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface SleepRecord {
  date: string
  bedtime: string
  wakeTime: string
  duration: string
  quality: number
  factors: string[]
  mood: string
  notes: string
}

interface WindDownPlan {
  totalDuration: number
  activities: Array<{
    time: string
    activity: string
    duration: number
    icon: React.ReactNode
    description: string
  }>
}

export default function SleepPage() {
  const [activeTab, setActiveTab] = useState("winddown")
  const [showSleepForm, setShowSleepForm] = useState(false)
  const [showSpotifyPlayer, setShowSpotifyPlayer] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null)
  const [windDownPreferences, setWindDownPreferences] = useState({
    bedtime: "",
    duration: 60,
    activities: [] as string[],
    stressLevel: 0,
  })
  const [generatedPlan, setGeneratedPlan] = useState<WindDownPlan | null>(null)
  const [sleepRecord, setSleepRecord] = useState<SleepRecord>({
    date: new Date().toISOString().split("T")[0],
    bedtime: "",
    wakeTime: "",
    duration: "",
    quality: 0,
    factors: [],
    mood: "",
    notes: "",
  })
  const [fetchedPlaylists, setFetchedPlaylists] = useState<any[]>([])

  const windDownActivities = [
    { id: "meditation", label: "Meditation", icon: <Brain className="h-4 w-4" /> },
    { id: "reading", label: "Reading", icon: <Book className="h-4 w-4" /> },
    { id: "music", label: "Relaxing Music", icon: <Music className="h-4 w-4" /> },
    { id: "bath", label: "Warm Bath", icon: <Wind className="h-4 w-4" /> },
    { id: "stretching", label: "Gentle Stretching", icon: <Zap className="h-4 w-4" /> },
    { id: "journaling", label: "Journaling", icon: <Book className="h-4 w-4" /> },
  ]

  const stressLevels = [
    { value: 1, label: "Very Low", emoji: "😌" },
    { value: 2, label: "Low", emoji: "🙂" },
    { value: 3, label: "Moderate", emoji: "😐" },
    { value: 4, label: "High", emoji: "😰" },
    { value: 5, label: "Very High", emoji: "😫" },
  ]

  const sleepPlaylists = [
    {
      id: "1",
      title: "Deep Sleep Sounds",
      artist: "Nature Sounds",
      image: "/placeholder.svg?height=200&width=200",
      uri: "spotify:playlist:37i9dQZF1DWZd79rJ6a7lp",
      description: "Gentle rain and ocean waves for deep relaxation",
      duration: "2h 30m",
    },
    {
      id: "2",
      title: "Peaceful Piano",
      artist: "Classical Sleep",
      image: "/placeholder.svg?height=200&width=200",
      uri: "spotify:playlist:37i9dQZF1DX4sWSpwq3LiO",
      description: "Soft piano melodies to calm your mind",
      duration: "1h 45m",
    },
    {
      id: "3",
      title: "Meditation & Sleep",
      artist: "Mindfulness Collection",
      image: "/placeholder.svg?height=200&width=200",
      uri: "spotify:playlist:37i9dQZF1DWYcDQ1hSjOpY",
      description: "Guided meditations and ambient sounds",
      duration: "3h 15m",
    },
  ]

  const qualityOptions = [
    { value: 1, label: "Poor", emoji: "😴" },
    { value: 2, label: "Fair", emoji: "😐" },
    { value: 3, label: "Good", emoji: "🙂" },
    { value: 4, label: "Great", emoji: "😊" },
    { value: 5, label: "Excellent", emoji: "🌟" },
  ]

  const sleepFactors = [
    { id: "caffeine", label: "Caffeine", icon: <Coffee className="h-4 w-4" /> },
    { id: "screen", label: "Screen Time", icon: <Phone className="h-4 w-4" /> },
    { id: "exercise", label: "Exercise", icon: <Zap className="h-4 w-4" /> },
    { id: "stress", label: "Stress", icon: <Brain className="h-4 w-4" /> },
    { id: "reading", label: "Reading", icon: <Book className="h-4 w-4" /> },
    { id: "music", label: "Relaxing Music", icon: <Music className="h-4 w-4" /> },
  ]

  const moodOptions = [
    { value: "energized", label: "Energized", emoji: "⚡" },
    { value: "refreshed", label: "Refreshed", emoji: "✨" },
    { value: "tired", label: "Still Tired", emoji: "😴" },
    { value: "groggy", label: "Groggy", emoji: "🥱" },
  ]

  const handleActivityToggle = (activityId: string) => {
    setWindDownPreferences((prev) => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter((a) => a !== activityId)
        : [...prev.activities, activityId],
    }))
  }

  const generateWindDownPlan = async () => {
    const { bedtime, duration, activities, stressLevel } = windDownPreferences

    if (!bedtime || activities.length === 0) return

    const bedtimeDate = new Date(`2000-01-01 ${bedtime}`)
    const startTime = new Date(bedtimeDate.getTime() - duration * 60 * 1000)
    try {
      const response = await apiClient.post("/agent/wind_down", {
        input: "",
        context: {
          bedtime,
          duration,
          activities,
          stressLevel,
        },
      })

      const windDownData = response.wind_down
      const spotifyData = response.spotify

      function trimJson<T>(obj: T): T {
        if (Array.isArray(obj)) {
          return obj.map(trimJson) as unknown as T
        } else if (obj !== null && typeof obj === "object") {
          return Object.fromEntries(
            Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
              typeof key === "string" ? key.trim() : key,
              trimJson(value),
            ]),
          ) as T
        } else if (typeof obj === "string") {
          return obj.trim() as unknown as T
        } else {
          return obj
        }
      }

      const cleanedWindDownData = {
        totalDuration: windDownData.totalDuration,
        activities: windDownData.activities.map((activity) => trimJson(activity)),
      }

      // Clean and process Spotify playlists
      if (spotifyData && spotifyData.playlists) {
        const cleanedPlaylists = spotifyData.playlists.map((playlist: any) => {
          const cleaned = trimJson(playlist)
          return {
            id: cleaned.id || Math.random().toString(),
            title: cleaned.title || "Untitled Playlist",
            artist: cleaned.artist || "Various Artists",
            image: cleaned.image || "/placeholder.svg?height=200&width=200",
            uri: cleaned.uri || "",
            description: cleaned.description || "Relaxing music for sleep",
            duration: "2h 30m", // Default duration since it's not in the API response
          }
        })
        setFetchedPlaylists(cleanedPlaylists)
      }

      console.log(cleanedWindDownData)
      setGeneratedPlan(cleanedWindDownData)
      return
    } catch (error) {
      console.log(error)
    }

    // Fallback to original logic if API fails
    const activityDurations = {
      meditation: stressLevel >= 3 ? 15 : 10,
      reading: 20,
      music: 30,
      bath: 25,
      stretching: 10,
      journaling: 15,
    }

    const activityDescriptions = {
      meditation: "Practice deep breathing and mindfulness to calm your mind",
      reading: "Read something light and enjoyable to wind down",
      music: "Listen to calming music or nature sounds",
      bath: "Take a warm bath to relax your muscles and mind",
      stretching: "Gentle yoga or stretching to release tension",
      journaling: "Write down thoughts and gratitudes from your day",
    }

    const activityEmojis = {
      meditation: ["🧘", "🕯️", "🌸", "☯️", "🪷"][Math.floor(Math.random() * 5)],
      reading: ["📖", "📚", "📝", "📰", "🔖"][Math.floor(Math.random() * 5)],
      music: ["🎵", "🎶", "🎧", "🎼", "🎹"][Math.floor(Math.random() * 5)],
      bath: ["🛁", "🫧", "🚿", "💆", "🧴"][Math.floor(Math.random() * 5)],
      stretching: ["🤸", "🧘‍♀️", "💪", "🤲", "🙆"][Math.floor(Math.random() * 5)],
      journaling: ["✍️", "📔", "✨", "💭", "📓"][Math.floor(Math.random() * 5)],
    }

    let currentTime = new Date(startTime)
    const planActivities = activities.map((activity) => {
      const activityDuration = activityDurations[activity as keyof typeof activityDurations] || 15
      const timeString = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      const planActivity = {
        time: timeString,
        activity: windDownActivities.find((a) => a.id === activity)?.label || activity,
        duration: activityDuration,
        icon: <span className="text-lg">{activityEmojis[activity as keyof typeof activityEmojis]}</span>,
        description: activityDescriptions[activity as keyof typeof activityDescriptions] || "",
      }

      currentTime = new Date(currentTime.getTime() + activityDuration * 60 * 1000)
      return planActivity
    })

    // Add final "lights out" activity
    planActivities.push({
      time: bedtime,
      activity: "Lights Out",
      duration: 0,
      icon: <span className="text-lg">🌙</span>,
      description: "Turn off all lights and electronics for optimal sleep",
    })

    setGeneratedPlan({
      totalDuration: duration,
      activities: planActivities,
    })
  }

  const handleFactorToggle = (factorId: string) => {
    setSleepRecord((prev) => ({
      ...prev,
      factors: prev.factors.includes(factorId)
        ? prev.factors.filter((f) => f !== factorId)
        : [...prev.factors, factorId],
    }))
  }

  const calculateDuration = (bedtime: string, wakeTime: string) => {
    if (!bedtime || !wakeTime) return ""

    const bed = new Date(`2000-01-01 ${bedtime}`)
    let wake = new Date(`2000-01-01 ${wakeTime}`)

    if (wake < bed) {
      wake = new Date(`2000-01-02 ${wakeTime}`)
    }

    const diff = wake.getTime() - bed.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  const handleTimeChange = (field: "bedtime" | "wakeTime", value: string) => {
    const updated = { ...sleepRecord, [field]: value }
    updated.duration = calculateDuration(updated.bedtime, updated.wakeTime)
    setSleepRecord(updated)
  }

  const handleSleepSubmit = () => {
    console.log("Sleep record:", sleepRecord)
    setShowSleepForm(false)
  }

  const handlePlaylistSelect = (playlist: any) => {
    setSelectedPlaylist(playlist)
    setShowSpotifyPlayer(true)
  }

  const mockInsights = [
    {
      type: "positive",
      title: "Consistent Sleep Schedule",
      description:
        "You've maintained a regular bedtime for 5 days straight. This helps regulate your circadian rhythm.",
      icon: <Clock className="h-5 w-5 text-green-500" />,
    },
    {
      type: "suggestion",
      title: "Optimize Sleep Duration",
      description: "Your average sleep is 6.5 hours. Try extending to 7-8 hours for better recovery.",
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    },
    {
      type: "insight",
      title: "Screen Time Impact",
      description:
        "On nights with late screen time, your sleep quality drops by 23%. Consider a digital sunset routine.",
      icon: <Brain className="h-5 w-5 text-purple-500" />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-2xl blur-xl" />
          <Card className="relative border-2 border-transparent bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="relative">
                  <Moon className="h-8 w-8 text-purple-500" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Your Complete Sleep Companion
              </CardTitle>
              <CardDescription className="text-base">
                Plan your perfect wind-down routine and track your sleep journey with AI insights
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="winddown" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            Wind-Down Planner
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sleep Tracking
          </TabsTrigger>
        </TabsList>

        {/* Wind-Down Planner Tab */}
        <TabsContent value="winddown" className="space-y-6">
          {!generatedPlan ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Create Your Wind-Down Plan
                  </CardTitle>
                  <CardDescription>
                    Tell us about your preferences and we'll create a personalized bedtime routine
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bedtime */}
                  <div className="space-y-2">
                    <Label htmlFor="target-bedtime">What time do you want to go to bed?</Label>
                    <Input
                      id="target-bedtime"
                      type="time"
                      value={windDownPreferences.bedtime}
                      onChange={(e) => setWindDownPreferences((prev) => ({ ...prev, bedtime: e.target.value }))}
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-3">
                    <Label>How long should your wind-down routine be?</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[30, 60, 90].map((duration) => (
                        <button
                          key={duration}
                          type="button"
                          onClick={() => setWindDownPreferences((prev) => ({ ...prev, duration }))}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            windDownPreferences.duration === duration
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-medium">{duration} min</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stress Level */}
                  <div className="space-y-3">
                    <Label>How stressed do you feel today?</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {stressLevels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setWindDownPreferences((prev) => ({ ...prev, stressLevel: level.value }))}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            windDownPreferences.stressLevel === level.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-xl mb-1">{level.emoji}</div>
                          <div className="text-xs font-medium">{level.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="space-y-3">
                    <Label>What activities help you relax? (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {windDownActivities.map((activity) => (
                        <button
                          key={activity.id}
                          type="button"
                          onClick={() => handleActivityToggle(activity.id)}
                          className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                            windDownPreferences.activities.includes(activity.id)
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {activity.icon}
                          <span className="text-sm font-medium">{activity.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={generateWindDownPlan}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    disabled={!windDownPreferences.bedtime || windDownPreferences.activities.length === 0}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate My Wind-Down Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Generated Plan */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Timer className="h-5 w-5 text-purple-500" />
                        Your Personalized Wind-Down Plan
                      </CardTitle>
                      <CardDescription>
                        {generatedPlan.totalDuration} minutes until bedtime at {windDownPreferences.bedtime}
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
                      Create New Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedPlan.activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-purple-600">{activity.time}</span>
                            <span className="font-medium">{activity.activity}</span>
                            {activity.duration > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {activity.duration} min
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sleep Playlists */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-teal-500" />
                    Recommended Sleep Playlists
                  </CardTitle>
                  <CardDescription>Curated music to help you drift off peacefully</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(fetchedPlaylists.length > 0 ? fetchedPlaylists : sleepPlaylists).map((playlist) => (
                      <div
                        key={playlist.id}
                        className="group cursor-pointer h-full"
                        onClick={() => window.open(playlist.uri, "_blank")}
                      >
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors h-full flex flex-col">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={playlist.image || "/placeholder.svg"}
                                alt={playlist.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to icon if image fails to load
                                  e.currentTarget.style.display = "none"
                                  e.currentTarget.nextElementSibling.style.display = "flex"
                                }}
                              />
                              <div
                                className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center"
                                style={{ display: "none" }}
                              >
                                <Music className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 mb-1">
                                <h4 className="font-medium text-sm leading-tight line-clamp-2 flex-1">
                                  {playlist.title}
                                </h4>
                                <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-0.5 flex-shrink-0">
                                  Spotify
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{playlist.artist}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(playlist.uri, "_blank")
                              }}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                              {playlist.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto">
                            <span className="font-medium">{playlist.duration}</span>
                            <div className="flex items-center gap-1">
                              <Volume2 className="h-3 w-3" />
                              <span>Sleep</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Sleep Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          {showSleepForm ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Record Your Sleep
                  </CardTitle>
                  <CardDescription>Track your sleep to get personalized insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={sleepRecord.date}
                      onChange={(e) => setSleepRecord((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  {/* Sleep Times */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedtime">Bedtime</Label>
                      <Input
                        id="bedtime"
                        type="time"
                        value={sleepRecord.bedtime}
                        onChange={(e) => handleTimeChange("bedtime", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wakeTime">Wake Time</Label>
                      <Input
                        id="wakeTime"
                        type="time"
                        value={sleepRecord.wakeTime}
                        onChange={(e) => handleTimeChange("wakeTime", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center text-sm">
                        {sleepRecord.duration || "0h 0m"}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Sleep Quality */}
                  <div className="space-y-3">
                    <Label>How was your sleep quality?</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {qualityOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSleepRecord((prev) => ({ ...prev, quality: option.value }))}
                          className={`p-4 rounded-lg border-2 transition-all text-center ${
                            sleepRecord.quality === option.value
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.emoji}</div>
                          <div className="text-xs font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Sleep Factors */}
                  <div className="space-y-3">
                    <Label>What factors affected your sleep? (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {sleepFactors.map((factor) => (
                        <button
                          key={factor.id}
                          type="button"
                          onClick={() => handleFactorToggle(factor.id)}
                          className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                            sleepRecord.factors.includes(factor.id)
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {factor.icon}
                          <span className="text-sm font-medium">{factor.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Morning Mood */}
                  <div className="space-y-3">
                    <Label>How did you feel when you woke up?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {moodOptions.map((mood) => (
                        <button
                          key={mood.value}
                          type="button"
                          onClick={() => setSleepRecord((prev) => ({ ...prev, mood: mood.value }))}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            sleepRecord.mood === mood.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-xl mb-1">{mood.emoji}</div>
                          <div className="text-xs font-medium">{mood.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any dreams, disturbances, or other observations..."
                      value={sleepRecord.notes}
                      onChange={(e) => setSleepRecord((prev) => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowSleepForm(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSleepSubmit}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      disabled={!sleepRecord.bedtime || !sleepRecord.wakeTime || !sleepRecord.quality}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Record Sleep
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Sleep Insights</h2>
                  <p className="text-slate-500 dark:text-slate-400">AI-powered analysis of your sleep patterns</p>
                </div>
                <Button onClick={() => setShowSleepForm(true)} className="bg-gradient-to-r from-purple-500 to-blue-500">
                  <Moon className="h-4 w-4 mr-2" />
                  Record Sleep
                </Button>
              </div>

              {/* Recent Sleep Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Last Night's Sleep
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">7h 32m</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Duration</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">😊 Good</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Quality</div>
                    </div>
                    <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-teal-600">10:30 PM</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Bedtime</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">⚡ Energized</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Morning Mood</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    AI Sleep Insights
                  </CardTitle>
                  <CardDescription>Personalized recommendations based on your sleep patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="mt-1">{insight.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{insight.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{insight.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sleep History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Sleep Trends (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "Dec 28", duration: "7h 32m", quality: "Good", mood: "Energized" },
                      { date: "Dec 27", duration: "6h 45m", quality: "Fair", mood: "Tired" },
                      { date: "Dec 26", duration: "8h 15m", quality: "Excellent", mood: "Refreshed" },
                      { date: "Dec 25", duration: "7h 20m", quality: "Good", mood: "Energized" },
                      { date: "Dec 24", duration: "6h 30m", quality: "Poor", mood: "Groggy" },
                    ].map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="font-medium w-16">{record.date}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{record.duration}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {record.quality}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {record.mood}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Spotify Player Modal */}
      {showSpotifyPlayer && selectedPlaylist && (
        <SpotifyPlayer
          uri={selectedPlaylist.uri}
          title={selectedPlaylist.title}
          artist={selectedPlaylist.artist}
          image={selectedPlaylist.image}
          isOpen={showSpotifyPlayer}
          onClose={() => setShowSpotifyPlayer(false)}
        />
      )}
    </div>
  )
}
