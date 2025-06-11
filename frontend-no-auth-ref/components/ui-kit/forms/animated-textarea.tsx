"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ClientOnly } from "@/components/client-only"

interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  maxRows?: number
}

export function AnimatedTextarea({ label, error, maxRows = 6, className, rows = 3, ...props }: AnimatedTextareaProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMounted(true)
    if (props.value || props.defaultValue) {
      setHasValue(true)
    }
  }, [props.value, props.defaultValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0)
    props.onChange?.(e)

    // Auto-resize functionality
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = Number.parseInt(getComputedStyle(textareaRef.current).lineHeight) * maxRows
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }

  const isLabelFloating = isFocused || hasValue

  // Static fallback for SSR
  const StaticTextarea = () => (
    <div className={cn("relative", className)}>
      <textarea
        rows={rows}
        className={cn(
          "w-full rounded-lg border border-border bg-background px-3 py-3 text-sm resize-none",
          "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
          error && "border-red-500",
        )}
        placeholder={label}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )

  return (
    <ClientOnly fallback={<StaticTextarea />}>
      <div className={cn("relative", className)}>
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={rows}
            className={cn(
              "peer w-full rounded-lg border border-border bg-background px-3 py-3 text-sm transition-all duration-200 resize-none",
              "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            {...props}
          />

          {mounted && (
            <motion.label
              className="absolute left-3 text-sm text-muted-foreground transition-all duration-200 pointer-events-none"
              animate={{
                top: isLabelFloating ? "0.5rem" : "1rem",
                fontSize: isLabelFloating ? "0.75rem" : "0.875rem",
                y: isLabelFloating ? 0 : 0,
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
