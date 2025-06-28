"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Clock, User, ExternalLink, Music, BookOpen, Video } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedIcon } from "@/components/animated-icon"
import { YouTubePlayer } from "@/components/youtube-player"
import { SpotifyPlayer } from "@/components/spotify-player"
import { useState } from "react"

interface ContentRecommendationsProps {
  mood: string
  moodScore: number
  apiResponse?: any // Add this to receive the full API response
}

interface ContentItem {
  id: string
  title: string
  description: string
  thumbnail: string
  duration?: string
  author: string
  url: string
  tags: string[]
  type: "youtube" | "article" | "spotify"
  videoId?: string // Add this for YouTube videos
  spotifyUri?: string // Add this for Spotify content
}

export function ContentRecommendations({ mood, moodScore, apiResponse }: ContentRecommendationsProps) {
  const [selectedVideo, setSelectedVideo] = useState<{ videoId: string; title: string } | null>(null)
  const [selectedSpotify, setSelectedSpotify] = useState<{
    uri: string
    title: string
    artist: string
    image: string
  } | null>(null)

  // Helper function to extract YouTube video ID from URL
  const extractVideoId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : ""
  }

  // Helper function to extract Spotify URI from URL
  const extractSpotifyUri = (url: string): string => {
    const match = url.match(/spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/)
    return match ? `spotify:${match[1]}:${match[2]}` : ""
  }

  const getContentForMood = (
    mood: string,
    apiData?: any,
  ): { youtube: ContentItem[]; articles: ContentItem[]; spotify: ContentItem[] } => {
    // Use real YouTube data if available
    const youtubeContent: ContentItem[] = []
    if (apiData?.recommendations?.content?.youtube?.video) {
      const video = apiData.recommendations.content.youtube.video
      const videoId = extractVideoId(video.video_url)

      youtubeContent.push({
        id: video.video_url,
        title: video.title,
        description: `${video.channel.title} • ${Math.floor(video.duration_seconds / 60)}:${(video.duration_seconds % 60).toString().padStart(2, "0")}`,
        thumbnail: video.thumbnail,
        duration: `${Math.floor(video.duration_seconds / 60)}:${(video.duration_seconds % 60).toString().padStart(2, "0")}`,
        author: video.channel.title,
        url: video.video_url,
        tags: apiData.recommendations.content.youtube.keywords || [],
        type: "youtube" as const,
        videoId: videoId,
      })
    }

    // Use real Spotify data if available
    const spotifyContent: ContentItem[] = []
    if (apiData?.recommendations?.content?.spotify?.playlist?.playlists) {
      apiData.recommendations.content.spotify.playlist.playlists.slice(0, 6).forEach((playlist: any) => {
        const spotifyUri = extractSpotifyUri(playlist.external_url)

        spotifyContent.push({
          id: playlist.external_url,
          title: playlist.name,
          description: playlist.description.replace(/<[^>]*>/g, ""), // Remove HTML tags
          thumbnail: playlist.thumbnail,
          duration: "",
          author: playlist.artist?.name || "Various Artists",
          url: playlist.external_url,
          tags: apiData.recommendations.content.spotify.genres || [],
          type: "spotify" as const,
          spotifyUri: spotifyUri,
        })
      })
    }

    // Keep dummy articles data since API doesn't provide articles yet
    const articlesContent: ContentItem[] = [
      {
        id: "3",
        title: "Understanding and Managing Sadness",
        description: "Evidence-based strategies for coping with difficult emotions and building emotional resilience.",
        thumbnail: "/placeholder.svg?height=120&width=200",
        author: "Dr. Sarah Johnson",
        url: "#",
        tags: apiData?.recommendations?.content?.articles?.topics || ["self-help", "mindfulness"],
        type: "article" as const,
      },
      {
        id: "4",
        title: "The Science of Emotional Healing",
        description: "How understanding your emotions can lead to better mental health and well-being.",
        thumbnail: "/placeholder.svg?height=120&width=200",
        author: "Mental Health Research Institute",
        url: "#",
        tags: apiData?.recommendations?.content?.articles?.focus || ["coping-strategies", "understanding-emotions"],
        type: "article" as const,
      },
    ]

    return {
      youtube: youtubeContent,
      articles: articlesContent,
      spotify: spotifyContent,
    }
  }

  const content = getContentForMood(mood, apiResponse)

  const handleContentClick = (item: ContentItem) => {
    if (item.type === "youtube" && item.videoId) {
      setSelectedVideo({ videoId: item.videoId, title: item.title })
    } else if (item.type === "spotify" && item.spotifyUri) {
      setSelectedSpotify({
        uri: item.spotifyUri,
        title: item.title,
        artist: item.author,
        image: item.thumbnail,
      })
    } else {
      window.open(item.url, "_blank")
    }
  }

  const ContentCard = ({ item }: { item: ContentItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 group">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={item.thumbnail || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Play button overlay */}
          {(item.type === "youtube" || item.type === "spotify") && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`${item.type === "youtube" ? "bg-red-600" : "bg-green-600"} text-white rounded-full p-3`}>
                <Play className="w-6 h-6 fill-current" />
              </div>
            </div>
          )}

          {item.type === "youtube" && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              <Video className="w-3 h-3 inline mr-1" />
              YouTube
            </div>
          )}
          {item.type === "spotify" && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
              <Music className="w-3 h-3 inline mr-1" />
              Spotify
            </div>
          )}
          {item.type === "article" && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
              <BookOpen className="w-3 h-3 inline mr-1" />
              Article
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="truncate">{item.author}</span>
            </div>
            {item.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{item.duration}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Button
            size="sm"
            className="w-full group-hover:bg-teal-600 transition-colors"
            onClick={() => handleContentClick(item)}
          >
            <AnimatedIcon icon={item.type === "youtube" ? Play : ExternalLink} hoverEffect="bounce" size={14} />
            {item.type === "youtube" ? "Watch Now" : item.type === "spotify" ? "Listen Now" : "Read Article"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (!mood) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card className="bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/20 border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
              <AnimatedIcon icon={Play} hoverEffect="pulse" size={20} />
              Personalized Content for Your Mood
            </CardTitle>
            <CardDescription className="text-teal-600 dark:text-teal-400">
              Based on your <strong>{mood}</strong> mood analysis, here are some curated recommendations to help you
              feel better
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              YouTube Videos
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="spotify" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Music & Audio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.youtube.length > 0 ? (
                content.youtube.map((item) => <ContentCard key={item.id} item={item} />)
              ) : (
                <div className="col-span-full text-center text-slate-500 py-8">
                  No YouTube recommendations available at the moment.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.articles.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="spotify" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.spotify.length > 0 ? (
                content.spotify.map((item) => <ContentCard key={item.id} item={item} />)
              ) : (
                <div className="col-span-full text-center text-slate-500 py-8">
                  No Spotify recommendations available at the moment.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* YouTube Player Modal */}
      {selectedVideo && (
        <YouTubePlayer
          videoId={selectedVideo.videoId}
          title={selectedVideo.title}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Spotify Player Modal */}
      {selectedSpotify && (
        <SpotifyPlayer
          uri={selectedSpotify.uri}
          title={selectedSpotify.title}
          artist={selectedSpotify.artist}
          image={selectedSpotify.image}
          isOpen={!!selectedSpotify}
          onClose={() => setSelectedSpotify(null)}
        />
      )}
    </>
  )
}
