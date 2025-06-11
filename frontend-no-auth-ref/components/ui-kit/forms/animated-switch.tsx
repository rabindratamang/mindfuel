"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ClientOnly } from "@/components/client-only"

interface AnimatedSwitchProps {
  label?: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  onCheckedChange?: (checked: boolean) => void
}

export function AnimatedSwitch({
  label,
  description,
  checked,
  defaultChecked = false,
  disabled = false,
  size = "md",
  className,
  onCheckedChange,
}: AnimatedSwitchProps) {
  const [isChecked, setIsChecked] = useState(checked ?? defaultChecked)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    setIsChecked(newChecked)
    onCheckedChange?.(newChecked)
  }

  const currentChecked = checked !== undefined ? checked : isChecked

  const sizeClasses = {
    sm: { track: "h-4 w-7", thumb: "h-3 w-3", translate: "3" },
    md: { track: "h-5 w-9", thumb: "h-4 w-4", translate: "4" },
    lg: { track: "h-6 w-11", thumb: "h-5 w-5", translate: "5" },
  }

  const sizes = sizeClasses[size]

  // Static fallback for SSR
  const StaticSwitch = () => (
    <div className={cn("flex items-center space-x-3", className)}>
      <input
        type="checkbox"
        checked={currentChecked}
        disabled={disabled}
        onChange={handleChange}
        className="h-4 w-8 rounded-full border-gray-300 text-teal-600 focus:ring-teal-500"
      />
      {(label || description) && (
        <div className="flex-1">
          {label && <label className={cn("text-sm font-medium", disabled && "opacity-50")}>{label}</label>}
          {description && (
            <p className={cn("text-xs text-muted-foreground mt-1", disabled && "opacity-50")}>{description}</p>
          )}
        </div>
      )}
    </div>
  )

  return (
    <ClientOnly fallback={<StaticSwitch />}>
      <div className={cn("flex items-center space-x-3", className)}>
        <div className="relative">
          <input
            type="checkbox"
            checked={currentChecked}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only"
          />

          <motion.label
            className={cn(
              "relative inline-flex cursor-pointer items-center rounded-full transition-colors",
              sizes.track,
              currentChecked ? "bg-teal-500" : "bg-gray-200 dark:bg-gray-700",
              disabled && "cursor-not-allowed opacity-50",
            )}
            whileTap={!disabled && mounted ? { scale: 0.95 } : {}}
          >
            {mounted && (
              <motion.div
                className={cn("rounded-full bg-white shadow-sm transition-transform", sizes.thumb)}
                animate={{
                  x: currentChecked ? `${sizes.translate}` : "0.125rem",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.label>
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label className={cn("text-sm font-medium cursor-pointer", disabled && "cursor-not-allowed opacity-50")}>
                {label}
              </label>
            )}
            {description && (
              <p className={cn("text-xs text-muted-foreground mt-1", disabled && "opacity-50")}>{description}</p>
            )}
          </div>
        )}
      </div>
    </ClientOnly>
  )
}
