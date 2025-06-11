"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type AlertType = "success" | "error" | "warning" | "info"

interface AlertBannerProps {
  title: string
  description?: string
  type?: AlertType
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  visible?: boolean
  className?: string
}

export function AlertBanner({
  title,
  description,
  type = "info",
  onClose,
  action,
  visible = true,
  className,
}: AlertBannerProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "error":
        return <AlertCircle className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getTypeClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
      case "error":
        return "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
      default:
        return "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn("flex items-start gap-3 rounded-lg border p-4", getTypeClasses(), className)}
        >
          <div className="mt-0.5">{getIcon()}</div>
          <div className="flex-1">
            <div className="font-medium">{title}</div>
            {description && <div className="mt-1 text-sm opacity-90">{description}</div>}
          </div>
          <div className="flex items-center gap-2">
            {action && (
              <Button variant="outline" size="sm" onClick={action.onClick} className="h-8 text-xs">
                {action.label}
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
