"use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Calendar, Clock, ArrowUpRight } from "lucide-react"
import { MoodAnalyzer } from "@/components/mood-analyzer"
import { RecommendationCard } from "@/components/recommendation-card"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedIcon } from "@/components/animated-icon"
import { motion } from "framer-motion"

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Welcome back, John</h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Here's an overview of your mental wellness journey
          </p>
        </div>
        <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-sky-500">Check-in Now</Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatedCard delay={0}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
            <AnimatedIcon icon={Brain} hoverEffect="pulse" color="#14b8a6" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Positive</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">+5% from last week</p>
            <div className="mt-4 h-[60px]">
              <div className="flex items-end justify-between h-full gap-1">
                {[40, 30, 60, 70, 50, 75, 80].map((value, i) => (
                  <motion.div
                    key={i}
                    className="bg-gradient-to-t from-teal-500 to-sky-500 rounded-sm w-full"
                    style={{ height: `${value}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    whileHover={{ scaleY: 1.1 }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard delay={1}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Meditation Streak</CardTitle>
            <AnimatedIcon icon={Calendar} hoverEffect="bounce" color="#0ea5e9" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">7 Days</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your longest streak: 14 days</p>
            <div className="mt-4 grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="aspect-square rounded-sm bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <motion.div className="w-2 h-2 rounded-full bg-teal-500" whileHover={{ scale: 1.5 }} />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard delay={2} className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sleep Quality</CardTitle>
            <AnimatedIcon icon={Clock} hoverEffect="glow" color="#818cf8" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Good</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">7.5 hours on average</p>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1 text-xs">
                <span>Sleep Score</span>
                <span className="font-medium">78%</span>
              </div>
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.3 }}>
                <Progress value={78} className="h-2 bg-slate-100 dark:bg-slate-800" />
              </motion.div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <Tabs defaultValue="mood">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="mood" className="flex-1 sm:flex-none">
                  Mood
                </TabsTrigger>
                <TabsTrigger value="meditation" className="flex-1 sm:flex-none">
                  Meditation
                </TabsTrigger>
                <TabsTrigger value="sleep" className="flex-1 sm:flex-none">
                  Sleep
                </TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" className="gap-1 text-slate-500 dark:text-slate-400 w-full sm:w-auto">
                View All <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
            <TabsContent value="mood" className="m-0">
              <AnimatedCard>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Mood Analysis</CardTitle>
                  <CardDescription className="text-sm">
                    How are you feeling today? Let AI analyze your mood and provide personalized suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MoodAnalyzer />
                </CardContent>
              </AnimatedCard>
            </TabsContent>
            <TabsContent value="meditation" className="m-0">
              <AnimatedCard>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Meditation Sessions</CardTitle>
                  <CardDescription className="text-sm">
                    Your recent meditation sessions and recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div
                        className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg"
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <div className="text-sm font-medium mb-2">Last Session</div>
                        <div className="text-base sm:text-lg font-semibold">Mindful Breathing</div>
                        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          10 minutes • Yesterday
                        </div>
                      </motion.div>
                      <motion.div
                        className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg"
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <div className="text-sm font-medium mb-2">Total Time</div>
                        <div className="text-base sm:text-lg font-semibold">3.5 hours</div>
                        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">This month</div>
                      </motion.div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-sky-500">Start New Session</Button>
                  </div>
                </CardContent>
              </AnimatedCard>
            </TabsContent>
            <TabsContent value="sleep" className="m-0">
              <AnimatedCard>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Sleep Insights</CardTitle>
                  <CardDescription className="text-sm">Your sleep patterns and recommendations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <motion.div
                      className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Last Night</div>
                        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">7.5 hours</div>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>10:30 PM</span>
                        <span>6:00 AM</span>
                      </div>
                    </motion.div>
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">View Sleep Report</Button>
                  </div>
                </CardContent>
              </AnimatedCard>
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-4">
          <motion.h3
            className="text-base sm:text-lg font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Recommendations
          </motion.h3>
          <div className="space-y-4">
            <RecommendationCard
              title="5-Minute Stress Relief"
              description="Quick breathing exercise to reduce anxiety"
              type="meditation"
            />
            <RecommendationCard
              title="Sleep Wind-Down Routine"
              description="Prepare your mind and body for restful sleep"
              type="sleep"
            />
            <RecommendationCard
              title="Mood Journal Prompt"
              description="Reflect on your positive experiences today"
              type="mood"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
