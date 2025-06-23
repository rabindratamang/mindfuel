"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Heart, Target, Sparkles, MessageCircle, CheckCircle, Zap, Shield, Lightbulb } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { motion, AnimatePresence } from "framer-motion"

interface OnboardingData {
  mentalHealthGoals: string[]
  currentChallenges: string[]
  wellnessInterests: string[]
  experienceLevel: string
  preferredActivities: string[]
  communicationStyle: string
}

const steps = [
  { id: 1, title: "Welcome", icon: Heart, color: "from-pink-400 to-rose-500" },
  { id: 2, title: "Goals", icon: Target, color: "from-blue-400 to-indigo-500" },
  { id: 3, title: "Challenges", icon: Shield, color: "from-amber-400 to-orange-500" },
  { id: 4, title: "Interests", icon: Sparkles, color: "from-purple-400 to-violet-500" },
  { id: 5, title: "Experience", icon: Zap, color: "from-green-400 to-emerald-500" },
  { id: 6, title: "Activities", icon: Lightbulb, color: "from-cyan-400 to-teal-500" },
  { id: 7, title: "Communication", icon: MessageCircle, color: "from-indigo-400 to-purple-500" },
]

const mentalHealthGoals = [
  { text: "Reduce stress and anxiety", icon: "🧘", description: "Find peace in daily life" },
  { text: "Improve sleep quality", icon: "😴", description: "Rest better, wake refreshed" },
  { text: "Build emotional resilience", icon: "💪", description: "Bounce back from challenges" },
  { text: "Enhance focus and concentration", icon: "🎯", description: "Stay present and focused" },
  { text: "Develop mindfulness practices", icon: "🌸", description: "Live in the moment" },
  { text: "Manage depression symptoms", icon: "🌈", description: "Find light in dark times" },
  { text: "Improve relationships", icon: "❤️", description: "Connect deeper with others" },
  { text: "Boost self-confidence", icon: "✨", description: "Believe in yourself" },
  { text: "Find work-life balance", icon: "⚖️", description: "Harmony between work and life" },
  { text: "Process grief or trauma", icon: "🤗", description: "Heal from past experiences" },
  { text: "Increase self-awareness", icon: "🪞", description: "Understand yourself better" },
  { text: "Develop healthy habits", icon: "🌱", description: "Build positive routines" },
]

const currentChallenges = [
  { text: "Work-related stress", icon: "💼", description: "Pressure from job demands" },
  { text: "Sleep difficulties", icon: "🌙", description: "Trouble falling or staying asleep" },
  { text: "Anxiety attacks", icon: "⚡", description: "Sudden overwhelming worry" },
  { text: "Relationship issues", icon: "💔", description: "Conflicts with loved ones" },
  { text: "Low mood or depression", icon: "☁️", description: "Persistent sadness or emptiness" },
  { text: "Lack of motivation", icon: "🔋", description: "Difficulty getting started" },
  { text: "Overwhelming thoughts", icon: "🌪️", description: "Racing or intrusive thoughts" },
  { text: "Social anxiety", icon: "👥", description: "Fear of social situations" },
  { text: "Burnout", icon: "🔥", description: "Physical and emotional exhaustion" },
  { text: "Life transitions", icon: "🚪", description: "Major changes or uncertainty" },
  { text: "Perfectionism", icon: "🎭", description: "Setting unrealistic standards" },
  { text: "Loneliness", icon: "🏝️", description: "Feeling isolated or disconnected" },
]

const wellnessInterests = [
  { text: "Meditation and mindfulness", icon: "🧘‍♀️", description: "Quiet the mind" },
  { text: "Physical exercise and fitness", icon: "🏃‍♂️", description: "Move your body" },
  { text: "Nutrition and healthy eating", icon: "🥗", description: "Nourish yourself" },
  { text: "Sleep optimization", icon: "🛏️", description: "Perfect your rest" },
  { text: "Stress management techniques", icon: "🌊", description: "Flow with challenges" },
  { text: "Breathing exercises", icon: "💨", description: "Harness your breath" },
  { text: "Journaling and reflection", icon: "📝", description: "Write your thoughts" },
  { text: "Nature and outdoor activities", icon: "🌲", description: "Connect with nature" },
  { text: "Creative expression", icon: "🎨", description: "Express your soul" },
  { text: "Social connections", icon: "🤝", description: "Build meaningful bonds" },
  { text: "Music and sound therapy", icon: "🎵", description: "Heal through sound" },
  { text: "Yoga and stretching", icon: "🤸‍♀️", description: "Unite body and mind" },
]

