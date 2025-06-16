"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Clock, User, ExternalLink, Music, BookOpen, Video } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedIcon } from "@/components/animated-icon"

interface ContentRecommendationsProps {
  mood: string
  moodScore: number
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
}

export function ContentRecommendations({ mood, moodScore }: ContentRecommendationsProps) {
  // Mock data - in real app, this would come from APIs based on mood
  const getContentForMood = (
    mood: string,
  ): { youtube: ContentItem[]; articles: ContentItem[]; spotify: ContentItem[] } => {
    const baseContent = {
      youtube: [
        {
          id: "1",
          title: "10 Minute Guided Meditation for Beginners",
          description: "A gentle introduction to meditation perfect for reducing stress and anxiety.",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "10:32",
          author: "Mindful Moments",
          url: "#",
          tags: ["meditation", "beginner", "stress-relief"],
          type: "youtube" as const,
        },
        {
          id: "2",
          title: "Breathing Exercises for Instant Calm",
          description: "Quick and effective breathing techniques to manage anxiety and stress.",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "8:15",
          author: "Wellness Guide",
          url: "#",
          tags: ["breathing", "anxiety", "quick-relief"],
          type: "youtube" as const,
        },
      ],
      articles: [
        {
          id: "3",
          title: "Understanding and Managing Anxiety: A Complete Guide",
          description: "Evidence-based strategies for coping with anxiety and building resilience.",
          thumbnail: "/placeholder.svg?height=120&width=200",
          author: "Dr. Sarah Johnson",
          url: "#",
          tags: ["psychology", "anxiety", "coping-strategies"],
          type: "article" as const,
        },
        {
          id: "4",
          title: "The Science of Mindfulness and Mental Health",
          description: "How mindfulness practices can improve your mental well-being.",
          thumbnail: "/placeholder.svg?height=120&width=200",
          author: "Mental Health Today",
          url: "#",
          tags: ["mindfulness", "science", "mental-health"],
          type: "article" as const,
        },
      ],
      spotify: [
        {
          id: "5",
          title: "Calm & Peaceful - Meditation Music",
          description: "Soothing instrumental music designed for meditation and relaxation.",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "2h 15m",
          author: "Peaceful Sounds",
          url: "#",
          tags: ["instrumental", "meditation", "relaxation"],
          type: "spotify" as const,
        },
        {
          id: "6",
          title: "Nature Sounds for Deep Sleep",
          description: "Natural ambient sounds to help you relax and unwind.",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "3h 45m",
          author: "Nature Audio",
          url: "#",
          tags: ["nature", "sleep", "ambient"],
          type: "spotify" as const,
        },
      ],
    }

    // Customize content based on mood
    if (mood.toLowerCase().includes("happy")) {
      return {
        youtube: [
          {
            id: "7",
            title: "Energizing Morning Yoga Flow",
            description: "Start your day with positive energy and movement.",
            thumbnail: "/placeholder.svg?height=120&width=200",
            duration: "15:20",
            author: "Yoga with Emma",
            url: "#",
            tags: ["yoga", "energy", "morning"],
            type: "youtube" as const,
          },
          ...baseContent.youtube,
        ],
        articles: [
          {
            id: "8",
            title: "Maintaining Your Positive Mindset",
            description: "Tips for sustaining happiness and positive thinking.",
            thumbnail: "/placeholder.svg?height=120&width=200",
            author: "Happiness Institute",
            url: "#",
            tags: ["positivity", "mindset", "happiness"],
            type: "article" as const,
          },
          ...baseContent.articles,
        ],
        spotify: [
          {
            id: "9",
            title: "Uplifting & Motivational Playlist",
            description: "Feel-good music to keep your spirits high.",
            thumbnail: "/placeholder.svg?height=120&width=200",
            duration: "1h 30m",
            author: "Good Vibes Only",
            url: "#",
            tags: ["uplifting", "motivational", "positive"],
            type: "spotify" as const,
          },
          ...baseContent.spotify,
        ],
      }
    }

    return baseContent
  }

  const content = getContentForMood(mood)

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
              <span>{item.author}</span>
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
          <Button size="sm" className="w-full group-hover:bg-teal-600 transition-colors">
            <AnimatedIcon icon={item.type === "youtube" ? Play : ExternalLink} hoverEffect="bounce" size={14} />
            {item.type === "youtube" ? "Watch Now" : item.type === "spotify" ? "Listen Now" : "Read Article"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (!mood) return null

  return (
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
            Based on your <strong>{mood}</strong> mood analysis, here are some curated recommendations to help you feel
            better
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
            {content.youtube.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
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
            {content.spotify.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
