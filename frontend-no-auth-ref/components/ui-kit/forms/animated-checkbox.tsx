"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClientOnly } from "@/components/client-only"

interface AnimatedCheckboxProps {
  label: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  className?: string
  onCheckedChange?: (checked: boolean) => void
}

export function AnimatedCheckbox({
  label,
  description,
  checked,
  defaultChecked = false,
  disabled = false,
  className,
  onCheckedChange,
}: AnimatedCheckboxProps) {
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

  // Static fallback for SSR
  const StaticCheckbox = () => (
    <div className={cn("flex items-start space-x-3", className)}>
      <input
        type="checkbox"
        checked={currentChecked}
        disabled={disabled}
        onChange={handleChange}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
      />
      <div className="flex-1">
        <label className={cn("text-sm font-medium", disabled && "opacity-50")}>{label}</label>
        {description && (
          <p className={cn("text-xs text-muted-foreground mt-1", disabled && "opacity-50")}>{description}</p>
        )}
      </div>
    </div>
  )

  return (
    <ClientOnly fallback={<StaticCheckbox />}>
      <div className={cn("flex items-start space-x-3", className)}>
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
              "flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 transition-colors",
              currentChecked ? "border-teal-500 bg-teal-500" : "border-border bg-background hover:border-teal-300",
              disabled && "cursor-not-allowed opacity-50",
            )}
            whileTap={!disabled && mounted ? { scale: 0.95 } : {}}
          >
            {mounted && (
              <motion.div
                initial={false}
                animate={{
                  scale: currentChecked ? 1 : 0,
                  opacity: currentChecked ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <Check className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </motion.label>
        </div>

        <div className="flex-1">
          <label className={cn("text-sm font-medium cursor-pointer", disabled && "cursor-not-allowed opacity-50")}>
            {label}
          </label>
          {description && (
            <p className={cn("text-xs text-muted-foreground mt-1", disabled && "opacity-50")}>{description}</p>
          )}
        </div>
      </div>
    </ClientOnly>
  )
}
