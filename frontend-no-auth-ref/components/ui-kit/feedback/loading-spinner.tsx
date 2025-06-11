"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  className?: string
}

export function LoadingSpinner({ size = "md", color = "primary", className }: LoadingSpinnerProps) {
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4 border-2"
      case "md":
        return "h-6 w-6 border-2"
      case "lg":
        return "h-8 w-8 border-3"
      case "xl":
        return "h-12 w-12 border-4"
      default:
        return "h-6 w-6 border-2"
    }
  }

  const getColorClass = () => {
    switch (color) {
      case "primary":
        return "border-t-teal-500"
      case "secondary":
        return "border-t-slate-500"
      case "success":
        return "border-t-green-500"
      case "warning":
        return "border-t-yellow-500"
      case "danger":
        return "border-t-red-500"
      default:
        return "border-t-teal-500"
    }
  }

  return (
    <motion.div
      className={cn(
        "inline-block rounded-full border-solid border-slate-200 dark:border-slate-700",
        getSizeClass(),
        getColorClass(),
        className,
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    />
  )
}
