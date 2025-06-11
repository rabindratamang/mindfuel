"use client"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ConfirmationType = "info" | "warning" | "danger" | "success"

interface ConfirmationDialogProps {
  title: string
  description: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  type?: ConfirmationType
  className?: string
}

export function ConfirmationDialog({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  className,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />
      case "danger":
        return <XCircle className="h-6 w-6 text-red-500" />
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <AlertCircle className="h-6 w-6 text-blue-500" />
    }
  }

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "danger":
        return "bg-red-500 hover:bg-red-600"
      case "success":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-teal-500 hover:bg-teal-600"
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn("sm:max-w-md", className)} asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              {getIcon()}
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="mt-2">{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className={getConfirmButtonStyle()}>
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
