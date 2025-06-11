"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AvatarData {
  id: string
  name: string
  src?: string
  fallback?: string
}

interface AvatarGroupProps {
  avatars: AvatarData[]
  max?: number
  size?: "sm" | "md" | "lg" | "xl"
  spacing?: "tight" | "normal" | "loose"
  showTooltip?: boolean
  className?: string
}

export function AvatarGroup({
  avatars,
  max = 5,
  size = "md",
  spacing = "normal",
  showTooltip = true,
  className,
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max)
  const remainingCount = Math.max(0, avatars.length - max)

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6"
      case "md":
        return "h-8 w-8"
      case "lg":
        return "h-10 w-10"
      case "xl":
        return "h-12 w-12"
      default:
        return "h-8 w-8"
    }
  }

  const getSpacingClass = () => {
    switch (spacing) {
      case "tight":
        return "-space-x-1"
      case "normal":
        return "-space-x-2"
      case "loose":
        return "-space-x-1"
      default:
        return "-space-x-2"
    }
  }

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs"
      case "md":
        return "text-sm"
      case "lg":
        return "text-base"
      case "xl":
        return "text-lg"
      default:
        return "text-sm"
    }
  }

  return (
    <div className={cn("flex items-center", getSpacingClass(), className)}>
      {displayAvatars.map((avatar, index) => (
        <motion.div
          key={avatar.id}
          className="relative group"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.1, zIndex: 10 }}
        >
          <Avatar className={cn(getSizeClass(), "border-2 border-white dark:border-slate-900")}>
            <AvatarImage src={avatar.src || "/placeholder.svg"} alt={avatar.name} />
            <AvatarFallback className={getTextSize()}>
              {avatar.fallback || avatar.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {avatar.name}
            </div>
          )}
        </motion.div>
      ))}

      {remainingCount > 0 && (
        <motion.div
          className="relative group"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: displayAvatars.length * 0.1 }}
          whileHover={{ scale: 1.1, zIndex: 10 }}
        >
          <Avatar
            className={cn(getSizeClass(), "border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800")}
          >
            <AvatarFallback className={cn(getTextSize(), "text-slate-600 dark:text-slate-400")}>
              +{remainingCount}
            </AvatarFallback>
          </Avatar>

          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {remainingCount} more
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