const experienceLevels = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to mental wellness practices",
    icon: "🌱",
    detail: "Just starting your wellness journey",
  },
  {
    value: "some-experience",
    label: "Some Experience",
    description: "Tried a few wellness activities",
    icon: "🌿",
    detail: "Explored some practices occasionally",
  },
  {
    value: "experienced",
    label: "Experienced",
    description: "Regular wellness practice",
    icon: "🌳",
    detail: "Consistent with wellness routines",
  },
  {
    value: "expert",
    label: "Expert",
    description: "Deep knowledge and consistent practice",
    icon: "🏆",
    detail: "Advanced practitioner and teacher",
  },
]

const preferredActivities = [
  { text: "Guided meditation videos", icon: "📹", description: "Visual meditation guidance" },
  { text: "Educational articles", icon: "📚", description: "In-depth written content" },
  { text: "Audio content and podcasts", icon: "🎧", description: "Listen while you go" },
  { text: "Interactive exercises", icon: "🎮", description: "Hands-on activities" },
  { text: "Music and soundscapes", icon: "🎼", description: "Calming audio experiences" },
  { text: "Visual content and infographics", icon: "📊", description: "Easy-to-digest visuals" },
  { text: "Community discussions", icon: "💬", description: "Connect with others" },
  { text: "Personal challenges", icon: "🏅", description: "Goal-oriented activities" },
  { text: "Progress tracking", icon: "📈", description: "Monitor your growth" },
  { text: "Expert interviews", icon: "🎤", description: "Learn from professionals" },
  { text: "Breathing exercises", icon: "🫁", description: "Focused breathing practices" },
  { text: "Mindful movement", icon: "🕺", description: "Gentle physical activities" },
]

