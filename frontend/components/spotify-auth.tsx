"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, ExternalLink } from "lucide-react"
import { AnimatedIcon } from "@/components/animated-icon"

interface SpotifyAuthProps {
  onAuthenticated: () => void
}

export function SpotifyAuth({ onAuthenticated }: SpotifyAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleSpotifyAuth = () => {
    setIsAuthenticating(true)

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const redirectUri =
      process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || `${window.location.origin}/auth/spotify/callback`
    const scopes = [
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
    ].join("%20")

    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${Math.random().toString(36).substring(7)}`

    // Open Spotify auth in a popup
    const popup = window.open(authUrl, "spotify-auth", "width=500,height=600,scrollbars=yes,resizable=yes")

    // Listen for the popup to close (successful auth)
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed)
        setIsAuthenticating(false)

        // Check if we have a token now
        const token = localStorage.getItem("spotify_access_token")
        if (token) {
          onAuthenticated()
        }
      }
    }, 1000)

    // Listen for messages from the popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === "SPOTIFY_AUTH_SUCCESS") {
        // Store the tokens
        localStorage.setItem("spotify_access_token", event.data.access_token)
        localStorage.setItem("spotify_refresh_token", event.data.refresh_token)
        localStorage.setItem("spotify_token_expires", (Date.now() + event.data.expires_in * 1000).toString())

        popup?.close()
        clearInterval(checkClosed)
        setIsAuthenticating(false)
        onAuthenticated()
      } else if (event.data.type === "SPOTIFY_AUTH_ERROR") {
        popup?.close()
        clearInterval(checkClosed)
        setIsAuthenticating(false)
        console.error("Spotify auth error:", event.data.error)
      }
    }

    window.addEventListener("message", messageListener)

    // Cleanup
    setTimeout(() => {
      window.removeEventListener("message", messageListener)
      if (popup && !popup.closed) {
        popup.close()
        setIsAuthenticating(false)
      }
    }, 300000) // 5 minute timeout
  }

  return (
    <div className="p-6">
      <Card className="bg-gradient-to-br from-green-900/20 to-black border-green-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Music className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-xl">Connect to Spotify</CardTitle>
          <CardDescription className="text-gray-300">
            Connect your Spotify Premium account to play music directly in MindFuel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-400 space-y-2">
            <p>• Control playback without leaving the app</p>
            <p>• Access your playlists and recommendations</p>
            <p>• Seamless mood-based music experience</p>
            <p className="text-yellow-400">⚠️ Spotify Premium required for playback</p>
          </div>

          <Button
            onClick={handleSpotifyAuth}
            disabled={isAuthenticating}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isAuthenticating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <AnimatedIcon icon={ExternalLink} hoverEffect="bounce" size={16} />
                Connect Spotify Account
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By connecting, you agree to Spotify's Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
