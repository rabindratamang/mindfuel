"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type SidebarContextValue = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "floating"
  collapsible?: boolean | "icon"
}

export function Sidebar({ className, variant = "default", collapsible = false, children, ...props }: SidebarProps) {
  const { isOpen, setIsOpen, isCollapsed, setIsCollapsed } = useSidebar()

  return (
    <>
      {variant === "floating" && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 md:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      )}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 md:relative",
          variant === "floating" && "shadow-lg",
          variant === "floating" && isOpen ? "w-64" : "w-0 md:w-auto",
          isCollapsed && collapsible === true && "md:w-20",
          isCollapsed && collapsible === "icon" && "md:w-16",
          className,
        )}
        animate={{
          width: isOpen
            ? "16rem"
            : isCollapsed
              ? collapsible === "icon"
                ? "4rem"
                : "5rem"
              : variant === "floating"
                ? "0"
                : "16rem",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        {...props}
      >
        {children}
      </motion.div>
    </>
  )
}

export function SidebarHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      className={cn("flex h-14 items-center border-b border-slate-200 dark:border-slate-800 px-4", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SidebarContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-auto", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center border-t border-slate-200 dark:border-slate-800 p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenu({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1 px-2 py-2", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenuItem({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  tooltip?: string
  asChild?: boolean
}

export function SidebarMenuButton({
  className,
  isActive,
  tooltip,
  asChild = false,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { isCollapsed } = useSidebar()

  // If asChild is true, we need to clone the child element instead of using React.Fragment
  if (asChild) {
    // Clone the child and merge the props
    const child = React.Children.only(children) as React.ReactElement
    return (
      <div className="relative group">
        {React.cloneElement(child, {
          className: cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full",
            isActive
              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50",
            className,
            child.props.className,
          ),
          ...props,
        })}
        {tooltip && isCollapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-slate-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {tooltip}
          </div>
        )}
      </div>
    )
  }

  // If not using asChild, render a button
  return (
    <div className="relative group">
      <motion.button
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full",
          isActive
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium"
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50",
          className,
        )}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
          duration: 0.2,
        }}
        {...props}
      >
        {children}
      </motion.button>
      {tooltip && isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-slate-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  )
}

export function SidebarTrigger() {
  const { isOpen, setIsOpen } = useSidebar()

  return (
    <button
      className="md:hidden flex items-center justify-center rounded-md w-8 h-8 hover:bg-slate-100 dark:hover:bg-slate-800"
      onClick={() => setIsOpen(!isOpen)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="15" y1="3" y2="3" />
        <line x1="9" x2="15" y1="21" y2="21" />
        <line x1="3" x2="3" y1="9" y2="15" />
        <line x1="21" x2="21" y1="9" y2="15" />
      </svg>
    </button>
  )
}

export function SidebarRail() {
  const { isCollapsed, setIsCollapsed } = useSidebar()

  return (
    <div
      className="absolute -right-[5px] top-1/2 -translate-y-1/2 hidden md:flex h-16 items-center"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <motion.div
        className="w-[10px] h-10 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
    </div>
  )
}
