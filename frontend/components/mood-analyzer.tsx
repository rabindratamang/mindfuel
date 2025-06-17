"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Send, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedIcon } from "@/components/animated-icon"

interface MoodAnalyzerProps {
  onMoodAnalyzed?: (mood: string, score: number, analysis: string, suggestions: string[]) => void
}

export function MoodAnalyzer({ onMoodAnalyzed }: MoodAnalyzerProps) {
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<null | {
    mood: string
    score: number
    analysis: string
    suggestions: string[]
  }>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsAnalyzing(true)

    // Simulate AI analysis with different moods based on input keywords
    setTimeout(() => {
      const inputLower = input.toLowerCase()
      let moodResult

      // Simple keyword-based mood detection for demo
      if (inputLower.includes("anxious") || inputLower.includes("worried") || inputLower.includes("stressed")) {
        moodResult = {
          mood: "Anxious",
          score: 75,
          analysis:
            "Your message indicates anxiety and stress. I notice concerns about upcoming challenges and performance expectations.",
          suggestions: [
            "Try a 5-minute breathing exercise",
            "Practice progressive muscle relaxation",
            "Listen to calming music or nature sounds",
            "Break large tasks into smaller, manageable steps",
          ],
        }
      } else if (inputLower.includes("sad") || inputLower.includes("down") || inputLower.includes("depressed")) {
        moodResult = {
          mood: "Sad",
          score: 60,
          analysis:
            "Your message suggests feelings of sadness or low mood. It's important to acknowledge these feelings and take gentle steps toward self-care.",
          suggestions: [
            "Watch uplifting or motivational content",
            "Read inspiring articles about overcoming challenges",
            "Listen to mood-boosting music",
            "Consider reaching out to friends or family",
          ],
        }
      } else if (inputLower.includes("happy") || inputLower.includes("excited") || inputLower.includes("great")) {
        moodResult = {
          mood: "Happy",
          score: 85,
          analysis: "Your message radiates positivity and happiness! You seem to be in a great mental space right now.",
          suggestions: [
            "Share your positive energy with others",
            "Engage with uplifting content to maintain this mood",
            "Try some energizing music or podcasts",
            "Document this positive moment in your journal",
          ],
        }
      } else if (inputLower.includes("angry") || inputLower.includes("frustrated") || inputLower.includes("mad")) {
        moodResult = {
          mood: "Frustrated",
          score: 70,
          analysis:
            "Your message shows signs of frustration or anger. These are valid emotions that need healthy outlets.",
          suggestions: [
            "Try deep breathing exercises to calm down",
            "Listen to soothing music or nature sounds",
            "Read articles about anger management techniques",
            "Consider physical exercise to release tension",
          ],
        }
      } else {
        moodResult = {
          mood: "Neutral",
          score: 65,
          analysis:
            "Your message suggests a balanced emotional state. You seem to be processing your thoughts in a healthy way.",
          suggestions: [
            "Maintain this balance with mindful content",
            "Explore educational articles on personal growth",
            "Try some ambient music for focus",
            "Consider meditation or mindfulness exercises",
          ],
        }
      }

      setResult(moodResult)
      setIsAnalyzing(false)

      // Notify parent component about the mood analysis
      if (onMoodAnalyzed) {
        onMoodAnalyzed(moodResult.mood, moodResult.score, moodResult.analysis, moodResult.suggestions)
      }
    }, 2000)
  }

  const handleNewAnalysis = () => {
    setResult(null)
    setInput("")
    // Reset the mood in parent component
    if (onMoodAnalyzed) {
      onMoodAnalyzed("", 0, "", [])
    }
  }

  return (
    <div className="space-y-4">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Textarea
              placeholder="How are you feeling today? Share your thoughts, and our AI will analyze your mood and suggest personalized content..."
              className="min-h-[200px] resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </motion.div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" className="gap-2">
              <AnimatedIcon icon={Mic} hoverEffect="pulse" size={16} />
              Voice Input
            </Button>
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
                  <AnimatedIcon icon={Send} hoverEffect="bounce" size={16} />
                  Analyze Mood
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Mood Analysis</div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-teal-500">{result.mood}</div>
                <div className="text-xs text-slate-500">({result.score}% confidence)</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{result.analysis}</p>
            <div className="space-y-2">
              <div className="text-sm font-medium">Immediate Suggestions:</div>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    {suggestion}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          <div className="bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/20 p-3 rounded-lg border border-teal-200 dark:border-teal-800">
            <p className="text-sm text-teal-700 dark:text-teal-300 font-medium">
              ✨ Personalized content recommendations are being prepared based on your mood analysis!
            </p>
          </div>
          <Button onClick={handleNewAnalysis} variant="outline" className="w-full">
            New Analysis
          </Button>
        </motion.div>
      )}
    </div>
  )
}
