"use client"
import { motion } from "framer-motion"
import { Card, type CardProps } from "@/components/ui/card"

interface AnimatedCardProps extends CardProps {
  hoverEffect?: "lift" | "glow" | "border" | "none"
  delay?: number
}

export function AnimatedCard({ children, className, hoverEffect = "lift", delay = 0, ...props }: AnimatedCardProps) {
  const getHoverStyles = () => {
    switch (hoverEffect) {
      case "lift":
        return {
          y: -8,
          transition: { type: "spring", stiffness: 300, damping: 15 },
        }
      case "glow":
        return {
          boxShadow: "0 0 15px rgba(80, 200, 200, 0.3)",
        }
      case "border":
        return {
          boxShadow: "inset 0 0 0 2px rgba(80, 200, 200, 0.6)",
        }
      case "none":
      default:
        return {}
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
      whileHover={getHoverStyles()}
    >
      <Card className={className} {...props}>
        {children}
      </Card>
    </motion.div>
  )
}
