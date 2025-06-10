"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ClientOnly } from "@/components/client-only"

interface SearchBarProps {
  placeholder?: string
  value?: string
  className?: string
  onSearch?: (value: string) => void
  onChange?: (value: string) => void
  onClear?: () => void
}

export function SearchBar({
  placeholder = "Search...",
  value: controlledValue,
  className,
  onSearch,
  onChange,
  onClear,
}: SearchBarProps) {
  const [value, setValue] = useState(controlledValue || "")
  const [isFocused, setIsFocused] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue)
    }
  }, [controlledValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange?.(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(value)
    }
  }

  const handleClear = () => {
    setValue("")
    onChange?.("")
    onClear?.()
  }

  // Static fallback for SSR
  const StaticSearchBar = () => (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background pl-10 pr-10 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )

  return (
    <ClientOnly fallback={<StaticSearchBar />}>
      <div className={cn("relative", className)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-border bg-background pl-10 pr-10 py-2 text-sm transition-all duration-200",
            "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
            isFocused && "border-teal-500 ring-2 ring-teal-500/20",
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {value && mounted && (
          <motion.button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </ClientOnly>
  )
}
