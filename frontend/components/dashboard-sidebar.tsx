"use client"

import type React from "react"
import { Brain, Home, BarChart, Moon, Sparkles, Settings, Bell, User, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AnimatedIcon } from "@/components/animated-icon"
import { motion } from "framer-motion"

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <motion.div
      className="h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-4">
        <div className="flex items-center gap-2">
          <AnimatedIcon icon={Brain} hoverEffect="pulse" color="#14b8a6" size={24} />
          <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">
            MindFuel
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="px-2 space-y-1">
          <SidebarLink href="/dashboard" icon={Home} label="Dashboard" isActive={isActive("/dashboard")} delay={0} />
          <SidebarLink
            href="/dashboard/mood"
            icon={BarChart}
            label="Mood Analysis"
            isActive={isActive("/dashboard/mood")}
            delay={0.1}
          />
          <SidebarLink
            href="/dashboard/meditation"
            icon={Sparkles}
            label="Meditation"
            isActive={isActive("/dashboard/meditation")}
            delay={0.2}
          />
          <SidebarLink
            href="/dashboard/sleep"
            icon={Moon}
            label="Sleep"
            isActive={isActive("/dashboard/sleep")}
            delay={0.3}
          />
          <SidebarLink
            href="/dashboard/notifications"
            icon={Bell}
            label="Notifications"
            isActive={isActive("/dashboard/notifications")}
            delay={0.4}
          />
          <SidebarLink
            href="/dashboard/profile"
            icon={User}
            label="Profile"
            isActive={isActive("/dashboard/profile")}
            delay={0.5}
          />
          <SidebarLink
            href="/dashboard/settings"
            icon={Settings}
            label="Settings"
            isActive={isActive("/dashboard/settings")}
            delay={0.6}
          />
        </nav>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 p-4">
        <SidebarLink href="/logout" icon={LogOut} label="Logout" isActive={false} delay={0} />
      </div>
    </motion.div>
  )
}

interface SidebarLinkProps {
  href: string
  icon: React.ComponentType<{ size?: number }>
  label: string
  isActive: boolean
  delay: number
}

function SidebarLink({ href, icon, label, isActive, delay }: SidebarLinkProps) {
  const hoverEffect = isActive ? "none" : "pulse"
  const iconColor = isActive ? "#14b8a6" : undefined

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay }}>
      <Link href={href}>
        <motion.div
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
            isActive
              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
          }`}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatedIcon icon={icon} hoverEffect={hoverEffect} color={iconColor} size={20} />
          <span>{label}</span>
        </motion.div>
      </Link>
    </motion.div>
  )
}
