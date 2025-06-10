"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
  collapsible?: boolean
}

export function FormSection({
  title,
  description,
  children,
  defaultOpen = true,
  className,
  headerClassName,
  contentClassName,
  collapsible = true,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  const toggleOpen = () => {
    if (collapsible) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <motion.div
        className={cn(
          "flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 border-b",
          collapsible ? "cursor-pointer" : "",
          headerClassName,
        )}
        onClick={toggleOpen}
        whileHover={collapsible ? { backgroundColor: "rgba(0, 0, 0, 0.02)" } : {}}
      >
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        {collapsible && (
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-5 w-5 text-slate-500" />
          </motion.div>
        )}
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className={cn("p-4", contentClassName)}>{children}</div>
      </motion.div>
    </div>
  )
}
