import { jwtDecode } from "jwt-decode"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface JWTPayload {
  sub: string
  email: string
  firstName: string
  lastName: string
  exp: number
  iat: number
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = "mindfuel_access_token"
  private readonly REFRESH_TOKEN_KEY = "mindfuel_refresh_token"
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  // Token management
  setTokens(tokens: AuthTokens): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken)
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY)
    }
    return null
  }

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }
    return null
  }

  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    }
  }

  // Token validation
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch {
      return true
    }
  }

  // Get user from token
  getUserFromToken(token: string): User | null {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      return {
        id: decoded.sub,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        isOnboardComplete: decoded.isOnboardComplete,
      }
    } catch {
      return null
    }
  }

  // API calls
  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    const data = await response.json()
    return data
  }

  async register(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Registration failed")
    }

    const data = await response.json()
    return data
  }

  async refreshAccessToken(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await fetch(`${this.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Token refresh failed")
    }

    const data = await response.json()
    return data.tokens
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken()
    if (refreshToken) {
      try {
        await fetch(`${this.API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        })
      } catch (error) {
        console.error("Logout API call failed:", error)
      }
    }
    this.clearTokens()
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    return token !== null && !this.isTokenExpired(token)
  }

  // Get current user
  getCurrentUser(): User | null {
    const token = this.getAccessToken()
    if (!token || this.isTokenExpired(token)) {
      return null
    }
    return this.getUserFromToken(token)
  }
}

export const authService = new AuthService()
