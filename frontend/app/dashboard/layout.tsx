"use client"

import type React from "react"
import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { OnboardingGuard } from "@/components/auth/onboarding-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ProtectedRoute>
      <OnboardingGuard>
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <DashboardSidebar />
          </div>

          {/* Mobile Sidebar */}
          <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </OnboardingGuard>
    </ProtectedRoute>
  )
}