const communicationStyles = [
  {
    value: "supportive",
    label: "Supportive & Encouraging",
    description: "Gentle, empathetic, and motivating",
    icon: "🤗",
    example: "You're doing great! Every small step matters.",
  },
  {
    value: "direct",
    label: "Direct & Practical",
    description: "Clear, straightforward, and action-oriented",
    icon: "🎯",
    example: "Here's what you need to do next...",
  },
  {
    value: "motivational",
    label: "Motivational & Energetic",
    description: "Inspiring, enthusiastic, and goal-focused",
    icon: "🚀",
    example: "You've got this! Let's crush your goals!",
  },
  {
    value: "gentle",
    label: "Gentle & Calm",
    description: "Soft, peaceful, and non-judgmental",
    icon: "🕊️",
    example: "Take your time. There's no rush in healing.",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    mentalHealthGoals: [],
    currentChallenges: [],
    wellnessInterests: [],
    experienceLevel: "",
    preferredActivities: [],
    communicationStyle: "",
  })

  const { user, setUser } = useAuth()
  const router = useRouter()

  const progress = (currentStep / steps.length) * 100
  const currentStepData = steps[currentStep - 1]

  const handleMultiSelect = (field: keyof OnboardingData, value: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as string[]).includes(value)
          ? (prev[field] as string[]).filter((item) => item !== value)
          : [...(prev[field] as string[]), value]
        : [value],
    }))
  }

  const handleSingleSelect = (field: keyof OnboardingData, value: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("mindfuel_access_token")}`,
        },
        body: JSON.stringify(onboardingData),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.user) {
          setUser(result.user)
        }
        router.push("/dashboard")
      } else {
        console.error("Failed to save onboarding data")
      }
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 2:
        return onboardingData.mentalHealthGoals.length > 0
      case 3:
        return onboardingData.currentChallenges.length > 0
      case 4:
        return onboardingData.wellnessInterests.length > 0
      case 5:
        return onboardingData.experienceLevel !== ""
      case 6:
        return onboardingData.preferredActivities.length > 0
      case 7:
        return onboardingData.communicationStyle !== ""
      default:
        return true
    }
  }

  const renderMultiSelectGrid = (items: any[], field: keyof OnboardingData) => (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {items.map((item, index) => (
        <motion.button
          key={item.text}
          onClick={() => handleMultiSelect(field, item.text)}
          className={`group relative p-4 text-left rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            (onboardingData[field] as string[]).includes(item.text)
              ? "border-teal-400 bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700 shadow-md"
              : "border-gray-200 hover:border-teal-200 bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-teal-50"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-base">{item.text}</span>
              </div>
              <p className="text-xs text-gray-600 group-hover:text-gray-700">{item.description}</p>
            </div>
            <AnimatePresence>
              {(onboardingData[field] as string[]).includes(item.text) && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      ))}
    </motion.div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            className="text-center space-y-6 flex-1 flex flex-col justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <motion.h2
                className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome to MindFuel, {user?.firstName}! 👋
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Let's personalize your mental wellness journey with a few thoughtful questions. This will help our AI
                provide you with the most relevant and caring recommendations.
              </motion.p>
            </div>
            <motion.div
              className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-teal-700 font-medium">
                ✨ This takes about 2-3 minutes and will create a truly personalized experience just for you
              </p>
            </motion.div>
          </motion.div>
        )

      case 2:
      case 3:
      case 4:
      case 6:
        return (
          <motion.div
            className="space-y-4 flex-1 flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStep === 2 && "What are your mental health goals?"}
                {currentStep === 3 && "What challenges are you currently facing?"}
                {currentStep === 4 && "What wellness areas interest you most?"}
                {currentStep === 6 && "What types of content do you prefer?"}
              </h2>
              <p className="text-base text-gray-600">
                {currentStep === 2 && "Select all that resonate with your journey"}
                {currentStep === 3 && "This helps us understand what to focus on first"}
                {currentStep === 4 && "Choose the practices you'd like to explore and grow in"}
                {currentStep === 6 && "Select your favorite ways to learn and engage with wellness content"}
              </p>
            </div>
            {currentStep === 2 && renderMultiSelectGrid(mentalHealthGoals, "mentalHealthGoals")}
            {currentStep === 3 && renderMultiSelectGrid(currentChallenges, "currentChallenges")}
            {currentStep === 4 && renderMultiSelectGrid(wellnessInterests, "wellnessInterests")}
            {currentStep === 6 && renderMultiSelectGrid(preferredActivities, "preferredActivities")}
          </motion.div>
        )

      case 5:
      case 7:
        return (
          <motion.div
            className="space-y-4 flex-1 flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStep === 5 && "What's your experience with wellness practices?"}
                {currentStep === 7 && "How would you like our AI to communicate with you?"}
              </h2>
              <p className="text-base text-gray-600">
                {currentStep === 5 && "This helps us recommend the perfect level of content for you"}
                {currentStep === 7 && "Choose the tone that feels most comfortable and supportive"}
              </p>
            </div>
            <motion.div
              className="space-y-3 flex-1 overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {(currentStep === 5 ? experienceLevels : communicationStyles).map((item, index) => (
                <motion.button
                  key={currentStep === 5 ? item.value : item.value}
                  onClick={() =>
                    handleSingleSelect(currentStep === 5 ? "experienceLevel" : "communicationStyle", item.value)
                  }
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 hover:scale-102 hover:shadow-lg ${
                    (currentStep === 5 ? onboardingData.experienceLevel : onboardingData.communicationStyle) ===
                    item.value
                      ? "border-teal-400 bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700 shadow-md"
                      : "border-gray-200 hover:border-teal-200 bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-teal-50"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-lg">{item.label}</div>
                        <div className="text-gray-600 text-sm">{item.description}</div>
                        {currentStep === 5 && <div className="text-xs text-gray-500 mt-1">{item.detail}</div>}
                        {currentStep === 7 && <div className="text-xs text-gray-500 mt-1 italic">"{item.example}"</div>}
                      </div>
                    </div>
                    <AnimatePresence>
                      {(currentStep === 5 ? onboardingData.experienceLevel : onboardingData.communicationStyle) ===
                        item.value && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <CheckCircle className="w-5 h-5 text-teal-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex flex-col">
      <div className="container mx-auto px-4 py-4 flex flex-col h-full">
        {/* Header */}
        <motion.div
          className="text-center mb-6 flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <Brain className="w-8 h-8 text-teal-600" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              MindFuel
            </span>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    currentStep >= step.id
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                      : "bg-gray-200 text-gray-500"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  animate={currentStep === step.id ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    className={`w-8 h-1.5 mx-1 rounded-full transition-all duration-500 ${
                      currentStep > step.id ? "bg-gradient-to-r from-teal-400 to-blue-400" : "bg-gray-200"
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: currentStep > step.id ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )}
              </div>
            ))}
          </div>

          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="max-w-md mx-auto">
            <Progress value={progress} className="h-2 bg-gray-200" />
          </motion.div>
          <motion.p
            className="text-base text-gray-600 mt-2 font-medium"
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Step {currentStep} of {steps.length} • {currentStepData.title}
          </motion.p>
        </motion.div>

        {/* Content */}
        <Card className="flex-1 mx-auto w-full max-w-6xl shadow-xl border-0 bg-white/80 backdrop-blur-sm flex flex-col">
          <CardContent className="p-6 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center mt-4 flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-2 text-base rounded-xl border-2 hover:scale-105 transition-all duration-200"
          >
            Back
          </Button>

          <div className="flex gap-4">
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-2 text-base rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isLoading}
                className="px-6 py-2 text-base rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : null}
                {isLoading ? "Creating Your Experience..." : "Complete Setup ✨"}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
