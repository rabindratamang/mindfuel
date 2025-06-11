"use client"

import type * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AnimatedModalProps {
  title: string
  description?: string
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  showCloseButton?: boolean
  className?: string
  contentClassName?: string
}

export function AnimatedModal({
  title,
  description,
  children,
  open,
  onOpenChange,
  showCloseButton = true,
  className,
  contentClassName,
}: AnimatedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className={cn("sm:max-w-md", className)} asChild forceMount>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{title}</DialogTitle>
                  {showCloseButton && (
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {description && <DialogDescription>{description}</DialogDescription>}
              </DialogHeader>
              <div className={cn("mt-4", contentClassName)}>{children}</div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
