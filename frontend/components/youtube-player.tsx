"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface YouTubePlayerProps {
  videoId: string
  title: string
  isOpen: boolean
  onClose: () => void
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function YouTubePlayer({ videoId, title, isOpen, onClose }: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([50])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isReady, setIsReady] = useState(false)

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        setIsReady(true)
      }
    } else {
      setIsReady(true)
    }
  }, [])

  // Initialize player when ready and dialog is open
  useEffect(() => {
    if (isReady && isOpen && playerRef.current && !player) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0, // Hide default controls
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target)
            setDuration(event.target.getDuration())
            setVolume([event.target.getVolume()])
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
          },
        },
      })
    }
  }, [isReady, isOpen, videoId, player])

  // Update current time
  useEffect(() => {
    if (player && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [player, isPlaying])

  // Cleanup player when dialog closes
  useEffect(() => {
    if (!isOpen && player) {
      player.destroy()
      setPlayer(null)
    }
  }, [isOpen, player])

  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
    }
  }

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute()
        setIsMuted(false)
      } else {
        player.mute()
        setIsMuted(true)
      }
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (player) {
      player.setVolume(value[0])
      setVolume(value)
      setIsMuted(value[0] === 0)
    }
  }

  const handleSeek = (value: number[]) => {
    if (player) {
      player.seekTo(value[0])
      setCurrentTime(value[0])
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const openFullscreen = () => {
    if (player) {
      // Open YouTube video in new tab for fullscreen
      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black border-gray-800 overflow-hidden">
        {/* Header with close button */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-lg truncate pr-4">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0 shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Container - Full height */}
        <div className="relative w-full h-full bg-black">
          <div ref={playerRef} className="w-full h-full" />

          {/* Loading overlay */}
          {!player && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-white/80">Loading video...</div>
              </div>
            </div>
          )}

          {/* Custom Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full [&_[role=slider]]:bg-teal-500 [&_[role=slider]]:border-teal-500 [&_.bg-primary]:bg-teal-500"
              />
              <div className="flex justify-between text-xs text-white/70 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="w-24">
                    <Slider
                      value={volume}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_.bg-primary]:bg-white/60"
                    />
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={openFullscreen}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
