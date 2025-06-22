// Spotify API configuration
export const SPOTIFY_CONFIG = {
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    redirectUri:
      process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
      `${typeof window !== "undefined" ? window.location.origin : ""}/auth/spotify/callback`,
    scopes: [
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
    ],
  }
  
  export class SpotifyAuthService {
    private static instance: SpotifyAuthService
  
    static getInstance(): SpotifyAuthService {
      if (!SpotifyAuthService.instance) {
        SpotifyAuthService.instance = new SpotifyAuthService()
      }
      return SpotifyAuthService.instance
    }
  
    async exchangeCodeForToken(code: string): Promise<{
      access_token: string
      refresh_token: string
      expires_in: number
    }> {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`)}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: SPOTIFY_CONFIG.redirectUri,
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to exchange code for token")
      }
  
      return response.json()
    }
  
    async refreshAccessToken(refreshToken: string): Promise<{
      access_token: string
      expires_in: number
    }> {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`)}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to refresh access token")
      }
  
      return response.json()
    }
  
    getValidAccessToken(): string | null {
      const token = localStorage.getItem("spotify_access_token")
      const expiresAt = localStorage.getItem("spotify_token_expires")
  
      if (!token || !expiresAt) {
        return null
      }
  
      // Check if token is expired (with 5 minute buffer)
      if (Date.now() >= Number.parseInt(expiresAt) - 300000) {
        this.refreshTokenIfNeeded()
        return null
      }
  
      return token
    }
  
    private async refreshTokenIfNeeded(): Promise<void> {
      const refreshToken = localStorage.getItem("spotify_refresh_token")
      if (!refreshToken) {
        this.clearTokens()
        return
      }
  
      try {
        const { access_token, expires_in } = await this.refreshAccessToken(refreshToken)
  
        localStorage.setItem("spotify_access_token", access_token)
        localStorage.setItem("spotify_token_expires", (Date.now() + expires_in * 1000).toString())
      } catch (error) {
        console.error("Failed to refresh Spotify token:", error)
        this.clearTokens()
      }
    }
  
    clearTokens(): void {
      localStorage.removeItem("spotify_access_token")
      localStorage.removeItem("spotify_refresh_token")
      localStorage.removeItem("spotify_token_expires")
    }
  
    isAuthenticated(): boolean {
      return !!this.getValidAccessToken()
    }
  }
  
  export const spotifyAuth = SpotifyAuthService.getInstance()
  