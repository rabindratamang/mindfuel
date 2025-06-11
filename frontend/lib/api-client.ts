import { authService } from "./auth"

class ApiClient {
  private readonly baseURL: string
  private refreshPromise: Promise<void> | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = authService.getAccessToken()
    if (!token) {
      return {}
    }

    // Check if token is expired and refresh if needed
    if (authService.isTokenExpired(token)) {
      await this.refreshTokenIfNeeded()
      const newToken = authService.getAccessToken()
      return newToken ? { Authorization: `Bearer ${newToken}` } : {}
    }

    return { Authorization: `Bearer ${token}` }
  }

  private async refreshTokenIfNeeded(): Promise<void> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = (async () => {
      try {
        const tokens = await authService.refreshAccessToken()
        authService.setTokens(tokens)
      } catch (error) {
        // If refresh fails, clear tokens and redirect to login
        authService.clearTokens()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw error
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const authHeaders = await this.getAuthHeaders()

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      // Handle 401 Unauthorized - try to refresh token once
      if (response.status === 401 && authService.getRefreshToken()) {
        await this.refreshTokenIfNeeded()

        // Retry the request with new token
        const newAuthHeaders = await this.getAuthHeaders()
        const retryConfig: RequestInit = {
          ...config,
          headers: {
            ...config.headers,
            ...newAuthHeaders,
          },
        }

        const retryResponse = await fetch(url, retryConfig)
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`)
        }

        return retryResponse.json()
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Convenience methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
