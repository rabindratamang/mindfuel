"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageGallery } from "@/components/ui-kit/media/image-gallery"
import { AvatarGroup } from "@/components/ui-kit/media/avatar-group"

// Sample data
const galleryImages = [
  {
    id: "1",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Peaceful meditation garden",
    caption: "Find your inner peace in nature",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Sunrise yoga session",
    caption: "Start your day with mindful movement",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Cozy reading nook",
    caption: "Create a space for reflection and learning",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Breathing exercise illustration",
    caption: "Visual guide to deep breathing techniques",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Mindfulness journal",
    caption: "Document your wellness journey",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Sleep sanctuary",
    caption: "Design your perfect sleep environment",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

const teamMembers = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    src: "/placeholder.svg?height=40&width=40",
    fallback: "SJ",
  },
  {
    id: "2",
    name: "Michael Chen",
    src: "/placeholder.svg?height=40&width=40",
    fallback: "MC",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    src: "/placeholder.svg?height=40&width=40",
    fallback: "ER",
  },
  {
    id: "4",
    name: "David Kim",
    src: "/placeholder.svg?height=40&width=40",
    fallback: "DK",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    src: "/placeholder.svg?height=40&width=40",
    fallback: "LT",
  },
]

const communityMembers = [
  {
    id: "1",
    name: "Alex Morgan",
    src: "/placeholder.svg?height=32&width=32",
    fallback: "AM",
  },
  {
    id: "2",
    name: "Jordan Lee",
    src: "/placeholder.svg?height=32&width=32",
    fallback: "JL",
  },
  {
    id: "3",
    name: "Taylor Swift",
    src: "/placeholder.svg?height=32&width=32",
    fallback: "TS",
  },
  {
    id: "4",
    name: "Casey Jones",
    src: "/placeholder.svg?height=32&width=32",
    fallback: "CJ",
  },
  {
    id: "5",
    name: "Riley Brown",
    src: "/placeholder.svg?height=32&width=32",
    fallback: "RB",
  },
  {
    id: "6",
    name: "Morgan Davis",
    src: "/placeholder.svg?height=32&width=32",
    fallback: "MD",
  },
  {
    id: "7",
    name: "Jamie Wilson",
    src: "/placeholder.svg?height=32&width=32",
    fallback: "JW",
  },
  {
    id: "8",
    name: "Avery Garcia",
    src: "/placeholder.svg?height=32&width=32",
    fallback: "AG",
  },
]

export default function MediaShowcase() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight">Media Showcase</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Image galleries, avatar groups, and media components</p>
      </motion.div>

      {/* Image Galleries */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Image Galleries</h2>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3-Column Gallery with Lightbox</CardTitle>
            <CardDescription>Click on any image to open the lightbox viewer</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageGallery images={galleryImages} columns={3} gap="md" showCaptions={true} lightbox={true} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>2-Column Gallery</CardTitle>
              <CardDescription>Larger images in a 2-column layout</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={galleryImages.slice(0, 4)}
                columns={2}
                gap="lg"
                showCaptions={true}
                lightbox={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4-Column Compact</CardTitle>
              <CardDescription>Compact gallery without captions</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={galleryImages.slice(0, 8)}
                columns={4}
                gap="sm"
                showCaptions={false}
                lightbox={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Avatar Groups */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Avatar Groups</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Display team members with tooltips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Large Avatars</h4>
                <AvatarGroup avatars={teamMembers} size="lg" spacing="normal" showTooltip={true} max={4} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Medium Avatars</h4>
                <AvatarGroup avatars={teamMembers} size="md" spacing="normal" showTooltip={true} max={5} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Small Avatars</h4>
                <AvatarGroup avatars={teamMembers} size="sm" spacing="tight" showTooltip={true} max={6} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Members</CardTitle>
              <CardDescription>Large group with overflow indicator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Active Members (Max 5)</h4>
                <AvatarGroup avatars={communityMembers} size="md" spacing="normal" showTooltip={true} max={5} />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Showing 5 of {communityMembers.length} members
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Compact View (Max 3)</h4>
                <AvatarGroup avatars={communityMembers} size="sm" spacing="tight" showTooltip={true} max={3} />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {communityMembers.length - 3} more members in this group
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">No Limit</h4>
                <AvatarGroup
                  avatars={communityMembers.slice(0, 6)}
                  size="sm"
                  spacing="loose"
                  showTooltip={false}
                  max={10}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Real-world Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Real-world Media Examples</CardTitle>
          <CardDescription>Common use cases for media components in wellness apps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Meditation Guide Gallery */}
            <div>
              <h4 className="font-medium mb-4">Meditation Guides</h4>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="font-medium">Visual Meditation Guides</h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Step-by-step visual instructions for meditation techniques
                    </p>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{galleryImages.length} guides</div>
                </div>
                <ImageGallery images={galleryImages} columns={4} gap="sm" showCaptions={false} lightbox={true} />
              </div>
            </div>

            {/* Session Participants */}
            <div>
              <h4 className="font-medium mb-4">Group Session Participants</h4>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="font-medium">Mindfulness Circle</h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Join others in today's group meditation session
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AvatarGroup avatars={communityMembers} size="sm" spacing="tight" showTooltip={true} max={4} />
                    <span className="text-sm text-slate-500 dark:text-slate-400">{communityMembers.length} joined</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-teal-500 text-white text-sm rounded">Join Session</button>
                  <button className="px-3 py-1 border text-sm rounded">View Details</button>
                </div>
              </div>
            </div>

            {/* Wellness Journey Gallery */}
            <div>
              <h4 className="font-medium mb-4">Wellness Journey</h4>
              <div className="p-4 border rounded-lg">
                <div className="mb-4">
                  <h5 className="font-medium">Your Progress Photos</h5>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Document your wellness journey with photos and reflections
                  </p>
                </div>
                <ImageGallery
                  images={galleryImages.slice(0, 3)}
                  columns={3}
                  gap="md"
                  showCaptions={true}
                  lightbox={true}
                />
                <div className="mt-4 flex justify-center">
                  <button className="px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 text-sm rounded-lg hover:border-teal-500 transition-colors">
                    + Add Progress Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Expert Team */}
            <div>
              <h4 className="font-medium mb-4">Meet Our Experts</h4>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="font-medium">Mental Health Professionals</h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Our certified team is here to support your journey
                    </p>
                  </div>
                  <AvatarGroup avatars={teamMembers} size="lg" spacing="normal" showTooltip={true} max={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teamMembers.slice(0, 3).map((member) => (
                    <div key={member.id} className="text-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-lg font-medium">{member.fallback}</span>
                      </div>
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Licensed Therapist</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
