"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Moon, BarChart } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedIcon } from "@/components/animated-icon"

interface RecommendationCardProps {
  title: string
  description: string
  type: "meditation" | "sleep" | "mood"
}

export function RecommendationCard({ title, description, type }: RecommendationCardProps) {
  const getIcon = () => {
    switch (type) {
      case "meditation":
        return <AnimatedIcon icon={Sparkles} hoverEffect="glow" size={20} color="#0ea5e9" />
      case "sleep":
        return <AnimatedIcon icon={Moon} hoverEffect="pulse" size={20} color="#818cf8" />
      case "mood":
        return <AnimatedIcon icon={BarChart} hoverEffect="bounce" size={20} color="#14b8a6" />
    }
  }

  const getGradient = () => {
    switch (type) {
      case "meditation":
        return "from-sky-500 to-blue-500"
      case "sleep":
        return "from-indigo-500 to-purple-500"
      case "mood":
        return "from-teal-500 to-green-500"
    }
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
        <motion.div
          className={`h-1.5 bg-gradient-to-r ${getGradient()}`}
          whileHover={{ scaleX: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <motion.div
              className="mt-1 bg-slate-100 dark:bg-slate-800 p-2 rounded-md"
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              {getIcon()}
            </motion.div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">{title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{description}</p>
              <Button size="sm" className={`w-full bg-gradient-to-r ${getGradient()}`}>
                Start Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
