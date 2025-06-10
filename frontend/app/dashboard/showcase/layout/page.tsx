"use client"

import { motion } from "framer-motion"
import { Sparkles, Zap, Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GridContainer } from "@/components/ui-kit/layout/grid-container"
import { SectionDivider } from "@/components/ui-kit/layout/section-divider"

export default function LayoutShowcase() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight">Layout Showcase</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Grid systems, dividers, and layout components</p>
      </motion.div>

      {/* Grid Containers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Grid Containers</h2>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Responsive Grid (1-2-3 columns)</CardTitle>
            <CardDescription>Automatically adjusts from 1 column on mobile to 3 on desktop</CardDescription>
          </CardHeader>
          <CardContent>
            <GridContainer columns={1} responsive={{ sm: 2, lg: 3 }} gap="md" animated={true}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="h-20 bg-gradient-to-br from-teal-100 to-sky-100 dark:from-teal-900/30 dark:to-sky-900/30 rounded flex items-center justify-center">
                    <span className="text-sm font-medium">Item {i + 1}</span>
                  </div>
                </Card>
              ))}
            </GridContainer>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4-Column Grid</CardTitle>
            <CardDescription>Fixed 4-column layout with large gaps</CardDescription>
          </CardHeader>
          <CardContent>
            <GridContainer columns={4} gap="lg" animated={true}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-3">
                  <div className="h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded flex items-center justify-center">
                    <span className="text-xs font-medium">Card {i + 1}</span>
                  </div>
                </Card>
              ))}
            </GridContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complex Responsive Grid</CardTitle>
            <CardDescription>Different column counts for each breakpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <GridContainer columns={1} responsive={{ sm: 2, md: 3, lg: 4, xl: 6 }} gap="sm" animated={true}>
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="p-2">
                  <div className="h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded flex items-center justify-center">
                    <span className="text-xs">{i + 1}</span>
                  </div>
                </Card>
              ))}
            </GridContainer>
          </CardContent>
        </Card>
      </div>

      {/* Section Dividers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Section Dividers</h2>

        <Card>
          <CardHeader>
            <CardTitle>Divider Variations</CardTitle>
            <CardDescription>Different styles and orientations of section dividers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Basic Divider */}
            <div>
              <h4 className="font-medium mb-4">Basic Horizontal Dividers</h4>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">This is some content before the divider.</p>

                <SectionDivider />

                <p className="text-sm text-slate-600 dark:text-slate-300">This is content after a basic divider.</p>

                <SectionDivider variant="dashed" />

                <p className="text-sm text-slate-600 dark:text-slate-300">This follows a dashed divider.</p>

                <SectionDivider variant="dotted" />

                <p className="text-sm text-slate-600 dark:text-slate-300">This follows a dotted divider.</p>
              </div>
            </div>

            {/* Dividers with Titles */}
            <div>
              <h4 className="font-medium mb-4">Dividers with Titles</h4>
              <div className="space-y-6">
                <SectionDivider title="Meditation Techniques" icon={<Sparkles className="h-4 w-4 text-teal-500" />} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Mindful Breathing</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Focus on your breath to center your mind.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Body Scan</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Systematically relax each part of your body.
                    </p>
                  </Card>
                </div>

                <SectionDivider
                  title="Wellness Tips"
                  subtitle="Daily practices for better mental health"
                  icon={<Heart className="h-4 w-4 text-pink-500" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Stay Hydrated</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Drink plenty of water throughout the day.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Get Sunlight</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Spend time outdoors for vitamin D.</p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Practice Gratitude</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Write down three things you're grateful for.
                    </p>
                  </Card>
                </div>
              </div>
            </div>

            {/* Gradient Divider */}
            <div>
              <h4 className="font-medium mb-4">Gradient Divider</h4>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">Content before gradient divider.</p>

                <SectionDivider
                  variant="gradient"
                  title="Special Section"
                  icon={<Zap className="h-4 w-4 text-yellow-500" />}
                />

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Content after gradient divider with a smooth transition effect.
                </p>
              </div>
            </div>

            {/* Vertical Dividers */}
            <div>
              <h4 className="font-medium mb-4">Vertical Dividers</h4>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <h5 className="font-medium mb-2">Left Content</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    This content is on the left side of the vertical divider.
                  </p>
                </div>

                <SectionDivider
                  orientation="vertical"
                  title="Divider"
                  icon={<Sparkles className="h-4 w-4 text-teal-500" />}
                />

                <div className="flex-1">
                  <h5 className="font-medium mb-2">Right Content</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    This content is on the right side of the vertical divider.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layout Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Real-world Layout Examples</CardTitle>
          <CardDescription>Common layout patterns using grid containers and dividers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Feature Grid */}
            <div>
              <SectionDivider
                title="App Features"
                subtitle="Discover what makes MindFuel special"
                icon={<Sparkles className="h-4 w-4 text-teal-500" />}
              />

              <GridContainer columns={1} responsive={{ md: 2, lg: 3 }} gap="lg" animated={true}>
                <Card className="p-6">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-teal-500" />
                  </div>
                  <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Get personalized recommendations based on your mood patterns and preferences.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-sky-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Wellness Tracking</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Monitor your mental health journey with comprehensive tracking tools.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Quick Sessions</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Access guided meditations and breathing exercises anytime, anywhere.
                  </p>
                </Card>
              </GridContainer>
            </div>

            {/* Dashboard Layout */}
            <div>
              <SectionDivider
                title="Dashboard Overview"
                subtitle="Your wellness journey at a glance"
                variant="dashed"
              />

              <GridContainer columns={1} responsive={{ md: 2, lg: 4 }} gap="md" animated={true}>
                <Card className="p-4 md:col-span-2">
                  <h4 className="font-medium mb-2">Recent Activity</h4>
                  <div className="h-24 bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/20 rounded flex items-center justify-center">
                    <span className="text-sm text-slate-500">Activity Chart</span>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Mood Score</h4>
                  <div className="h-24 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">8.2</span>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Streak</h4>
                  <div className="h-24 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded flex items-center justify-center">
                    <span className="text-2xl font-bold text-yellow-600">7 days</span>
                  </div>
                </Card>
              </GridContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
