"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  progress?: number
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  className?: string
  onClick?: () => void
}

export function StatCard({ title, value, description, icon, progress, trend, className, onClick }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(onClick ? "cursor-pointer" : "")}
      onClick={onClick}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && (
            <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
              {icon}
            </motion.div>
          )}
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            {value}
          </motion.div>

          {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>}

          {trend && (
            <div className="flex items-center mt-2">
              <div className={cn("text-xs font-medium mr-2", trend.positive ? "text-green-500" : "text-red-500")}>
                {trend.positive ? "+" : ""}
                {trend.value}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{trend.label}</div>
            </div>
          )}

          {progress !== undefined && (
            <div className="mt-3">
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.2 }}>
                <Progress value={progress} className="h-1" />
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
