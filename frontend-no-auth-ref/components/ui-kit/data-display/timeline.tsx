"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TimelineItemProps {
  title: string
  description?: string
  date?: string
  icon?: React.ReactNode
  active?: boolean
  last?: boolean
  children?: React.ReactNode
}

export function TimelineItem({
  title,
  description,
  date,
  icon,
  active = false,
  last = false,
  children,
}: TimelineItemProps) {
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
            active
              ? "border-teal-500 bg-teal-50 text-teal-500 dark:bg-teal-900/20 dark:text-teal-400"
              : "border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400",
          )}
        >
          {icon}
        </motion.div>
        {!last && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn("w-px grow", active ? "bg-teal-500" : "bg-slate-300 dark:bg-slate-600")}
          />
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-1 pb-8"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">{title}</h3>
          {date && <time className="text-xs text-slate-500 dark:text-slate-400">{date}</time>}
        </div>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        {children && <div className="mt-2">{children}</div>}
      </motion.div>
    </div>
  )
}

interface TimelineProps {
  children: React.ReactNode
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  return <div className={cn("space-y-0", className)}>{children}</div>
}
