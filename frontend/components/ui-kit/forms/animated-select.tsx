"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClientOnly } from "@/components/client-only"

interface SelectOption {
  value: string
  label: string
}

interface AnimatedSelectProps {
  label: string
  options: SelectOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  className?: string
  onValueChange?: (value: string) => void
}

export function AnimatedSelect({
  label,
  options,
  value,
  defaultValue,
  placeholder,
  error,
  disabled = false,
  className,
  onValueChange,
}: AnimatedSelectProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || "")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    setSelectedValue(newValue)
    onValueChange?.(newValue)
  }

  const isLabelFloating = isFocused || selectedValue || placeholder

  // Static fallback for SSR
  const StaticSelect = () => (
    <div className={cn("relative", className)}>
      <select
        value={selectedValue}
        disabled={disabled}
        className={cn(
          "w-full appearance-none rounded-lg border border-border bg-background px-3 py-3 pr-10 text-sm",
          "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
          error && "border-red-500",
        )}
        onChange={handleChange}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )

  return (
    <ClientOnly fallback={<StaticSelect />}>
      <div className={cn("relative", className)}>
        <div className="relative">
          <select
            value={selectedValue}
            disabled={disabled}
            className={cn(
              "peer w-full appearance-none rounded-lg border border-border bg-background px-3 py-3 pr-10 text-sm transition-all duration-200",
              "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />

          {mounted && (
            <motion.label
              className="absolute left-3 text-sm text-muted-foreground transition-all duration-200 pointer-events-none"
              animate={{
                top: isLabelFloating ? "0.5rem" : "50%",
                fontSize: isLabelFloating ? "0.75rem" : "0.875rem",
                y: isLabelFloating ? 0 : "-50%",
              }}
              style={{
                color: error ? "#ef4444" : isFocused ? "#14b8a6" : undefined,
              }}
            >
              {label}
            </motion.label>
          )}
        </div>

        {error && mounted && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    </ClientOnly>
  )
}
