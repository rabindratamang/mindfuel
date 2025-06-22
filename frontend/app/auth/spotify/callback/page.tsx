"use client"
import { useEffect } from "react"
import { spotifyAuth } from "@/lib/spotify-auth"

export default function SpotifyCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")
    const error = urlParams.get("error")

    if (error) {
      if (window.opener) {
        window.opener.postMessage({ type: "SPOTIFY_AUTH_ERROR", error }, window.location.origin)
      }
      window.close()
      return
    }

    if (code) {
      spotifyAuth.exchangeCodeForToken(code).then((tokens) => {
        if (window.opener) {
          window.opener.postMessage({ 
            type: "SPOTIFY_AUTH_SUCCESS", 
            ...tokens 
          }, window.location.origin)
        }
        window.close()
      }).catch((error) => {
        if (window.opener) {
          window.opener.postMessage({ type: "SPOTIFY_AUTH_ERROR", error: error.message }, window.location.origin)
        }
        window.close()
      })
    }
  }, [])

  return <div>Processing Spotify authentication...</div>
}