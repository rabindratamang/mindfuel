"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  showValue?: boolean
  valueFormat?: (value: number, max: number) => string
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  size?: "sm" | "md" | "lg"
  animated?: boolean
  className?: string
  barClassName?: string
}

export function ProgressBar({
  value,
  max = 100,
  showValue = false,
  valueFormat,
  color = "primary",
  size = "md",
  animated = true,
  className,
  barClassName,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-1"
      case "md":
        return "h-2"
      case "lg":
        return "h-3"
      default:
        return "h-2"
    }
  }

  const getColorClass = () => {
    switch (color) {
      case "primary":
        return "bg-teal-500"
      case "secondary":
        return "bg-slate-500"
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "danger":
        return "bg-red-500"
      default:
        return "bg-teal-500"
    }
  }

  const formatValue = () => {
    if (valueFormat) {
      return valueFormat(value, max)
    }
    return `${Math.round(percentage)}%`
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        {showValue && <div className="text-xs font-medium">{formatValue()}</div>}
      </div>
      <div className={cn("w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden", getSizeClass())}>
        <motion.div
          className={cn(
            "h-full rounded-full",
            getColorClass(),
            animated && "transition-all duration-500 ease-in-out",
            barClassName,
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0 }}
        />
      </div>
    </div>
  )
}
