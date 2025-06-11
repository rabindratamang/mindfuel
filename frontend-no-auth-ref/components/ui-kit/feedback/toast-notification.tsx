"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  id: string
  title: string
  description?: string
  type?: ToastType
  duration?: number
  onClose: (id: string) => void
  action?: React.ReactNode
}

export function Toast({ id, title, description, type = "info", duration = 5000, onClose, action }: ToastProps) {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-l-green-500"
      case "error":
        return "border-l-red-500"
      case "warning":
        return "border-l-yellow-500"
      default:
        return "border-l-blue-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950",
        "border-l-4",
        getBorderColor(),
      )}
    >
      <div className="flex w-full items-start gap-3 p-4">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="font-medium">{title}</div>
          {description && <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</div>}
          {action && <div className="mt-3">{action}</div>}
        </div>
        <button
          onClick={() => onClose(id)}
          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-slate-200 dark:bg-slate-700"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  )
}

interface ToastContainerProps {
  children: React.ReactNode
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
  className?: string
}

export function ToastContainer({ children, position = "bottom-right", className }: ToastContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-0 left-0"
      case "top-center":
        return "top-0 left-1/2 -translate-x-1/2"
      case "top-right":
        return "top-0 right-0"
      case "bottom-left":
        return "bottom-0 left-0"
      case "bottom-center":
        return "bottom-0 left-1/2 -translate-x-1/2"
      default:
        return "bottom-0 right-0"
    }
  }

  return (
    <div
      className={cn("fixed z-50 flex flex-col gap-2 p-4 max-h-screen overflow-hidden", getPositionClasses(), className)}
    >
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  )
}
