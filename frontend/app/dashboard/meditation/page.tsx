"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Pause,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Brain,
  Video,
  Headphones,
  Download,
  Star,
  User,
} from "lucide-react"
import { motion } from "framer-motion"
import { YouTubePlayer } from "@/components/youtube-player"
import { SpotifyPlayer } from "@/components/spotify-player"
import { apiClient } from "@/lib/api-client"

interface AIGeneratedMeditation {
  id: string
  title: string
  description: string
  steps: Array<{
    step: number
    instruction: string
    duration: number
    type: "breathing" | "visualization" | "body_scan" | "mindfulness"
  }>
  totalDuration: number
  category: string
  moodBased: boolean
  difficulty: "beginner" | "intermediate" | "advanced"
  generatedAt: string
}

interface YouTubeMeditation {
  id: string
  title: string
  description: string
  videoId: string
  channelName: string
  channelAvatar?: string
  thumbnail: string
  duration: number
  category: string
  rating: number
  viewCount: string
}

interface SpotifyMeditation {
  id: string
  title: string
  description: string
  uri: string
  artist: string
  image: string
  duration: number
  category: string
  rating: number
  trackCount?: number
}

interface AudioMeditation {
  id: string
  title: string
  description: string
  audioUrl: string
  duration: number
  category: string
  instructor: string
  backgroundMusic?: string
  downloadable: boolean
  fileSize?: string
  quality: "standard" | "high" | "premium"
}

type MeditationType = "ai" | "youtube" | "spotify" | "audio"

interface MeditationSession {
  type: MeditationType
  data: AIGeneratedMeditation | YouTubeMeditation | SpotifyMeditation | AudioMeditation
}

