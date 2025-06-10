import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Moon, Clock, TrendingUp, Zap, Calendar, Target } from "lucide-react"

export default function SleepPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sleep Tracking</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Monitor your sleep patterns and get AI-powered recommendations for better rest
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SleepStatCard
          title="Last Night"
          value="7h 32m"
          description="Sleep duration"
          icon={<Clock className="h-4 w-4 text-indigo-400" />}
          score={85}
        />
        <SleepStatCard
          title="Sleep Quality"
          value="Good"
          description="Based on patterns"
          icon={<TrendingUp className="h-4 w-4 text-indigo-400" />}
          score={78}
        />
        <SleepStatCard
          title="Weekly Average"
          value="7h 15m"
          description="This week"
          icon={<Calendar className="h-4 w-4 text-indigo-400" />}
          score={72}
        />
        <SleepStatCard
          title="Sleep Goal"
          value="8h 0m"
          description="Target duration"
          icon={<Target className="h-4 w-4 text-indigo-400" />}
          score={90}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader>
          <CardTitle>Tonight's Sleep Plan</CardTitle>
          <CardDescription>AI-generated wind-down routine based on your patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                <Moon className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Optimal Bedtime: 10:30 PM</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Based on your 7:00 AM wake-up goal</p>
              </div>
            </div>
            <div className="space-y-3">
              <SleepRoutineStep time="9:00 PM" activity="Start wind-down routine" />
              <SleepRoutineStep time="9:30 PM" activity="Dim lights and avoid screens" />
              <SleepRoutineStep time="10:00 PM" activity="5-minute breathing meditation" />
              <SleepRoutineStep time="10:30 PM" activity="Lights out" />
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500">
              Start Wind-Down Routine
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sleep Trends</CardTitle>
            <CardDescription>Your sleep patterns over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-4">
              <div className="flex items-end justify-between h-full gap-2">
                {[
                  { day: "Mon", hours: 7.5, quality: 80 },
                  { day: "Tue", hours: 6.8, quality: 65 },
                  { day: "Wed", hours: 8.2, quality: 90 },
                  { day: "Thu", hours: 7.1, quality: 75 },
                  { day: "Fri", hours: 6.5, quality: 60 },
                  { day: "Sat", hours: 8.5, quality: 95 },
                  { day: "Sun", hours: 7.8, quality: 85 },
                ].map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="bg-gradient-to-t from-indigo-500 to-purple-500 rounded-sm w-full"
                      style={{ height: `${(data.hours / 10) * 100}%` }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>0h</span>
              <span>5h</span>
              <span>10h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep Insights</CardTitle>
            <CardDescription>AI-powered recommendations for better sleep</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SleepInsight
                type="positive"
                title="Great Progress!"
                description="Your sleep consistency has improved by 15% this week."
              />
              <SleepInsight
                type="suggestion"
                title="Optimize Bedtime"
                description="Try going to bed 30 minutes earlier to reach your 8-hour goal."
              />
              <SleepInsight
                type="warning"
                title="Screen Time Alert"
                description="Late screen exposure may be affecting your sleep quality."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList className="mb-4">
          <TabsTrigger value="schedule">Sleep Schedule</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="habits">Sleep Habits</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Schedule</CardTitle>
              <CardDescription>Set your ideal sleep and wake times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bedtime</label>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <div className="text-2xl font-bold">10:30 PM</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Recommended</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Wake Time</label>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <div className="text-2xl font-bold">7:00 AM</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Current goal</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sleep Duration Goal</label>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <div className="text-2xl font-bold">8h 30m</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Optimal for you</div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">Update Schedule</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="environment" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Environment</CardTitle>
              <CardDescription>Optimize your bedroom for better sleep</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnvironmentCard
                  title="Temperature"
                  value="68°F"
                  status="Optimal"
                  recommendation="Perfect temperature for deep sleep"
                />
                <EnvironmentCard
                  title="Noise Level"
                  value="25 dB"
                  status="Good"
                  recommendation="Consider white noise for consistency"
                />
                <EnvironmentCard
                  title="Light Exposure"
                  value="Low"
                  status="Excellent"
                  recommendation="Great job keeping it dark"
                />
                <EnvironmentCard
                  title="Air Quality"
                  value="Good"
                  status="Good"
                  recommendation="Consider air purifier for allergies"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="habits" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Habits</CardTitle>
              <CardDescription>Track habits that affect your sleep quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <HabitCard
                  habit="No caffeine after 2 PM"
                  streak={5}
                  impact="Positive"
                  description="Helps you fall asleep faster"
                />
                <HabitCard
                  habit="Screen-free 1 hour before bed"
                  streak={3}
                  impact="Positive"
                  description="Improves sleep quality"
                />
                <HabitCard habit="Regular exercise" streak={7} impact="Positive" description="Promotes deeper sleep" />
                <HabitCard
                  habit="Consistent bedtime"
                  streak={4}
                  impact="Positive"
                  description="Regulates circadian rhythm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Sleep History</CardTitle>
              <CardDescription>Detailed view of your sleep patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                Detailed sleep history coming soon!
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SleepStatCard({
  title,
  value,
  description,
  icon,
  score,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  score: number
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{description}</p>
        <Progress value={score} className="h-1" />
      </CardContent>
    </Card>
  )
}

function SleepRoutineStep({ time, activity }: { time: string; activity: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-2 py-1 rounded">
        {time}
      </div>
      <div className="text-sm">{activity}</div>
    </div>
  )
}

function SleepInsight({
  type,
  title,
  description,
}: {
  type: "positive" | "suggestion" | "warning"
  title: string
  description: string
}) {
  const getIcon = () => {
    switch (type) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "suggestion":
        return <Zap className="h-4 w-4 text-blue-500" />
      case "warning":
        return <Clock className="h-4 w-4 text-orange-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "positive":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      case "suggestion":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      case "warning":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
    }
  }

  return (
    <div className={`p-3 rounded-lg border ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div>
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">{description}</div>
        </div>
      </div>
    </div>
  )
}

function EnvironmentCard({
  title,
  value,
  status,
  recommendation,
}: {
  title: string
  value: string
  status: string
  recommendation: string
}) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">{title}</div>
        <Badge variant="outline" className="text-xs">
          {status}
        </Badge>
      </div>
      <div className="text-lg font-semibold mb-1">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{recommendation}</div>
    </div>
  )
}

function HabitCard({
  habit,
  streak,
  impact,
  description,
}: {
  habit: string
  streak: number
  impact: string
  description: string
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <div className="flex-1">
        <div className="font-medium mb-1">{habit}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{description}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">{streak} day streak</div>
        <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400">
          {impact}
        </Badge>
      </div>
    </div>
  )
}
