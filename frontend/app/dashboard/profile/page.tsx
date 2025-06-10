import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Award, Target, TrendingUp } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>Member since March 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Change Photo
              </Button>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-lg font-semibold">47</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Days Active</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-lg font-semibold">12</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Achievements</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AchievementBadge title="First Week" description="Completed your first week" earned={true} />
                <AchievementBadge title="Meditation Master" description="10 meditation sessions" earned={true} />
                <AchievementBadge title="Sleep Champion" description="7 days of good sleep" earned={false} />
                <AchievementBadge title="Mood Tracker" description="30 mood check-ins" earned={false} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself..."
                      defaultValue="Software engineer passionate about mental health and wellness. Love hiking and meditation."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Date of Birth</Label>
                    <Input id="birthdate" type="date" defaultValue="1990-05-15" />
                  </div>
                  <Button className="bg-gradient-to-r from-teal-500 to-sky-500">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your MindFuel experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Daily Reminders</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive daily check-in reminders</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Meditation Reminders</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Get notified for meditation sessions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Sleep Reminders</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Bedtime and wake-up notifications</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="pst">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Standard Time</SelectItem>
                        <SelectItem value="mst">Mountain Standard Time</SelectItem>
                        <SelectItem value="cst">Central Standard Time</SelectItem>
                        <SelectItem value="est">Eastern Standard Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme Preference</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="bg-gradient-to-r from-teal-500 to-sky-500">Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Wellness Goals</CardTitle>
                  <CardDescription>Set and track your mental health goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <GoalCard
                    title="Daily Meditation"
                    current={5}
                    target={10}
                    unit="minutes"
                    icon={<Target className="h-5 w-5 text-sky-500" />}
                  />
                  <GoalCard
                    title="Sleep Duration"
                    current={7.5}
                    target={8}
                    unit="hours"
                    icon={<Target className="h-5 w-5 text-indigo-400" />}
                  />
                  <GoalCard
                    title="Mood Check-ins"
                    current={4}
                    target={7}
                    unit="per week"
                    icon={<Target className="h-5 w-5 text-teal-500" />}
                  />
                  <GoalCard
                    title="Stress Level"
                    current={6}
                    target={4}
                    unit="out of 10"
                    icon={<TrendingUp className="h-5 w-5 text-green-500" />}
                    reverse={true}
                  />
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-sky-500">Update Goals</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Data Analytics</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Help improve MindFuel with anonymous usage data
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Personalized Recommendations</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Use your data to provide better recommendations
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Marketing Communications</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Receive updates about new features and tips
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      Download My Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function AchievementBadge({
  title,
  description,
  earned,
}: {
  title: string
  description: string
  earned: boolean
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg ${earned ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-slate-50 dark:bg-slate-800"}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${earned ? "bg-yellow-500" : "bg-slate-300 dark:bg-slate-600"}`}
      >
        <Award className={`h-4 w-4 ${earned ? "text-white" : "text-slate-500"}`} />
      </div>
      <div className="flex-1">
        <div
          className={`font-medium text-sm ${earned ? "text-yellow-800 dark:text-yellow-200" : "text-slate-500 dark:text-slate-400"}`}
        >
          {title}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{description}</div>
      </div>
      {earned && (
        <Badge
          variant="outline"
          className="text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600"
        >
          Earned
        </Badge>
      )}
    </div>
  )
}

function GoalCard({
  title,
  current,
  target,
  unit,
  icon,
  reverse = false,
}: {
  title: string
  current: number
  target: number
  unit: string
  icon: React.ReactNode
  reverse?: boolean
}) {
  const progress = reverse ? ((target - current) / target) * 100 : (current / target) * 100
  const progressClamped = Math.max(0, Math.min(100, progress))

  return (
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {current} / {target} {unit}
        </div>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-teal-500 to-sky-500 h-2 rounded-full transition-all"
          style={{ width: `${progressClamped}%` }}
        />
      </div>
    </div>
  )
}
