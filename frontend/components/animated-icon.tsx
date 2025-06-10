"use client"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface AnimatedIconProps {
  icon: LucideIcon
  color?: string
  size?: number
  hoverEffect?: "pulse" | "bounce" | "spin" | "shake" | "glow" | "none"
  className?: string
}

export function AnimatedIcon({ icon: Icon, color, size = 24, hoverEffect = "pulse", className }: AnimatedIconProps) {
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case "pulse":
        return {
          scale: [1, 1.1, 1],
          transition: { duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as const },
        }
      case "bounce":
        return {
          y: [0, -5, 0],
          transition: { duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as const },
        }
      case "spin":
        return {
          rotate: 360,
          transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
        }
      case "shake":
        return {
          x: [0, -3, 3, -3, 3, 0],
          transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 },
        }
      case "glow":
        return {
          opacity: [1, 0.7, 1],
          filter: [
            "drop-shadow(0 0 0px currentColor)",
            "drop-shadow(0 0 3px currentColor)",
            "drop-shadow(0 0 0px currentColor)",
          ],
          transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
        }
      case "none":
      default:
        return {}
    }
  }

  return (
    <motion.div className={className} whileHover={getHoverAnimation()} style={{ display: "inline-flex", color }}>
      <Icon size={size} />
    </motion.div>
  )
}
