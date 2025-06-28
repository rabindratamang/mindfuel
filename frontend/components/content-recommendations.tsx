"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, BookOpen, Music, Video, Clock, Star, TrendingUp, Sparkles, ChevronRight, User } from "lucide-react"
import { motion } from "framer-motion"
import { YouTubePlayer } from "@/components/youtube-player"

interface ContentRecommendationsProps {
  mood: string
  moodScore: number
  apiResponse?: any
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
  videoId?: string
  channelId?: string
  channelUrl?: string
  channelAvatar?: string
  durationSeconds?: number
  rating?: number
  relevance?: number
}

export function ContentRecommendations({ mood, moodScore, apiResponse }: ContentRecommendationsProps) {
  const [selectedVideo, setSelectedVideo] = useState<{ videoId: string; title: string } | null>(null)

  // Helper function to extract YouTube video ID from URL
  const extractVideoId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : ""
  }

  const getContentForMood = (
    mood: string,
    apiData?: any,
  ): { youtube: ContentItem[]; articles: ContentItem[]; spotify: ContentItem[] } => {
    // Use real YouTube data if available
    const youtubeContent: ContentItem[] = []
    if (
      apiData?.recommendations?.content?.youtube?.videos &&
      Array.isArray(apiData.recommendations.content.youtube.videos)
    ) {
      apiData.recommendations.content.youtube.videos.forEach((video: any) => {
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
          channelId: video.channel.channel_id,
          channelUrl: video.channel.channel_url,
          channelAvatar: video.channel.avatar,
          durationSeconds: video.duration_seconds,
          rating: 4.5 + Math.random() * 0.5, // Generate rating between 4.5-5.0
          relevance: 85 + Math.floor(Math.random() * 15), // Generate relevance 85-100%
        })
      })
    }

    // Use real Spotify data if available
    const spotifyContent: ContentItem[] = []
    if (apiData?.recommendations?.content?.spotify?.playlist?.playlists) {
      apiData.recommendations.content.spotify.playlist.playlists.slice(0, 6).forEach((playlist: any) => {
        spotifyContent.push({
          id: playlist.external_url,
          title: playlist.name,
          description: playlist?.description?.replace(/<[^>]*>/g, "") || "",
          thumbnail: playlist.image,
          duration: `${playlist.tracks?.total || 0} tracks`,
          author: playlist?.owner?.name || "",
          url: playlist.external_url,
          tags: apiData.recommendations.content.spotify.genres || [],
          type: "spotify" as const,
          rating: 4.2 + Math.random() * 0.8, // Generate rating between 4.2-5.0
          relevance: 80 + Math.floor(Math.random() * 20), // Generate relevance 80-100%
        })
      })
    }

    // Keep dummy articles data since API doesn't provide articles yet
    const articlesContent: ContentItem[] = []
    if (apiData?.recommendations?.content?.articles?.articles) {
      apiData.recommendations.content.articles.articles.forEach((article: any) => {
        articlesContent.push({
          id: article.news_url,
          title: article.title,
          description: article.snippet,
          thumbnail: article.thumbnail,
          author: article?.source?.name || "",
          channelUrl: article?.source?.url || "",
          url: article.news_url,
          tags: article.keywords || [],
          type: "article" as const,
        })
      })
    }

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
    } else {
      window.open(item.url, "_blank")
    }
  }

  const ContentCard = ({ item }: { item: ContentItem }) => {
    const getTypeIcon = () => {
      switch (item.type) {
        case "youtube":
          return Video
        case "spotify":
          return Music
        case "article":
          return BookOpen
        default:
          return BookOpen
      }
    }

    const getTypeColor = () => {
      switch (item.type) {
        case "youtube":
          return "bg-red-500"
        case "spotify":
          return "bg-green-500"
        case "article":
          return "bg-blue-500"
        default:
          return "bg-slate-500"
      }
    }

    const TypeIcon = getTypeIcon()

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200/50 dark:border-slate-700/50 hover:border-teal-200 dark:hover:border-teal-700 h-full flex flex-col">
          <div
            className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
            onClick={() => handleContentClick(item)}
          >
            <img
              src={item.thumbnail || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Type Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className={`${getTypeColor()} text-white backdrop-blur-sm`}>
                <TypeIcon className="w-3 h-3 mr-1" />
                {item.type === "youtube" ? "YouTube" : item.type === "spotify" ? "Spotify" : "Article"}
              </Badge>
            </div>

            {/* Duration */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
              <Clock className="w-3 h-3" />
              {item.duration}
            </div>

            {/* Play button overlay for YouTube videos */}
            {item.type === "youtube" && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-red-600 text-white rounded-full p-3 shadow-lg">
                  <Play className="w-6 h-6 fill-current" />
                </div>
              </div>
            )}
          </div>

          <CardContent className="p-4 flex-1 flex flex-col space-y-3">
            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-amber-500 flex-shrink-0">
                  <Star className="w-3 h-3 fill-current" />
                  {item.rating?.toFixed(1)}
                </div>
              </div>

              {/* Channel/Author info */}
              <div className="flex items-center gap-2">
                {item.channelAvatar ? (
                  <img
                    src={item.channelAvatar || "/placeholder.svg"}
                    alt={item.author}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User className="w-3 h-3 text-slate-500" />
                  </div>
                )}
                <span className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium">{item.author}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{item.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-sm"
                onClick={() => handleContentClick(item)}
              >
                <Play className="w-3 h-3 mr-1" />
                {item.type === "youtube" ? "Watch" : item.type === "spotify" ? "Listen" : "Read"}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>

              {/* Channel link for YouTube */}
              {item.type === "youtube" && item.channelUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="px-3"
                  onClick={() => window.open(item.channelUrl, "_blank")}
                >
                  <User className="w-3 h-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!mood) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-slate-200/50 dark:border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-blue-500/5" />
          <div className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Personalized Content for Your Mood
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Based on your <span className="font-medium text-teal-600 dark:text-teal-400">{mood}</span> mood
                      analysis
                    </p>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Here are some curated recommendations to help you maintain and enhance your current emotional state.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              YouTube Videos ({content.youtube.length})
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Articles ({content.articles.length})
            </TabsTrigger>
            <TabsTrigger value="spotify" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Music & Audio ({content.spotify.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.articles.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="spotify" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </>
  )
}