export default function MeditationPage() {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(600)
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)

  // Session state
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [previousStep, setPreviousStep] = useState(-1)

  // Content state
  const [aiMeditations, setAiMeditations] = useState<AIGeneratedMeditation[]>([])
  const [youtubeMeditations, setYoutubeMeditations] = useState<YouTubeMeditation[]>([])
  const [spotifyMeditations, setSpotifyMeditations] = useState<SpotifyMeditation[]>([])
  const [audioMeditations, setAudioMeditations] = useState<AudioMeditation[]>([])

  // UI state
  const [showBreathingGuide, setShowBreathingGuide] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingCount, setBreathingCount] = useState(0)
  const [customDuration, setCustomDuration] = useState([10])
  const [backgroundSound, setBackgroundSound] = useState("none")
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedYouTubeVideo, setSelectedYouTubeVideo] = useState<{ videoId: string; title: string } | null>(null)
  const [selectedSpotifyTrack, setSelectedSpotifyTrack] = useState<SpotifyMeditation | null>(null)

  // Survey state
  const [showSurvey, setShowSurvey] = useState(true)
  const [surveyCompleted, setSurveyCompleted] = useState(false)
  const [userPreferences, setUserPreferences] = useState<{
    duration: string
    goals: string[]
  }>({
    duration: "",
    goals: [],
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null)
  const stepNotificationRef = useRef<HTMLAudioElement | null>(null)

  // Load meditation content on component mount
  useEffect(() => {
    loadMeditationContent()
    // Initialize audio elements
    if (typeof window !== "undefined") {
      stepNotificationRef.current = new Audio("/sounds/step-notification.mp3")
      stepNotificationRef.current.volume = 0.3
    }
  }, [])

  // Play notification sound when step changes
  useEffect(() => {
    if (currentStep !== previousStep && previousStep !== -1 && stepNotificationRef.current) {
      stepNotificationRef.current.play().catch(console.error)
    }
    setPreviousStep(currentStep)
  }, [currentStep, previousStep])

  // Background sound management
  useEffect(() => {
    if (backgroundSound !== "none" && typeof window !== "undefined") {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause()
      }

      backgroundAudioRef.current = new Audio(`/sounds/${backgroundSound}.mp3`)
      backgroundAudioRef.current.loop = true
      backgroundAudioRef.current.volume = 0.3

      if (isPlaying) {
        backgroundAudioRef.current.play().catch(console.error)
      }
    } else if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause()
    }

    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause()
      }
    }
  }, [backgroundSound])

  // Control background sound with play/pause
  useEffect(() => {
    if (backgroundAudioRef.current) {
      if (isPlaying && backgroundSound !== "none") {
        backgroundAudioRef.current.play().catch(console.error)
      } else {
        backgroundAudioRef.current.pause()
      }
    }
  }, [isPlaying, backgroundSound])

  // Timer functionality
  useEffect(() => {
    if (isPlaying && currentTime < duration) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration - 1) {
            setIsPlaying(false)
            handleSessionComplete()
            return duration
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentTime, duration])

  // AI meditation step progression
  useEffect(() => {
    if (selectedSession?.type === "ai" && isPlaying) {
      const aiData = selectedSession.data as AIGeneratedMeditation
      let stepTime = 0

      for (let i = 0; i < aiData.steps.length; i++) {
        if (currentTime >= stepTime && currentTime < stepTime + aiData.steps[i].duration) {
          setCurrentStep(i)
          break
        }
        stepTime += aiData.steps[i].duration
      }
    }
  }, [currentTime, selectedSession, isPlaying])

  const loadMeditationContent = async () => {
    setLoading(true)
    try {
      // Load AI generated meditations
      const aiResponse = await apiClient.get<AIGeneratedMeditation[]>("/meditation/ai-generated")
      setAiMeditations(aiResponse)

      // Load YouTube meditations
      const youtubeResponse = await apiClient.get<YouTubeMeditation[]>("/meditation/youtube")
      setYoutubeMeditations(youtubeResponse)

      // Load Spotify meditations
      const spotifyResponse = await apiClient.get<SpotifyMeditation[]>("/meditation/spotify")
      setSpotifyMeditations(spotifyResponse)

      // Load audio meditations
      const audioResponse = await apiClient.get<AudioMeditation[]>("/meditation/audio")
      setAudioMeditations(audioResponse)
    } catch (error) {
      console.error("Failed to load meditation content:", error)
      // Load mock data as fallback
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    // Mock AI generated meditations
    setAiMeditations([
      {
        id: "ai-1",
        title: "Anxiety Relief Session",
        description: "AI-generated meditation based on your current mood and stress levels",
        steps: [
          {
            step: 1,
            instruction: "Find a comfortable position and close your eyes",
            duration: 30,
            type: "mindfulness",
          },
          { step: 2, instruction: "Take 5 deep breaths, inhaling for 4 counts", duration: 60, type: "breathing" },
          {
            step: 3,
            instruction: "Visualize a peaceful place where you feel safe",
            duration: 120,
            type: "visualization",
          },
          {
            step: 4,
            instruction: "Scan your body from head to toe, releasing tension",
            duration: 180,
            type: "body_scan",
          },
          {
            step: 5,
            instruction: "Return to natural breathing and slowly open your eyes",
            duration: 30,
            type: "mindfulness",
          },
        ],
        totalDuration: 420,
        category: "anxiety",
        moodBased: true,
        difficulty: "beginner",
        generatedAt: new Date().toISOString(),
      },
    ])

    // Mock YouTube meditations
    setYoutubeMeditations([
      {
        id: "yt-1",
        title: "10 Minute Guided Meditation for Anxiety",
        description: "A calming meditation to help reduce anxiety and stress",
        videoId: "inpok4MKVLM",
        channelName: "Headspace",
        thumbnail: "https://img.youtube.com/vi/inpok4MKVLM/maxresdefault.jpg",
        duration: 600,
        category: "anxiety",
        rating: 4.8,
        viewCount: "2.1M",
      },
    ])

    // Mock Spotify meditations
    setSpotifyMeditations([
      {
        id: "sp-1",
        title: "Deep Sleep Meditation",
        description: "Relaxing sounds and guided meditation for better sleep",
        uri: "spotify:playlist:37i9dQZF1DWZqd5JICZI0u",
        artist: "Calm",
        image: "/placeholder.svg?height=300&width=300",
        duration: 1800,
        category: "sleep",
        rating: 4.6,
        trackCount: 12,
      },
    ])

    // Mock audio meditations
    setAudioMeditations([
      {
        id: "audio-1",
        title: "Mindfulness Body Scan",
        description: "A comprehensive body scan meditation with nature sounds",
        audioUrl: "/audio/body-scan-meditation.mp3",
        duration: 900,
        category: "mindfulness",
        instructor: "Sarah Johnson",
        backgroundMusic: "forest",
        downloadable: true,
        fileSize: "12.5 MB",
        quality: "high",
      },
    ])
  }

  const generateAIMeditation = async (mood?: string) => {
    setLoading(true)
    try {
      const response = await apiClient.post<AIGeneratedMeditation>("/meditation/generate-ai", {
        mood,
        duration: customDuration[0] * 60,
        userPreferences: {
          backgroundSound,
          difficulty: "beginner",
        },
      })

      setAiMeditations((prev) => [response, ...prev])
      handleSessionSelect({ type: "ai", data: response })
    } catch (error) {
      console.error("Failed to generate AI meditation:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSessionSelect = (session: MeditationSession) => {
    setSelectedSession(session)
    setDuration(session.data.duration || session.data.totalDuration)
    setCurrentTime(0)
    setCurrentStep(0)
    setPreviousStep(-1)
    setIsPlaying(false)
    setShowPlayer(true)

    // Setup audio for audio meditations
    if (session.type === "audio") {
      const audioData = session.data as AudioMeditation
      if (audioRef.current) {
        audioRef.current.src = audioData.audioUrl
      }
    }
  }

  const handlePlayPause = () => {
    if (selectedSession?.type === "audio" && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    setCurrentStep(0)
    setPreviousStep(-1)
    if (selectedSession?.type === "audio" && audioRef.current) {
      audioRef.current.currentTime = 0
    }
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause()
    }
  }

  const handleSessionComplete = () => {
    // Handle session completion logic
    console.log("Session completed!")
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (currentTime / duration) * 100

  const getCurrentInstruction = () => {
    if (selectedSession?.type === "ai") {
      const aiData = selectedSession.data as AIGeneratedMeditation
      return aiData.steps[currentStep]?.instruction || ""
    }
    return ""
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meditation</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Personalized meditation sessions powered by AI, curated content, and premium audio
        </p>
      </div>

      {showSurvey && !surveyCompleted && (
        <Card className="border-2 border-gradient-to-r from-purple-200 via-blue-200 to-teal-200 dark:from-purple-800 dark:via-blue-800 dark:to-teal-800 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-teal-50/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-teal-900/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <div className="relative">
                <Brain className="w-8 h-8 text-purple-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent font-bold">
                Let's Create Your Perfect MindFuel Experience
              </span>
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Our AI will generate personalized meditation content based on your preferences
            </p>

            {/* Mood Analysis Info */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 via-purple-100 to-teal-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-teal-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800 dark:text-blue-200">Smart Mood Integration</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                Your meditation will be intelligently crafted using your latest mood analysis report, ensuring each
                session perfectly matches your emotional state and mental needs.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-16 px-8 pb-8">
            {/* Duration Selection */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-center text-slate-700 dark:text-slate-300">
                How long would you like to meditate today?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  {
                    key: "5",
                    label: "5 minutes",
                    desc: "Quick session",
                    icon: "⚡",
                  },
                  {
                    key: "10",
                    label: "10 minutes",
                    desc: "Standard length",
                    icon: "🎯",
                  },
                  {
                    key: "20",
                    label: "20 minutes",
                    desc: "Deep practice",
                    icon: "🧘",
                  },
                  {
                    key: "30",
                    label: "30+ minutes",
                    desc: "Extended session",
                    icon: "🌟",
                  },
                ].map(({ key, label, desc, icon }) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer p-6 rounded-2xl border transition-all duration-200 ${
                      userPreferences.duration === key
                        ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-500 shadow-lg shadow-purple-200 dark:shadow-purple-900/50"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                    }`}
                    onClick={() => setUserPreferences((prev) => ({ ...prev, duration: key }))}
                  >
                    <div className="text-center space-y-3">
                      <div className="text-3xl">{icon}</div>
                      <div>
                        <div
                          className={`font-semibold text-lg ${
                            userPreferences.duration === key ? "text-white" : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {label}
                        </div>
                        <div
                          className={`text-sm ${
                            userPreferences.duration === key ? "text-purple-100" : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {desc}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Goals Selection */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-center text-slate-700 dark:text-slate-300">
                What's your main focus for today's session?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  {
                    key: "stress",
                    label: "Reduce Stress",
                    emoji: "🏆",
                  },
                  {
                    key: "focus",
                    label: "Improve Focus",
                    emoji: "🎯",
                  },
                  {
                    key: "sleep",
                    label: "Better Sleep",
                    emoji: "🌙",
                  },
                  {
                    key: "anxiety",
                    label: "Manage Anxiety",
                    emoji: "🛡️",
                  },
                ].map(({ key, label, emoji }) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer p-6 rounded-2xl border transition-all duration-200 ${
                      userPreferences.goals.includes(key)
                        ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white border-teal-500 shadow-lg shadow-teal-200 dark:shadow-teal-900/50"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                    }`}
                    onClick={() => {
                      const newGoals = userPreferences.goals.includes(key)
                        ? userPreferences.goals.filter((g) => g !== key)
                        : [...userPreferences.goals, key]
                      setUserPreferences((prev) => ({ ...prev, goals: newGoals }))
                    }}
                  >
                    <div className="text-center space-y-3">
                      <div className="text-3xl">{emoji}</div>
                      <div
                        className={`font-semibold ${
                          userPreferences.goals.includes(key) ? "text-white" : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <Button
                onClick={async () => {
                  setSurveyCompleted(true)
                  setShowSurvey(false)
                  setLoading(true)

                  // Generate AI content based on simplified survey data
                  try {
                    const response = await apiClient.post("/agent/meditation", {
                      context: {
                        ...userPreferences,
                        time_of_day: new Date().getHours(),
                        timestamp: new Date().toISOString(),
                      },
                    })

                    // Set the generated content
                    setAiMeditations(response.meditations || [])
                    setYoutubeMeditations(response.youtubeContent || [])
                    setSpotifyMeditations(response.spotifyContent || [])
                    setAudioMeditations(response.audioContent || [])
                  } catch (error) {
                    console.error("Failed to generate content:", error)
                    loadMockData()
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={!userPreferences.duration}
                className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Brain className="w-5 h-5 mr-3 animate-spin" />
                    Crafting Your MindFuel Session...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Start My MindFuel Journey
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {surveyCompleted && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Your Personalized Meditation Content</h2>
            <p className="text-slate-500 dark:text-slate-400">
              AI-generated content tailored to your preferences and current mood
            </p>
          </div>

          <Tabs defaultValue="recommended" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommended" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Recommended
              </TabsTrigger>
              <TabsTrigger value="guided" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Guided
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video Sessions
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                Audio Only
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recommended for You</h3>
                  <Button onClick={() => generateAIMeditation()} disabled={loading}>
                    <Brain className="w-4 h-4 mr-2" />
                    {loading ? "Generating..." : "Generate More"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiMeditations.slice(0, 3).map((meditation) => (
                    <AIMeditationCard
                      key={meditation.id}
                      meditation={meditation}
                      onPlay={() => handleSessionSelect({ type: "ai", data: meditation })}
                    />
                  ))}
                  {youtubeMeditations.slice(0, 2).map((meditation) => (
                    <YouTubeMeditationCard
                      key={meditation.id}
                      meditation={meditation}
                      onPlay={() => setSelectedYouTubeVideo({ videoId: meditation.videoId, title: meditation.title })}
                    />
                  ))}
                  {audioMeditations.slice(0, 1).map((meditation) => (
                    <AudioMeditationCard
                      key={meditation.id}
                      meditation={meditation}
                      onPlay={() => handleSessionSelect({ type: "audio", data: meditation })}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guided" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">AI Guided Meditations</h3>
                  <Button onClick={() => generateAIMeditation()} disabled={loading}>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate New Session
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiMeditations.map((meditation) => (
                    <AIMeditationCard
                      key={meditation.id}
                      meditation={meditation}
                      onPlay={() => handleSessionSelect({ type: "ai", data: meditation })}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">AI-Curated Video Sessions</h3>
                  <p className="text-sm text-slate-500">Videos selected based on your preferences</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {youtubeMeditations.map((meditation) => (
                    <YouTubeMeditationCard
                      key={meditation.id}
                      meditation={meditation}
                      onPlay={() => setSelectedYouTubeVideo({ videoId: meditation.videoId, title: meditation.title })}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audio" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Premium Audio Sessions</h3>
                  <p className="text-sm text-slate-500">High-quality audio content</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {audioMeditations.map((meditation) => (
                    <AudioMeditationCard
                      key={meditation.id}
                      meditation={meditation}
                      onPlay={() => handleSessionSelect({ type: "audio", data: meditation })}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Meditation Player Modal */}
      <Dialog open={showPlayer} onOpenChange={setShowPlayer}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSession?.type === "ai" && <Brain className="w-5 h-5 text-purple-500" />}
              {selectedSession?.type === "audio" && <Headphones className="w-5 h-5 text-emerald-500" />}
              {selectedSession?.data.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Progress Circle */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-slate-200 dark:text-slate-700"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-sky-500"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress / 100 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      strokeDasharray: "283",
                      strokeDashoffset: `${283 - (283 * progress) / 100}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{formatTime(Math.max(0, duration - currentTime))}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">remaining</div>
                </div>
              </div>
            </div>

            {/* AI Meditation Current Instruction */}
            {selectedSession?.type === "ai" && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                  Step {currentStep + 1} of {(selectedSession.data as AIGeneratedMeditation).steps.length}
                </div>
                <div className="font-medium">{getCurrentInstruction()}</div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={handleReset} disabled={currentTime === 0}>
                <RotateCcw className="h-4 w-4" />
              </Button>

              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  size="lg"
                  onClick={handlePlayPause}
                  className="rounded-full w-16 h-16 bg-sky-500 hover:bg-sky-600 text-white"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white fill-white" />
                  )}
                </Button>
              </motion.div>

              <Button variant="outline" size="icon" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Volume</span>
                <span>{volume[0]}%</span>
              </div>
              <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-full" />
            </div>

            {/* Background Sounds */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Sound</label>
              <Select value={backgroundSound} onValueChange={setBackgroundSound}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="rain">Rain</SelectItem>
                  <SelectItem value="ocean">Ocean Waves</SelectItem>
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="white-noise">White Noise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audio element for audio meditations */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
        muted={isMuted}
        volume={volume[0] / 100}
      />

      {/* YouTube Player */}
      {selectedYouTubeVideo && (
        <YouTubePlayer
          videoId={selectedYouTubeVideo.videoId}
          title={selectedYouTubeVideo.title}
          isOpen={!!selectedYouTubeVideo}
          onClose={() => setSelectedYouTubeVideo(null)}
        />
      )}

      {/* Spotify Player */}
      {selectedSpotifyTrack && (
        <SpotifyPlayer
          uri={selectedSpotifyTrack.uri}
          title={selectedSpotifyTrack.title}
          artist={selectedSpotifyTrack.artist}
          image={selectedSpotifyTrack.image}
          isOpen={!!selectedSpotifyTrack}
          onClose={() => setSelectedSpotifyTrack(null)}
        />
      )}

      {/* Breathing Guide Modal */}
      <Dialog open={showBreathingGuide} onOpenChange={setShowBreathingGuide}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Breathing Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center"
                animate={{
                  scale: breathingPhase === "inhale" ? 1.2 : breathingPhase === "hold" ? 1.2 : 0.8,
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
              >
                <motion.div
                  className="text-white font-medium text-lg"
                  key={breathingPhase}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {breathingPhase === "inhale" ? "Breathe In" : breathingPhase === "hold" ? "Hold" : "Breathe Out"}
                </motion.div>
              </motion.div>
            </div>

            <div>
              <div className="text-2xl font-bold">{breathingCount}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">breathing cycles</div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setShowBreathingGuide(false)
                setBreathingCount(0)
              }}
            >
              Stop Exercise
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meditation Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Session Duration</label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={customDuration}
                  onValueChange={setCustomDuration}
                  max={60}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16">{customDuration[0]} min</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Background Sound</label>
              <Select value={backgroundSound} onValueChange={setBackgroundSound}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="rain">Rain</SelectItem>
                  <SelectItem value="ocean">Ocean Waves</SelectItem>
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="white-noise">White Noise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setShowSettings(false)} className="w-full">
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AIMeditationCard({
  meditation,
  onPlay,
}: {
  meditation: AIGeneratedMeditation
  onPlay: () => void
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
      <Card className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden border-purple-200 dark:border-purple-800">
        <CardContent className="p-0">
          <div className="aspect-video relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-white/90 dark:bg-slate-900/90 text-purple-500 rounded-full p-4 shadow-lg"
            >
              <Brain className="w-8 h-8" />
            </motion.div>

            {meditation.moodBased && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-purple-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Mood-Based
                </Badge>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1">{meditation.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{meditation.description}</p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{Math.floor(meditation.totalDuration / 60)} min</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {meditation.steps.length} steps
              </Badge>
            </div>
            <Button onClick={onPlay} className="w-full bg-purple-500 hover:bg-purple-600">
              <Play className="w-4 h-4 mr-2" />
              Start AI Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function YouTubeMeditationCard({
  meditation,
  onPlay,
}: {
  meditation: YouTubeMeditation
  onPlay: () => void
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
      <Card className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden border-red-200 dark:border-red-800">
        <CardContent className="p-0">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={meditation.thumbnail || "/placeholder.svg"}
              alt={meditation.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white">
                <Video className="w-3 h-3 mr-1" />
                YouTube
              </Badge>
            </div>

            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {formatTime(meditation.duration)}
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-red-600 text-white rounded-full p-3 shadow-lg">
                <Play className="w-6 h-6 fill-current" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1 line-clamp-2">{meditation.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              {meditation.channelAvatar && (
                <img
                  src={meditation.channelAvatar || "/placeholder.svg"}
                  alt={meditation.channelName}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="text-sm text-slate-600 dark:text-slate-400">{meditation.channelName}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                {meditation.rating}
              </div>
              <span className="text-xs text-slate-500">{meditation.viewCount} views</span>
            </div>
            <Button onClick={onPlay} className="w-full bg-red-500 hover:bg-red-600">
              <Play className="w-4 h-4 mr-2" />
              Watch Video
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function AudioMeditationCard({
  meditation,
  onPlay,
}: {
  meditation: AudioMeditation
  onPlay: () => void
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
      <Card className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-0">
          <div className="aspect-video relative bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-white/90 dark:bg-slate-900/90 text-emerald-500 rounded-full p-4 shadow-lg"
            >
              <Headphones className="w-8 h-8" />
            </motion.div>

            <div className="absolute top-3 left-3">
              <Badge className="bg-emerald-500 text-white">
                <Headphones className="w-3 h-3 mr-1" />
                Premium Audio
              </Badge>
            </div>

            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-white/90 text-emerald-600">
                {meditation.quality.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1">{meditation.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">{meditation.instructor}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{meditation.description}</p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{formatTime(meditation.duration)}</span>
              </div>
              {meditation.downloadable && (
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <Download className="w-3 h-3" />
                  {meditation.fileSize}
                </div>
              )}
            </div>
            <Button onClick={onPlay} className="w-full bg-emerald-500 hover:bg-emerald-600">
              <Play className="w-4 h-4 mr-2" />
              Play Audio
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
