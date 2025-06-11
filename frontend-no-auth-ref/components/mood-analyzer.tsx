"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Send, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedIcon } from "@/components/animated-icon"

export function MoodAnalyzer() {
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

    // Simulate AI analysis
    setTimeout(() => {
      setResult({
        mood: "Slightly Anxious",
        score: 65,
        analysis:
          "Your message indicates some anxiety about upcoming events. I notice concerns about time management and performance expectations.",
        suggestions: [
          "Try a 5-minute breathing exercise",
          "Break large tasks into smaller steps",
          "Schedule short breaks throughout your day",
        ],
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Textarea
              placeholder="How are you feeling today? Share your thoughts, and our AI will analyze your mood..."
              className="min-h-[120px] resize-none"
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
                  Analyze
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
              <div className="text-sm font-medium text-teal-500">{result.mood}</div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{result.analysis}</p>
            <div className="space-y-2">
              <div className="text-sm font-medium">Suggestions:</div>
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
          <Button
            onClick={() => {
              setResult(null)
              setInput("")
            }}
            variant="outline"
            className="w-full"
          >
            New Analysis
          </Button>
        </motion.div>
      )}
    </div>
  )
}
