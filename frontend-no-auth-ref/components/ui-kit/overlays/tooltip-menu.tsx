"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TooltipMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
}

export function TooltipMenu({ trigger, children, side = "bottom", align = "center", className }: TooltipMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getPosition = () => {
    switch (side) {
      case "top":
        return { bottom: "100%", marginBottom: "8px" }
      case "right":
        return { left: "100%", marginLeft: "8px" }
      case "left":
        return { right: "100%", marginRight: "8px" }
      default:
        return { top: "100%", marginTop: "8px" }
    }
  }

  const getAlignment = () => {
    switch (align) {
      case "start":
        return side === "left" || side === "right" ? { top: 0 } : { left: 0 }
      case "end":
        return side === "left" || side === "right" ? { bottom: 0 } : { right: 0 }
      default:
        return side === "left" || side === "right"
          ? { top: "50%", transform: "translateY(-50%)" }
          : { left: "50%", transform: "translateX(-50%)" }
    }
  }

  const getAnimation = () => {
    switch (side) {
      case "top":
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 10 },
        }
      case "right":
        return {
          initial: { opacity: 0, x: -10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -10 },
        }
      case "left":
        return {
          initial: { opacity: 0, x: 10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 10 },
        }
      default:
        return {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
        }
    }
  }

  const animation = getAnimation()

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
              className,
            )}
            style={{
              ...getPosition(),
              ...getAlignment(),
            }}
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface TooltipMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
}

export function TooltipMenuItem({ children, icon, className, ...props }: TooltipMenuItemProps) {
  return (
    <motion.button
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
        className,
      )}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  )
}
