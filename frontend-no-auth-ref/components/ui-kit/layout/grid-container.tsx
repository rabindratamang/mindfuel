"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GridContainerProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: "sm" | "md" | "lg" | "xl"
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  }
  animated?: boolean
  className?: string
}

export function GridContainer({
  children,
  columns = 1,
  gap = "md",
  responsive,
  animated = true,
  className,
}: GridContainerProps) {
  const getColumnsClass = (cols: number) => {
    switch (cols) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-3"
      case 4:
        return "grid-cols-4"
      case 5:
        return "grid-cols-5"
      case 6:
        return "grid-cols-6"
      case 12:
        return "grid-cols-12"
      default:
        return "grid-cols-1"
    }
  }

  const getGapClass = () => {
    switch (gap) {
      case "sm":
        return "gap-2"
      case "md":
        return "gap-4"
      case "lg":
        return "gap-6"
      case "xl":
        return "gap-8"
      default:
        return "gap-4"
    }
  }

  const gridClasses = cn(
    "grid",
    getColumnsClass(columns),
    responsive?.sm && `sm:${getColumnsClass(responsive.sm)}`,
    responsive?.md && `md:${getColumnsClass(responsive.md)}`,
    responsive?.lg && `lg:${getColumnsClass(responsive.lg)}`,
    responsive?.xl && `xl:${getColumnsClass(responsive.xl)}`,
    getGapClass(),
    className,
  )

  if (!animated) {
    return <div className={gridClasses}>{children}</div>
  }

  return (
    <motion.div
      className={gridClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
