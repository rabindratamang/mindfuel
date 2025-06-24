"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Mic,
  Send,
  Loader2,
  Smile,
  Camera,
  MapPin,
  Zap,
  Heart,
  Brain,
  Coffee,
  Moon,
  Sun,
  Cloud,
  Target,
  Lightbulb,
  Calendar,
  Clock,
  User,
  TrendingUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { apiClient } from "@/lib/api-client"

interface MoodAnalyzerProps {
  onMoodAnalyzed?: (mood: string, score: number, analysis: string, suggestions: string[], fullResponse?: any) => void
  onViewDetails?: (entry: any) => void
}

export function MoodAnalyzer({ onMoodAnalyzed, onViewDetails }: MoodAnalyzerProps) {
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [moodIntensity, setMoodIntensity] = useState([5])
  const [selectedMoodEmoji, setSelectedMoodEmoji] = useState<string | null>(null)
  const [selectedContext, setSelectedContext] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [showQuickMood, setShowQuickMood] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [result, setResult] = useState<null | {
    mood: string
    score: number
    analysis: string
    suggestions: string[]
    fullResponse?: any
  }>(null)
  const [usedSuggestion, setUsedSuggestion] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  const interactivePlaceholders = [
    "How are you feeling right now? Share what's on your mind...",
    "What emotions are you experiencing today?",
    "Tell me about your current state of mind...",
    "What's making you feel this way today?",
    "Describe your mood and what's influencing it...",
    "How would you rate your emotional well-being right now?",
    "What thoughts or feelings are dominating your mind?",
    "Share your inner dialogue - I'm here to listen...",
    "What's been weighing on your heart lately?",
    "How has your day been treating you emotionally?",
    "What would help you feel better right now?",
    "Describe the energy you're carrying today...",
  ]

  const moodEmojis = [
    { emoji: "😊", label: "Happy", color: "bg-yellow-100 text-yellow-800" },
    { emoji: "😢", label: "Sad", color: "bg-blue-100 text-blue-800" },
    { emoji: "😰", label: "Anxious", color: "bg-orange-100 text-orange-800" },
    { emoji: "😡", label: "Angry", color: "bg-red-100 text-red-800" },
    { emoji: "😴", label: "Tired", color: "bg-purple-100 text-purple-800" },
    { emoji: "🤗", label: "Grateful", color: "bg-green-100 text-green-800" },
    { emoji: "😕", label: "Confused", color: "bg-gray-100 text-gray-800" },
    { emoji: "🤩", label: "Excited", color: "bg-pink-100 text-pink-800" },
    { emoji: "😌", label: "Peaceful", color: "bg-teal-100 text-teal-800" },
    { emoji: "😤", label: "Frustrated", color: "bg-amber-100 text-amber-800" },
  ]

  const contextTags = [
    { icon: Coffee, label: "Work", color: "bg-brown-100 text-brown-800" },
    { icon: Heart, label: "Relationships", color: "bg-rose-100 text-rose-800" },
    { icon: Brain, label: "Mental Health", color: "bg-indigo-100 text-indigo-800" },
    { icon: Zap, label: "Energy", color: "bg-yellow-100 text-yellow-800" },
    { icon: Moon, label: "Sleep", color: "bg-purple-100 text-purple-800" },
    { icon: Sun, label: "Morning", color: "bg-orange-100 text-orange-800" },
    { icon: Cloud, label: "Weather", color: "bg-sky-100 text-sky-800" },
    { icon: MapPin, label: "Location", color: "bg-emerald-100 text-emerald-800" },
  ]

  const getTimeBasedPrompt = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "How are you starting your morning?"
    if (hour < 17) return "How is your afternoon treating you?"
    if (hour < 21) return "How are you feeling this evening?"
    return "How are you winding down tonight?"
  }

  const getTimeBasedSuggestions = () => {
    const hour = currentTime.getHours()
    if (hour < 12)
      return [
        "I woke up feeling...",
        "This morning I'm...",
        "My energy level is...",
        "I'm looking forward to...",
        "I'm concerned about today because...",
      ]
    if (hour < 17)
      return [
        "So far today has been...",
        "I'm feeling productive because...",
        "I'm struggling with...",
        "My afternoon mood is...",
        "I need to focus on...",
      ]
    if (hour < 21)
      return [
        "This evening I feel...",
        "Today was challenging because...",
        "I'm proud that I...",
        "I'm looking forward to...",
        "I need to unwind from...",
      ]
    return [
      "As I reflect on today...",
      "Tonight I'm feeling...",
      "I'm grateful for...",
      "Tomorrow I want to...",
      "I need to let go of...",
    ]
  }

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Rotate placeholders every 3 seconds when not focused
  useEffect(() => {
    if (!isFocused && !input) {
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % interactivePlaceholders.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isFocused, input, interactivePlaceholders.length])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("")

        setInput(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleQuickMood = (emoji: string, label: string) => {
    setSelectedMoodEmoji(emoji)
    setInput(`I'm feeling ${label.toLowerCase()} ${emoji}. `)
    setShowQuickMood(false)
  }

  const toggleContext = (context: string) => {
    setSelectedContext((prev) => (prev.includes(context) ? prev.filter((c) => c !== context) : [...prev, context]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsAnalyzing(true)

    try {
      const response = await apiClient.post("agent/mood_analyzer", {
        input: input.trim(),
        context: {
          suggestion_used: usedSuggestion,
          mood_intensity: moodIntensity[0],
          selected_emoji: selectedMoodEmoji,
          context_tags: selectedContext,
          time_of_day: currentTime.getHours(),
          timestamp: currentTime.toISOString(),
        }
      })

      const moodResult = {
        mood: response.analysis.primaryMood,
        score: response.analysis.confidence,
        analysis: response.insights.summary,
        suggestions: response.recommendations.immediate || [],
        fullResponse: response,
      }

      setResult(moodResult)

      if (onMoodAnalyzed) {
        onMoodAnalyzed(
          response.analysis.primaryMood,
          response.analysis.confidence,
          response.insights.summary,
          response.recommendations.immediate || [],
          response, // Pass the full response
        )
      }
    } catch (error) {
      console.error("Mood analysis failed:", error)
      setResult({
        mood: "Error",
        score: 0,
        analysis: "Sorry, we couldn't analyze your mood right now. Please try again later.",
        suggestions: [
          "Check your internet connection",
          "Try refreshing the page",
          "Contact support if the issue persists",
        ],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNewAnalysis = () => {
    setResult(null)
    setInput("")
    setUsedSuggestion(null)
    setSelectedMoodEmoji(null)
    setSelectedContext([])
    setMoodIntensity([5])
    if (onMoodAnalyzed) {
      onMoodAnalyzed("", 0, "", [], null)
    }
  }

  const handleViewDetails = () => {
    if (result?.fullResponse && onViewDetails) {
      onViewDetails(result.fullResponse)
    }
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Quick Mood Selection - More Compact */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Smile className="h-3 w-3 text-slate-600" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Quick mood:</span>
                </div>
                <div className="flex gap-1">
                  {moodEmojis.slice(0, 6).map((mood) => (
                    <motion.button
                      key={mood.label}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuickMood(mood.emoji, mood.label)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm transition-all ${
                        selectedMoodEmoji === mood.emoji
                          ? "bg-teal-100 dark:bg-teal-900/50 ring-1 ring-teal-500"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                      title={mood.label}
                    >
                      {mood.emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Text Input - Cleaner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative"
              >
                <motion.div
                  animate={{
                    scale: isFocused ? 1.01 : 1,
                    boxShadow: isFocused ? "0 0 0 2px rgba(20, 184, 166, 0.1)" : "none",
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Textarea
                    placeholder={interactivePlaceholders[placeholderIndex]}
                    className={`min-h-[120px] max-h-[300px] resize-y transition-all duration-300 border-slate-200 dark:border-slate-700 text-sm leading-relaxed ${
                      isFocused ? "border-teal-400 bg-teal-50/30 dark:bg-teal-950/20" : "hover:border-slate-300"
                    }`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      setTimeout(() => setIsFocused(false), 150)
                    }}
                  />

                  {/* Input Progress Indicator */}
                  <motion.div
                    className="absolute bottom-8 left-2 right-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: input ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">
                        {input.length < 20
                          ? "Getting started..."
                          : input.length < 50
                            ? "Good detail"
                            : input.length < 100
                              ? "Great detail!"
                              : "Excellent detail! 🎯"}
                      </span>
                      <span className="text-xs text-slate-400">{input.length}/200+</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                      <motion.div
                        className={`h-1 rounded-full transition-all duration-300 ${
                          input.length < 20
                            ? "bg-red-400"
                            : input.length < 50
                              ? "bg-yellow-400"
                              : input.length < 100
                                ? "bg-blue-400"
                                : "bg-gradient-to-r from-teal-400 to-green-400"
                        }`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((input.length / 200) * 100, 100)}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>

                  {/* Minimal character count - moved up to avoid overlap */}
                  <motion.div
                    className="absolute bottom-12 right-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: input && input.length > 150 ? 0.6 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-xs text-slate-400">{input.length}</span>
                  </motion.div>
                </motion.div>

                {/* Time-based suggestions - Cleaner */}
                {isFocused && !input && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-3 z-10"
                  >
                    <div className="text-xs text-slate-500 mb-2">Try starting with:</div>
                    <div className="flex flex-wrap gap-1">
                      {getTimeBasedSuggestions()
                        .slice(0, 4)
                        .map((suggestion, index) => (
                          <motion.button
                            key={suggestion}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setInput(suggestion + " ")
                              setUsedSuggestion(suggestion)
                              setIsFocused(false)
                            }}
                            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Collapsible Advanced Options */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <details className="group">
                  <summary className="flex items-center justify-between p-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                    <span>Advanced options</span>
                    <motion.div animate={{ rotate: 0 }} className="group-open:rotate-180 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </summary>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="space-y-3 pt-3"
                  >
                    {/* Intensity Slider - Minimal */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 dark:text-slate-400 w-16">Intensity:</span>
                      <Slider
                        value={moodIntensity}
                        onValueChange={setMoodIntensity}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 w-8">{moodIntensity[0]}/10</span>
                    </div>

                    {/* Context Tags - Minimal */}
                    <div className="space-y-2">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Context:</span>
                      <div className="flex flex-wrap gap-1">
                        {contextTags.map((tag) => (
                          <motion.button
                            key={tag.label}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleContext(tag.label)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                              selectedContext.includes(tag.label)
                                ? "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                            }`}
                          >
                            <tag.icon className="h-3 w-3" />
                            {tag.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </details>
              </motion.div>

              {/* Action Buttons - Simplified */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5"
                    onClick={handleVoiceInput}
                    disabled={!recognitionRef.current}
                  >
                    <Mic className={`h-4 w-4 ${isListening ? "text-red-500" : ""}`} />
                    {isListening ? "Stop" : "Voice"}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="gap-1.5">
                    <Camera className="h-4 w-4" />
                    Photo
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-teal-500 to-sky-500 gap-2"
                  disabled={!input.trim() || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>

              {/* Minimal Context Summary */}
              <AnimatePresence>
                {(selectedContext.length > 0 || selectedMoodEmoji || moodIntensity[0] !== 5) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-xs text-slate-500 pt-1"
                  >
                    <span>Context:</span>
                    {selectedMoodEmoji && <span>{selectedMoodEmoji}</span>}
                    {moodIntensity[0] !== 5 && <span>{moodIntensity[0]}/10</span>}
                    {selectedContext.slice(0, 3).map((context) => (
                      <Badge key={context} variant="secondary" className="text-xs py-0">
                        {context}
                      </Badge>
                    ))}
                    {selectedContext.length > 3 && <span>+{selectedContext.length - 3} more</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Minimal Results Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Mood Analysis</h2>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    result.fullResponse?.analysis?.moodCategory === "positive"
                      ? "border-green-500 text-green-700 bg-green-50"
                      : result.fullResponse?.analysis?.moodCategory === "negative"
                        ? "border-red-500 text-red-700 bg-red-50"
                        : "border-yellow-500 text-yellow-700 bg-yellow-50"
                  }`}
                >
                  {result.mood} ({result.score}% confidence)
                </Badge>
              </div>

              {/* Compact metadata */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date().toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {result.fullResponse?.metadata?.timeOfDay || "morning"}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {result.fullResponse?.metadata?.wordCount || input.split(" ").length} words
                </div>
              </div>
            </div>

            {/* Compact Insights Grid */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{result.score}%</div>
                <div className="text-xs text-slate-600">Confidence</div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {result.fullResponse?.analysis?.intensity || moodIntensity[0]}/10
                </div>
                <div className="text-xs text-slate-600">Intensity</div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {result.fullResponse?.insights?.keyThemes?.length || 0}
                </div>
                <div className="text-xs text-slate-600">Key Themes</div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-lg font-bold text-orange-600 capitalize">
                  {result.fullResponse?.riskAssessment?.level || "Low"}
                </div>
                <div className="text-xs text-slate-600">Risk Level</div>
              </div>
            </div>

            {/* Two-column layout for AI Analysis and Immediate Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Minimal AI Summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span className="font-medium text-sm">AI Analysis Summary</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-6">{result.analysis}</p>
              </div>

              {/* Complete Immediate Suggestions */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="font-medium text-sm">Immediate Suggestions</span>
                </div>
                <ul className="space-y-1 pl-6">
                  {result.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-xs">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Two-column layout for Emotional Profile and Key Themes */}
            {(result.fullResponse?.analysis?.emotions || result.fullResponse?.insights?.keyThemes) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Compact Emotional Profile */}
                {result.fullResponse?.analysis?.emotions && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium text-sm">Emotional Profile</span>
                    </div>
                    <div className="space-y-2 pl-6">
                      {result.fullResponse.analysis.emotions.slice(0, 3).map((emotion: any, index: number) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium">{emotion.emotion}</span>
                            <span className="text-slate-500">{emotion.score}%</span>
                          </div>
                          <Progress value={emotion.score} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Minimal Key Themes */}
                {result.fullResponse?.insights?.keyThemes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      <span className="font-medium text-sm">Key Themes</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pl-6">
                      {result.fullResponse.insights.keyThemes.slice(0, 4).map((theme: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs py-0 px-2">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Minimal Content Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs">
                  ✨ Personalized content recommendations are being prepared based on your mood analysis!
                </span>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="flex gap-2 pt-2">
              {onViewDetails && (
                <Button onClick={handleViewDetails} className="flex-1 h-9 text-sm">
                  View Full Details
                </Button>
              )}
              <Button onClick={handleNewAnalysis} variant="outline" className="h-9 text-sm px-4">
                New Analysis
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
