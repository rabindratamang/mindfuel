"use client"

import { useState } from "react"
import { Bell, Search, Sun, Moon, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { AnimatedIcon } from "@/components/animated-icon"

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { setTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <motion.header
      className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 flex-1">
        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        {/* Search - Mobile Toggle */}
        {searchOpen ? (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search..."
                className="w-full pl-9 h-9"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Search Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Desktop Search */}
            <div className="hidden md:block relative w-64 lg:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input placeholder="Search..." className="w-full pl-9 h-9" />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <AnimatedIcon icon={Bell} hoverEffect="shake" size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">No new notifications</div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <AnimatedIcon
                icon={Sun}
                hoverEffect="glow"
                size={18}
                className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              />
              <AnimatedIcon
                icon={Moon}
                hoverEffect="glow"
                size={18}
                className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                  <AvatarFallback className="text-xs sm:text-sm">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </motion.div>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a href="/dashboard/profile">Profile</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/dashboard/settings">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/logout">Logout</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
