import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Calendar, Sparkles } from "lucide-react"

export default function MeditationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meditation</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Personalized meditation sessions to reduce stress and improve mindfulness
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sessions"
          value="24"
          description="This month"
          icon={<Calendar className="h-4 w-4 text-sky-500" />}
        />
        <StatCard
          title="Meditation Time"
          value="5.2 hrs"
          description="This month"
          icon={<Clock className="h-4 w-4 text-sky-500" />}
        />
        <StatCard
          title="Current Streak"
          value="7 days"
          description="Personal best: 14"
          icon={<Sparkles className="h-4 w-4 text-sky-500" />}
        />
        <StatCard
          title="Stress Reduction"
          value="32%"
          description="Based on mood data"
          icon={<Sparkles className="h-4 w-4 text-sky-500" />}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-sky-500 to-blue-500" />
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>AI-generated meditation based on your recent mood patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden">
            <div className="aspect-video relative bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center">
              <Button
                size="lg"
                className="bg-white dark:bg-slate-900 text-sky-500 hover:text-sky-600 hover:bg-white/90 dark:hover:bg-slate-900/90 gap-2 rounded-full px-6"
              >
                <Play className="h-5 w-5 fill-current" />
                <span>Play Meditation</span>
              </Button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-lg">Calm Mind, Clear Focus</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    10-minute guided meditation for anxiety relief
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-sky-50 text-sky-500 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800"
                >
                  Recommended
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                This meditation focuses on breathing techniques to reduce anxiety and improve focus. Perfect for a
                mid-day reset.
              </p>
              <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>10 min</span>
                </div>
                <div>•</div>
                <div>Anxiety Relief</div>
                <div>•</div>
                <div>Breathing Focus</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recommended">
        <TabsList className="mb-4">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="recent">Recently Played</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="recommended" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MeditationCard
              title="Morning Clarity"
              description="Start your day with intention and focus"
              duration="5 min"
              tags={["Morning", "Focus"]}
            />
            <MeditationCard
              title="Stress Relief"
              description="Quick meditation for immediate anxiety reduction"
              duration="8 min"
              tags={["Stress", "Breathing"]}
            />
            <MeditationCard
              title="Deep Sleep Preparation"
              description="Wind down for a restful night's sleep"
              duration="15 min"
              tags={["Sleep", "Relaxation"]}
            />
            <MeditationCard
              title="Midday Reset"
              description="Refresh your mind during a busy day"
              duration="3 min"
              tags={["Quick", "Energy"]}
            />
            <MeditationCard
              title="Body Scan Relaxation"
              description="Release tension throughout your body"
              duration="12 min"
              tags={["Body", "Relaxation"]}
            />
            <MeditationCard
              title="Gratitude Practice"
              description="Cultivate appreciation and positivity"
              duration="7 min"
              tags={["Gratitude", "Positivity"]}
            />
          </div>
        </TabsContent>
        <TabsContent value="popular" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MeditationCard
              title="Anxiety Relief"
              description="The most popular meditation for anxiety"
              duration="10 min"
              tags={["Popular", "Anxiety"]}
            />
            <MeditationCard
              title="Deep Focus"
              description="Enhance concentration and productivity"
              duration="15 min"
              tags={["Focus", "Work"]}
            />
            <MeditationCard
              title="Quick Calm"
              description="Find peace in just 2 minutes"
              duration="2 min"
              tags={["Quick", "Calm"]}
            />
          </div>
        </TabsContent>
        <TabsContent value="recent" className="m-0">
          <div className="text-center text-slate-500 dark:text-slate-400 py-12">
            You haven't played any meditations yet.
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="m-0">
          <div className="text-center text-slate-500 dark:text-slate-400 py-12">
            You haven't added any favorites yet.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </CardContent>
    </Card>
  )
}

function MeditationCard({
  title,
  description,
  duration,
  tags,
}: {
  title: string
  description: string
  duration: string
  tags: string[]
}) {
  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-0">
        <div className="aspect-video relative bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center">
          <Button
            size="sm"
            variant="ghost"
            className="bg-white/80 dark:bg-slate-900/80 text-sky-500 hover:text-sky-600 hover:bg-white/90 dark:hover:bg-slate-900/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="h-4 w-4 fill-current" />
          </Button>
        </div>
        <div className="p-4">
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{duration}</span>
            </div>
            <div className="flex gap-1">
              {tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
