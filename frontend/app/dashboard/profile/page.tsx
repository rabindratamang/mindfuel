"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Award, Target, Calendar, Plus, Edit, Trash2, Brain } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"

interface Profile {
  avatar: string | null
  bio: string | null
  dateOfBirth: string | null
  gender: string | null
  country: string | null
  location: string | null
  phoneNumber: string | null
  // New meditation settings fields
  meditationType: string | null
  meditationExperience: string | null
}

interface Stats {
  daysActive: number
}

interface Achievement {
  title: string
  description: string
  earned: boolean
  earnedDate?: string
}

interface Notifications {
  dailyReminders: boolean
  meditationReminders: boolean
  sleepReminders: boolean
}

interface Preferences {
  notifications: Notifications
  language: string
  timezone: string
}

interface Goal {
  title: string
  current: number
  target: number
  unit: string
  type: string
  reverse: boolean
}

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  profile: Profile
  stats: Stats
  achievements: Achievement[]
  preferences: Preferences
  goals: Goal[]
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profile: {
      avatar: null as string | null,
      bio: null as string | null,
      dateOfBirth: null as string | null,
      gender: null as string | null,
      country: null as string | null,
      location: null as string | null,
      phoneNumber: null as string | null,
      // New meditation settings
      meditationType: null as string | null,
      meditationExperience: null as string | null,
    },
    preferences: {
      notifications: {
        dailyReminders: true,
        meditationReminders: true,
        sleepReminders: true,
      },
      language: "en",
      timezone: "UTC",
    },
  })

  // Goal form state
  const [goalForm, setGoalForm] = useState({
    title: "",
    target: 0,
    unit: "",
    type: "",
    reverse: false,
  })

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const profile = await apiClient.get<UserProfile>("/user/profile")
      setUserProfile(profile)
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        profile: {
          ...profile.profile,
          // Convert ISO date to YYYY-MM-DD format for date input
          dateOfBirth: profile.profile.dateOfBirth
            ? new Date(profile.profile.dateOfBirth).toISOString().split("T")[0]
            : null,
        },
        preferences: profile.preferences,
      })
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePersonalInfo = async () => {
    try {
      setSaving(true)
      await apiClient.put("/user/profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        profile: {
          ...formData.profile,
          // Convert date back to ISO format for backend
          dateOfBirth: formData.profile.dateOfBirth ? new Date(formData.profile.dateOfBirth).toISOString() : null,
        },
      })
      await fetchUserProfile() // Refresh data
    } catch (error) {
      console.error("Failed to save personal info:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    try {
      setSaving(true)
      await apiClient.put("/user/preferences", formData.preferences)
      await fetchUserProfile() // Refresh data
    } catch (error) {
      console.error("Failed to save preferences:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddGoal = () => {
    setEditingGoal(null)
    setGoalForm({
      title: "",
      target: 0,
      unit: "",
      type: "",
      reverse: false,
    })
    setGoalDialogOpen(true)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalForm({
      title: goal.title,
      target: goal.target,
      unit: goal.unit,
      type: goal.type,
      reverse: goal.reverse,
    })
    setGoalDialogOpen(true)
  }

  const handleSaveGoal = async () => {
    try {
      setSaving(true)
      if (editingGoal) {
        // Update existing goal
        await apiClient.put("/user/goals", goalForm)
      } else {
        // Add new goal
        await apiClient.post("/user/goals", goalForm)
      }
      setGoalDialogOpen(false)
      await fetchUserProfile() // Refresh data
    } catch (error) {
      console.error("Failed to save goal:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGoal = async (goalTitle: string) => {
    try {
      setSaving(true)
      await apiClient.delete(`/user/goals/${goalTitle}`)
      await fetchUserProfile() // Refresh data
    } catch (error) {
      console.error("Failed to delete goal:", error)
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-2 text-slate-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Failed to load profile data</p>
        <Button onClick={fetchUserProfile} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

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
                  <AvatarImage
                    src={userProfile.profile.avatar || "/placeholder.svg?height=96&width=96"}
                    alt="Profile"
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials(userProfile.firstName, userProfile.lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{`${userProfile.firstName} ${userProfile.lastName}`}</CardTitle>
              <CardDescription>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  Member since {formatDate(userProfile.createdAt)}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-transparent" variant="outline">
                Change Photo
              </Button>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-lg font-semibold">{userProfile.stats.daysActive}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Days Active</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-lg font-semibold">{userProfile.achievements.length}</div>
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
              {userProfile.achievements.length > 0 ? (
                <div className="space-y-3">
                  {userProfile.achievements.map((achievement, index) => (
                    <AchievementBadge
                      key={index}
                      title={achievement.title}
                      description={achievement.description}
                      earned={achievement.earned}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm">No achievements yet</p>
                  <p className="text-slate-400 text-xs mt-1">Start your wellness journey to earn achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="meditation">Meditation</TabsTrigger>
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
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.profile.phoneNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, phoneNumber: e.target.value || null },
                        })
                      }
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.profile.gender || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, gender: value || null },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={formData.profile.country || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, country: value || null },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="np">Nepal</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">City/Location</Label>
                    <Input
                      id="location"
                      value={formData.profile.location || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, location: e.target.value || null },
                        })
                      }
                      placeholder="Enter your city or location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.profile.bio || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, bio: e.target.value || null },
                        })
                      }
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.profile.dateOfBirth || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, dateOfBirth: e.target.value || null },
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleSavePersonalInfo}
                    disabled={saving}
                    className="bg-gradient-to-r from-teal-500 to-sky-500"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
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
                      <Switch
                        checked={formData.preferences.notifications.dailyReminders}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              notifications: {
                                ...formData.preferences.notifications,
                                dailyReminders: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Meditation Reminders</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Get notified for meditation sessions
                        </p>
                      </div>
                      <Switch
                        checked={formData.preferences.notifications.meditationReminders}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              notifications: {
                                ...formData.preferences.notifications,
                                meditationReminders: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Sleep Reminders</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Bedtime and wake-up notifications</p>
                      </div>
                      <Switch
                        checked={formData.preferences.notifications.sleepReminders}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              notifications: {
                                ...formData.preferences.notifications,
                                sleepReminders: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.preferences.language}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, language: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="np">Nepali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={formData.preferences.timezone}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, timezone: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Asia/Kathmandu">Nepal Time</SelectItem>
                        <SelectItem value="Asia/Kolkata">India Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="bg-gradient-to-r from-teal-500 to-sky-500"
                  >
                    {saving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-sky-500" />
                      Wellness Goals
                    </div>
                    <Button onClick={handleAddGoal} size="sm" className="bg-gradient-to-r from-teal-500 to-sky-500">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Goal
                    </Button>
                  </CardTitle>
                  <CardDescription>Set and track your mental health goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userProfile.goals.length > 0 ? (
                    <>
                      {userProfile.goals.map((goal, index) => (
                        <div key={index} className="relative">
                          <GoalCard
                            title={goal.title}
                            target={goal.target}
                            unit={goal.unit}
                            icon={<Target className="h-5 w-5 text-sky-500" />}
                            reverse={goal.reverse}
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditGoal(goal)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteGoal(goal.title)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-2">No goals set yet</p>
                      <p className="text-slate-400 text-sm mb-4">Set wellness goals to track your progress</p>
                      <Button onClick={handleAddGoal} className="bg-gradient-to-r from-teal-500 to-sky-500">
                        Add Your First Goal
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meditation" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Meditation Settings
                  </CardTitle>
                  <CardDescription>Set your basic meditation preferences that won't change often</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="meditationType">Preferred Meditation Type</Label>
                    <Select
                      value={formData.profile.meditationType || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, meditationType: value || null },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred meditation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mindfulness">Mindfulness - Present moment awareness</SelectItem>
                        <SelectItem value="breathing">Breathing - Breath-focused techniques</SelectItem>
                        <SelectItem value="loving-kindness">Loving-Kindness - Compassion & self-love</SelectItem>
                        <SelectItem value="body-scan">Body Scan - Progressive relaxation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meditationExperience">Experience Level</Label>
                    <Select
                      value={formData.profile.meditationExperience || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, meditationExperience: value || null },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner - New to meditation</SelectItem>
                        <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                        <SelectItem value="advanced">Advanced - Regular practitioner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                      Why set these preferences?
                    </h4>
                    <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                      <li>• Personalized AI meditation generation</li>
                      <li>• Better content recommendations</li>
                      <li>• Appropriate difficulty levels</li>
                      <li>• Streamlined meditation sessions</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleSavePersonalInfo}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    {saving ? "Saving..." : "Save Meditation Settings"}
                  </Button>
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
                    <Button variant="outline" className="w-full bg-transparent">
                      Download My Data
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Goal Dialog */}
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
            <DialogDescription>
              {editingGoal ? "Update your wellness goal" : "Create a new wellness goal to track your progress"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goalTitle">Goal Title</Label>
              <Input
                id="goalTitle"
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                placeholder="e.g., Daily Meditation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                type="number"
                value={goalForm.target}
                onChange={(e) => setGoalForm({ ...goalForm, target: Number.parseFloat(e.target.value) || 0 })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={goalForm.unit} onValueChange={(value) => setGoalForm({ ...goalForm, unit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="times">Times</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="sessions">Sessions</SelectItem>
                  <SelectItem value="steps">Steps</SelectItem>
                  <SelectItem value="calories">Calories</SelectItem>
                  <SelectItem value="glasses">Glasses (water)</SelectItem>
                  <SelectItem value="pages">Pages</SelectItem>
                  <SelectItem value="points">Points</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Goal Type</Label>
              <Select value={goalForm.type} onValueChange={(value) => setGoalForm({ ...goalForm, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meditation">Meditation</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="mood">Mood Tracking</SelectItem>
                  <SelectItem value="stress">Stress Management</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="reverse"
                checked={goalForm.reverse}
                onCheckedChange={(checked) => setGoalForm({ ...goalForm, reverse: checked })}
              />
              <Label htmlFor="reverse">Reverse goal (lower is better)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoal} disabled={saving} className="bg-gradient-to-r from-teal-500 to-sky-500">
              {saving ? "Saving..." : editingGoal ? "Update Goal" : "Add Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
