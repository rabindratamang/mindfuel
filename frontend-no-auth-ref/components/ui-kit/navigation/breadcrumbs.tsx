"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  separator?: React.ReactNode
  className?: string
}

export function Breadcrumbs({
  items,
  showHome = true,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
}: BreadcrumbsProps) {
  const allItems = showHome ? [{ label: "Home", href: "/", icon: <Home className="h-4 w-4" /> }, ...items] : items

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1

        return (
          <React.Fragment key={index}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center"
            >
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ) : (
                <div
                  className={cn(
                    "flex items-center gap-1",
                    isLast ? "text-slate-900 dark:text-slate-50 font-medium" : "text-slate-500 dark:text-slate-400",
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              )}
            </motion.div>
            {!isLast && <div className="text-slate-400 dark:text-slate-600">{separator}</div>}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
