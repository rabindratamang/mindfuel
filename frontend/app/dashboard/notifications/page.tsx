import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Clock, Moon, Sparkles, Heart, Calendar, Trash2 } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your notification preferences and view recent alerts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NotificationStatCard
          title="Unread"
          value="3"
          description="New notifications"
          icon={<Bell className="h-4 w-4 text-teal-500" />}
        />
        <NotificationStatCard
          title="Today"
          value="8"
          description="Notifications sent"
          icon={<Clock className="h-4 w-4 text-sky-500" />}
        />
        <NotificationStatCard
          title="This Week"
          value="24"
          description="Total notifications"
          icon={<Calendar className="h-4 w-4 text-indigo-400" />}
        />
      </div>

      <Tabs defaultValue="recent">
        <TabsList className="mb-6">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="m-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>Your latest notifications and reminders</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Mark All Read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <NotificationItem
                  type="reminder"
                  title="Time for your evening meditation"
                  description="Your 10-minute mindfulness session is ready"
                  time="2 minutes ago"
                  unread={true}
                  icon={<Sparkles className="h-4 w-4 text-sky-500" />}
                />
                <NotificationItem
                  type="insight"
                  title="Weekly mood report is ready"
                  description="Your mood has improved by 15% this week"
                  time="1 hour ago"
                  unread={true}
                  icon={<Heart className="h-4 w-4 text-pink-500" />}
                />
                <NotificationItem
                  type="sleep"
                  title="Bedtime reminder"
                  description="It's time to start your wind-down routine"
                  time="Yesterday, 10:00 PM"
                  unread={false}
                  icon={<Moon className="h-4 w-4 text-indigo-400" />}
                />
                <NotificationItem
                  type="achievement"
                  title="Achievement unlocked!"
                  description="You've completed 7 days of meditation"
                  time="Yesterday, 2:30 PM"
                  unread={false}
                  icon={<Sparkles className="h-4 w-4 text-yellow-500" />}
                />
                <NotificationItem
                  type="reminder"
                  title="Mood check-in reminder"
                  description="How are you feeling today?"
                  time="Yesterday, 9:00 AM"
                  unread={false}
                  icon={<Heart className="h-4 w-4 text-teal-500" />}
                />
                <NotificationItem
                  type="tip"
                  title="Daily wellness tip"
                  description="Try taking 5 deep breaths when you feel stressed"
                  time="2 days ago"
                  unread={false}
                  icon={<Bell className="h-4 w-4 text-green-500" />}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>Choose which notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <NotificationSetting
                  title="Meditation Reminders"
                  description="Daily reminders for your meditation sessions"
                  enabled={true}
                  icon={<Sparkles className="h-4 w-4 text-sky-500" />}
                />
                <NotificationSetting
                  title="Sleep Reminders"
                  description="Bedtime and wake-up notifications"
                  enabled={true}
                  icon={<Moon className="h-4 w-4 text-indigo-400" />}
                />
                <NotificationSetting
                  title="Mood Check-ins"
                  description="Reminders to log your daily mood"
                  enabled={true}
                  icon={<Heart className="h-4 w-4 text-pink-500" />}
                />
                <NotificationSetting
                  title="Weekly Reports"
                  description="Summary of your wellness progress"
                  enabled={true}
                  icon={<Calendar className="h-4 w-4 text-green-500" />}
                />
                <NotificationSetting
                  title="Achievements"
                  description="Notifications when you unlock achievements"
                  enabled={true}
                  icon={<Sparkles className="h-4 w-4 text-yellow-500" />}
                />
                <NotificationSetting
                  title="Wellness Tips"
                  description="Daily tips and insights for better mental health"
                  enabled={false}
                  icon={<Bell className="h-4 w-4 text-teal-500" />}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Methods</CardTitle>
                <CardDescription>How you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <NotificationSetting
                  title="Push Notifications"
                  description="Notifications in your browser or mobile app"
                  enabled={true}
                />
                <NotificationSetting
                  title="Email Notifications"
                  description="Receive notifications via email"
                  enabled={false}
                />
                <NotificationSetting
                  title="SMS Notifications"
                  description="Text message notifications for important reminders"
                  enabled={false}
                />
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Quiet Hours</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable Quiet Hours</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Pause notifications during specified hours
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quietStart" className="text-sm">
                          Start Time
                        </Label>
                        <input
                          id="quietStart"
                          type="time"
                          defaultValue="22:00"
                          className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quietEnd" className="text-sm">
                          End Time
                        </Label>
                        <input
                          id="quietEnd"
                          type="time"
                          defaultValue="08:00"
                          className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Notification Schedule</CardTitle>
              <CardDescription>Set up your daily notification schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ScheduleItem
                  title="Morning Check-in"
                  time="9:00 AM"
                  description="Start your day with a mood check-in"
                  enabled={true}
                />
                <ScheduleItem
                  title="Midday Meditation"
                  time="12:30 PM"
                  description="Take a mindful break during lunch"
                  enabled={true}
                />
                <ScheduleItem
                  title="Afternoon Reminder"
                  time="3:00 PM"
                  description="Quick stress relief check"
                  enabled={false}
                />
                <ScheduleItem
                  title="Evening Wind-down"
                  time="8:00 PM"
                  description="Prepare for a restful night"
                  enabled={true}
                />
                <ScheduleItem
                  title="Bedtime Reminder"
                  time="10:30 PM"
                  description="Time to start your sleep routine"
                  enabled={true}
                />
                <div className="pt-4">
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-sky-500">Save Schedule</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationStatCard({
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

function NotificationItem({
  type,
  title,
  description,
  time,
  unread,
  icon,
}: {
  type: string
  title: string
  description: string
  time: string
  unread: boolean
  icon: React.ReactNode
}) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border ${unread ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}
    >
      <div className="mt-1">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className={`font-medium ${unread ? "text-blue-900 dark:text-blue-100" : ""}`}>{title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{description}</p>
          </div>
          {unread && (
            <Badge
              variant="outline"
              className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700"
            >
              New
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">{time}</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function NotificationSetting({
  title,
  description,
  enabled,
  icon,
}: {
  title: string
  description: string
  enabled: boolean
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-1">{icon}</div>}
        <div>
          <Label className="text-base">{title}</Label>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <Switch defaultChecked={enabled} />
    </div>
  )
}

function ScheduleItem({
  title,
  time,
  description,
  enabled,
}: {
  title: string
  time: string
  description: string
  enabled: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="font-medium">{time}</div>
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{description}</div>
        </div>
      </div>
      <Switch defaultChecked={enabled} />
    </div>
  )
}
