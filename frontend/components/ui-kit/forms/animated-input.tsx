"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ClientOnly } from "@/components/client-only"

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
}

export function AnimatedInput({ label, error, icon, className, ...props }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (props.value || props.defaultValue) {
      setHasValue(true)
    }
  }, [props.value, props.defaultValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    props.onChange?.(e)
  }

  const isLabelFloating = isFocused || hasValue

  const StaticInput = () => (
    <div className={cn("relative", className)}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full rounded-lg border border-border bg-background px-3 py-2 sm:py-3 text-sm sm:text-base",
            "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
            "h-12 sm:h-14",
            icon ? "pl-9 sm:pl-10" : "pl-3",
            error && "border-red-500",
          )}
          placeholder={label}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )

  // Remove placeholder from props to avoid conflicts with floating label
  const { placeholder, ...inputProps } = props

  return (
    <ClientOnly fallback={<StaticInput />}>
      <div className={cn("relative", className)}>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">
              {icon}
            </div>
          )}

          <input
            className={cn(
              "peer w-full rounded-lg border border-border bg-background px-3 text-sm sm:text-base transition-all duration-200",
              "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isLabelFloating ? "pt-6 pb-2" : "py-2 sm:py-3",
              "h-12 sm:h-14",
              icon ? "pl-9 sm:pl-10" : "pl-3",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            // Only show placeholder when label is floating and input is focused but empty
            placeholder={isLabelFloating && isFocused && !hasValue ? placeholder : ""}
            {...inputProps}
          />

          {mounted && (
            <motion.label
              className={cn(
                "absolute text-muted-foreground transition-all duration-200 pointer-events-none",
                icon ? "left-9 sm:left-10" : "left-3",
              )}
              animate={{
                top: isLabelFloating ? "0.375rem" : "50%",
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
