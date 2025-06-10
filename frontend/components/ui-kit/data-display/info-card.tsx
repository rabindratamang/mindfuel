"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InfoCardProps {
  title: string
  description?: string
  content: React.ReactNode
  icon?: React.ReactNode
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  className?: string
  onClick?: () => void
}

export function InfoCard({ title, description, content, icon, badge, className, onClick }: InfoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(onClick ? "cursor-pointer" : "")}
      onClick={onClick}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-start gap-2">
            {icon && (
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="mt-0.5"
              >
                {icon}
              </motion.div>
            )}
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </div>
          {badge && <Badge variant={badge.variant}>{badge.text}</Badge>}
        </CardHeader>
        <CardContent>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {content}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
