"use client"

import type React from "react"
import { Brain, Home, BarChart, Moon, Sparkles, Settings, Bell, User, LogOut, X, Smile, MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AnimatedIcon } from "@/components/animated-icon"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = async () => {
    await logout()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 lg:hidden"
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <AnimatedIcon icon={Brain} hoverEffect="pulse" color="#14b8a6" size={24} />
                <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">
                  MindFuel
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-4">
              <nav className="px-2 space-y-1">
                <MobileSidebarLink
                  href="/dashboard"
                  icon={Home}
                  label="Dashboard"
                  isActive={isActive("/dashboard")}
                  onClick={onClose}
                />
                <MobileSidebarLink
                  href="/dashboard/chat"
                  icon={MessageCircle}
                  label="Chat with AI"
                  isActive={isActive("/dashboard/chat")}
                  onClick={onClose}
                />
                <MobileSidebarLink
                  href="/dashboard/mood"
                  icon={Smile}
                  label="Mood Analysis"
                  isActive={isActive("/dashboard/mood")}
                  onClick={onClose}
                />
                <MobileSidebarLink
                  href="/dashboard/meditation"
                  icon={Sparkles}
                  label="Meditation"
                  isActive={isActive("/dashboard/meditation")}
                  onClick={onClose}
                />
                <MobileSidebarLink
                  href="/dashboard/sleep"
                  icon={Moon}
                  label="Sleep"
                  isActive={isActive("/dashboard/sleep")}
                  onClick={onClose}
                />
                <MobileSidebarLink
                  href="/dashboard/notifications"
                  icon={Bell}
                  label="Notifications"
                  isActive={isActive("/dashboard/notifications")}
                  onClick={onClose}
                />
                <MobileSidebarLink
                  href="/dashboard/profile"
                  icon={User}
                  label="Profile"
                  isActive={isActive("/dashboard/profile")}
                  onClick={onClose}
                />
                <MobileSidebarLink
                  href="/dashboard/settings"
                  icon={Settings}
                  label="Settings"
                  isActive={isActive("/dashboard/settings")}
                  onClick={onClose}
                />
              </nav>
            </div>

            {/* Logout */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface MobileSidebarLinkProps {
  href: string
  icon: React.ComponentType<{ size?: number }>
  label: string
  isActive: boolean
  onClick: () => void
}

function MobileSidebarLink({ href, icon, label, isActive, onClick }: MobileSidebarLinkProps) {
  const hoverEffect = isActive ? "none" : "pulse"
  const iconColor = isActive ? "#14b8a6" : undefined

  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm ${
          isActive
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium"
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
        }`}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatedIcon icon={icon} hoverEffect={hoverEffect} color={iconColor} size={20} />
        <span>{label}</span>
      </motion.div>
    </Link>
  )
}
