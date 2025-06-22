"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, ExternalLink, X } from "lucide-react"
import { motion } from "framer-motion"
import { SpotifyAuth } from "@/components/spotify-auth"

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: any
  }
}

interface SpotifyPlayerProps {
  uri: string
  title: string
  artist: string
  image: string
  isOpen: boolean
  onClose: () => void
}

interface Track {
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string; width: number; height: number }>
  }
  duration_ms: number
  uri: string
}

interface PlayerState {
  paused: boolean
  position: number
  duration: number
  track_window: {
    current_track: Track
    next_tracks: Track[]
    previous_tracks: Track[]
  }
  shuffle: boolean
  repeat_mode: number
}

export function SpotifyPlayer({ uri, title, artist, image, isOpen, onClose }: SpotifyPlayerProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [player, setPlayer] = useState<any>(null)
  const [deviceId, setDeviceId] = useState<string>("")
  const [playerState, setPlayerState] = useState<PlayerState | null>(null)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const intervalRef = useRef<NodeJS.Timeout>()

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token")
    setIsAuthenticated(!!token)
  }, [])

  // Load Spotify Web Playback SDK
  useEffect(() => {
    if (!isAuthenticated || isSDKLoaded) return

    const script = document.createElement("script")
    script.src = "https://sdk.scdn.co/spotify-player.js"
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      setIsSDKLoaded(true)
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [isAuthenticated, isSDKLoaded])

  // Initialize Spotify Player
  useEffect(() => {
    if (!isSDKLoaded || !isAuthenticated || player) return

    const token = localStorage.getItem("spotify_access_token")
    if (!token) return

    const spotifyPlayer = new window.Spotify.Player({
      name: "MindFuel Player",
      getOAuthToken: (cb: (token: string) => void) => {
        cb(token)
      },
      volume: volume / 100,
    })

    // Player ready
    spotifyPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
      console.log("Ready with Device ID", device_id)
      setDeviceId(device_id)
      setIsLoading(false)
    })

    // Player not ready
    spotifyPlayer.addListener("not_ready", ({ device_id }: { device_id: string }) => {
      console.log("Device ID has gone offline", device_id)
    })

    // Player state changed
    spotifyPlayer.addListener("player_state_changed", (state: PlayerState) => {
      if (!state) return
      setPlayerState(state)
    })

    // Initialization error
    spotifyPlayer.addListener("initialization_error", ({ message }: { message: string }) => {
      console.error("Initialization Error:", message)
      setError("Failed to initialize Spotify player")
      setIsLoading(false)
    })

    // Authentication error
    spotifyPlayer.addListener("authentication_error", ({ message }: { message: string }) => {
      console.error("Authentication Error:", message)
      setError("Spotify authentication failed")
      setIsAuthenticated(false)
      setIsLoading(false)
    })

    // Account error
    spotifyPlayer.addListener("account_error", ({ message }: { message: string }) => {
      console.error("Account Error:", message)
      setError("Spotify Premium required for playback")
      setIsLoading(false)
    })

    // Connect to player
    spotifyPlayer.connect().then((success: boolean) => {
      if (success) {
        console.log("Successfully connected to Spotify!")
        setPlayer(spotifyPlayer)
      } else {
        console.error("Failed to connect to Spotify")
        setError("Failed to connect to Spotify")
        setIsLoading(false)
      }
    })

    return () => {
      if (spotifyPlayer) {
        spotifyPlayer.disconnect()
      }
    }
  }, [isSDKLoaded, isAuthenticated, player, volume])

  // Start playback when device is ready and URI is provided
  useEffect(() => {
    if (!deviceId || !uri || !isAuthenticated) return

    const token = localStorage.getItem("spotify_access_token")
    if (!token) return

    const startPlayback = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: "PUT",
          body: JSON.stringify({
            context_uri: uri,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to start playback")
        }
      } catch (error) {
        console.error("Error starting playback:", error)
        setError("Failed to start playback")
      }
    }

    startPlayback()
  }, [deviceId, uri, isAuthenticated])

  // Update progress
  useEffect(() => {
    if (playerState && !playerState.paused) {
      intervalRef.current = setInterval(() => {
        if (player) {
          player.getCurrentState().then((state: PlayerState) => {
            if (state) {
              setPlayerState(state)
            }
          })
        }
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [playerState, player])

  const togglePlay = () => {
    if (!player) return
    player.togglePlay()
  }

  const skipTrack = (direction: "next" | "previous") => {
    if (!player) return
    if (direction === "next") {
      player.nextTrack()
    } else {
      player.previousTrack()
    }
  }

  const seek = (position: number) => {
    if (!player || !playerState) return
    const seekPosition = (position / 100) * playerState.duration
    player.seek(seekPosition)
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0]
    setVolume(vol)
    if (player) {
      player.setVolume(vol / 100)
    }
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(50)
      if (player) player.setVolume(0.5)
      setIsMuted(false)
    } else {
      setVolume(0)
      if (player) player.setVolume(0)
      setIsMuted(true)
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const currentTrack = playerState?.track_window?.current_track
  const progress = playerState ? (playerState.position / playerState.duration) * 100 : 0

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-black border-gray-800">
          <SpotifyAuth onAuthenticated={() => setIsAuthenticated(true)} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black border-gray-800 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </Button>

          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4" />
                <p className="text-white">Loading Spotify Player...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Button
                  onClick={() => window.open(uri.replace("spotify:", "https://open.spotify.com/"), "_blank")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Spotify
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Album Art Background */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={currentTrack?.album?.images?.[0]?.url || image}
                  alt={currentTrack?.name || title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Track Info Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-white">
                    <h2 className="text-3xl font-bold mb-2 line-clamp-2">{currentTrack?.name || title}</h2>
                    <p className="text-xl text-gray-300 mb-4">
                      {currentTrack?.artists?.map((a) => a.name).join(", ") || artist}
                    </p>
                    <p className="text-gray-400">{currentTrack?.album?.name || "Playlist"}</p>
                  </motion.div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-gradient-to-t from-black to-gray-900 px-6 py-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={1}
                    onValueChange={(value) => seek(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(playerState?.position || 0)}</span>
                    <span>{formatTime(playerState?.duration || 0)}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skipTrack("previous")}
                    className="text-white hover:bg-white/10"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/10 w-12 h-12"
                  >
                    {playerState?.paused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skipTrack("next")}
                    className="text-white hover:bg-white/10"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                {/* Additional Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                      <Shuffle className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                      <Repeat className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/10">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="w-24">
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      window.open(
                        currentTrack?.uri?.replace("spotify:", "https://open.spotify.com/") ||
                          uri.replace("spotify:", "https://open.spotify.com/"),
                        "_blank",
                      )
                    }
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Spotify
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
