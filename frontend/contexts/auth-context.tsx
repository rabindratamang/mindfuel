"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authService, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser()
        console.log("Auth initialization - currentUser:", currentUser) // Debug log
        if (currentUser) {
          setUser(currentUser)
        } else {
          // Try to refresh token if we have a refresh token
          const refreshToken = authService.getRefreshToken()
          if (refreshToken) {
            console.log("Attempting token refresh...") // Debug log
            await refreshToken()
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
        authService.clearTokens()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Auto-refresh token
  useEffect(() => {
    if (!user) return

    const token = authService.getAccessToken()
    if (!token) return

    // Set up token refresh 5 minutes before expiration
    const checkTokenExpiry = () => {
      if (authService.isTokenExpired(token)) {
        refreshToken()
      }
    }

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000)
    return () => clearInterval(interval)
  }, [user])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true)
        const { user: userData, tokens } = await authService.login(email, password)

        console.log("Login response - userData:", userData) // Debug log
        console.log("Login response - tokens:", tokens) // Debug log
        console.log("isOnboardComplete:", userData.isOnboardComplete) // Debug log
        
        authService.setTokens(tokens)
        setUser(userData)

        // Check if onboarding is complete - be explicit about the check
        if (userData.isOnboardComplete === false || userData.isOnboardComplete === undefined) {
          console.log("Redirecting to onboarding...") // Debug log
          router.push("/onboarding")
        } else {
          console.log("Redirecting to dashboard...") // Debug log
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Login failed:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  const register = useCallback(
    async (userData: {
      firstName: string
      lastName: string
      email: string
      password: string
    }) => {
      try {
        setIsLoading(true)
        const { user: newUser, tokens } = await authService.register(userData)

        authService.setTokens(tokens)
        setUser(newUser)

        // New users always go to onboarding first
        console.log("New user registered, redirecting to onboarding...") // Debug log
        router.push("/onboarding")
      } catch (error) {
        console.error("Registration failed:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      setUser(null)

      // Redirect to home page after logout
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const refreshToken = useCallback(async () => {
    try {
      const tokens = await authService.refreshAccessToken()
      authService.setTokens(tokens)

      const userData = authService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("Token refresh failed:", error)
      // If refresh fails, logout user
      authService.clearTokens()
      setUser(null)
      router.push("/login")
    }
  }, [router])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    login,
    register,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
