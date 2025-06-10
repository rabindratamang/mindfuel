"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionDividerProps {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  orientation?: "horizontal" | "vertical"
  variant?: "solid" | "dashed" | "dotted" | "gradient"
  className?: string
}

export function SectionDivider({
  title,
  subtitle,
  icon,
  orientation = "horizontal",
  variant = "solid",
  className,
}: SectionDividerProps) {
  const getVariantClass = () => {
    switch (variant) {
      case "dashed":
        return "border-dashed"
      case "dotted":
        return "border-dotted"
      case "gradient":
        return "border-0 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"
      default:
        return "border-solid"
    }
  }

  if (orientation === "vertical") {
    return (
      <motion.div
        className={cn("flex items-center", className)}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={cn(
            "w-px h-16 border-l border-slate-300 dark:border-slate-600",
            getVariantClass(),
            variant === "gradient" && "w-px h-16",
          )}
        />
        {(title || icon) && (
          <div className="ml-4">
            {icon && <div className="mb-1">{icon}</div>}
            {title && <div className="text-sm font-medium">{title}</div>}
            {subtitle && <div className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>}
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn("flex items-center my-6", className)}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={cn(
          "flex-1 border-t border-slate-300 dark:border-slate-600",
          getVariantClass(),
          variant === "gradient" && "h-px border-0",
        )}
      />
      {(title || icon) && (
        <div className="px-4 text-center">
          {icon && <div className="mb-1 flex justify-center">{icon}</div>}
          {title && <div className="text-sm font-medium">{title}</div>}
          {subtitle && <div className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>}
        </div>
      )}
      <div
        className={cn(
          "flex-1 border-t border-slate-300 dark:border-slate-600",
          getVariantClass(),
          variant === "gradient" && "h-px border-0",
        )}
      />
    </motion.div>
  )
}
