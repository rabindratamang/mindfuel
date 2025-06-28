"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/ui-kit/feedback/loading-spinner"

interface OnboardingGuardProps {
  children: React.ReactNode
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      console.log("OnboardingGuard - user:", user) // Debug log
      console.log("OnboardingGuard - isOnboardComplete:", user.isOnboardComplete) // Debug log

      // If user hasn't completed onboarding, redirect to onboarding
      if (user.isOnboardComplete === false || user.isOnboardComplete === undefined) {
        console.log("OnboardingGuard - Redirecting to onboarding...") // Debug log
        router.push("/onboarding")
        return
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If user hasn't completed onboarding, don't render dashboard
  if (user && (user.isOnboardComplete === false || user.isOnboardComplete === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}
