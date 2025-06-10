import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Moon,
  Sun,
  Volume2,
  Vibrate,
  Download,
  Trash2,
  Key,
  Eye,
  EyeOff,
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Customize your MindFuel experience and manage your account preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Language</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your basic app preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <SettingItem
                  title="Auto-save Progress"
                  description="Automatically save your meditation and mood tracking progress"
                  control={<Switch defaultChecked />}
                />
                <SettingItem
                  title="Offline Mode"
                  description="Download content for offline use"
                  control={<Switch defaultChecked />}
                />
                <SettingItem
                  title="Background App Refresh"
                  description="Allow the app to refresh content in the background"
                  control={<Switch defaultChecked />}
                />
                <SettingItem
                  title="Analytics"
                  description="Help improve MindFuel by sharing anonymous usage data"
                  control={<Switch defaultChecked />}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionLength">Default Meditation Session Length</Label>
                  <Select defaultValue="10">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminderFreq">Reminder Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Manage your push notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingItem
                  title="Enable Push Notifications"
                  description="Receive notifications on this device"
                  control={<Switch defaultChecked />}
                />

                <div className="space-y-4">
                  <h4 className="font-medium">Notification Types</h4>
                  <SettingItem
                    title="Meditation Reminders"
                    description="Daily meditation session reminders"
                    control={<Switch defaultChecked />}
                    icon={<Bell className="h-4 w-4 text-sky-500" />}
                  />
                  <SettingItem
                    title="Sleep Reminders"
                    description="Bedtime and wake-up notifications"
                    control={<Switch defaultChecked />}
                    icon={<Moon className="h-4 w-4 text-indigo-400" />}
                  />
                  <SettingItem
                    title="Mood Check-ins"
                    description="Reminders to log your daily mood"
                    control={<Switch defaultChecked />}
                    icon={<Bell className="h-4 w-4 text-pink-500" />}
                  />
                  <SettingItem
                    title="Achievement Alerts"
                    description="Notifications for unlocked achievements"
                    control={<Switch defaultChecked />}
                    icon={<Bell className="h-4 w-4 text-yellow-500" />}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Customize how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <SettingItem
                    title="Sound"
                    description="Play sound with notifications"
                    control={<Switch defaultChecked />}
                    icon={<Volume2 className="h-4 w-4 text-green-500" />}
                  />
                  <SettingItem
                    title="Vibration"
                    description="Vibrate device for notifications"
                    control={<Switch defaultChecked />}
                    icon={<Vibrate className="h-4 w-4 text-blue-500" />}
                  />
                  <SettingItem
                    title="Badge Count"
                    description="Show notification count on app icon"
                    control={<Switch defaultChecked />}
                    icon={<Smartphone className="h-4 w-4 text-purple-500" />}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Quiet Hours</h4>
                  <SettingItem
                    title="Enable Quiet Hours"
                    description="Pause notifications during specified hours"
                    control={<Switch defaultChecked />}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quietStart">Start Time</Label>
                      <input
                        id="quietStart"
                        type="time"
                        defaultValue="22:00"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietEnd">End Time</Label>
                      <input
                        id="quietEnd"
                        type="time"
                        defaultValue="08:00"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Theme</CardTitle>
              <CardDescription>Customize the look and feel of your app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <ThemeOption
                      title="Light"
                      description="Light theme"
                      icon={<Sun className="h-5 w-5" />}
                      selected={false}
                    />
                    <ThemeOption
                      title="Dark"
                      description="Dark theme"
                      icon={<Moon className="h-5 w-5" />}
                      selected={false}
                    />
                    <ThemeOption
                      title="System"
                      description="Follow system"
                      icon={<Smartphone className="h-5 w-5" />}
                      selected={true}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Display Options</h4>
                  <SettingItem
                    title="Reduce Motion"
                    description="Minimize animations and transitions"
                    control={<Switch />}
                  />
                  <SettingItem
                    title="High Contrast"
                    description="Increase contrast for better visibility"
                    control={<Switch />}
                  />
                  <SettingItem
                    title="Large Text"
                    description="Use larger text throughout the app"
                    control={<Switch />}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Color Preferences</h4>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <ColorOption color="bg-teal-500" selected={true} />
                      <ColorOption color="bg-blue-500" selected={false} />
                      <ColorOption color="bg-purple-500" selected={false} />
                      <ColorOption color="bg-green-500" selected={false} />
                      <ColorOption color="bg-pink-500" selected={false} />
                      <ColorOption color="bg-orange-500" selected={false} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>Control how your data is used and stored</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingItem
                  title="Data Collection"
                  description="Allow collection of usage data to improve the app"
                  control={<Switch defaultChecked />}
                />
                <SettingItem
                  title="Personalized Recommendations"
                  description="Use your data to provide personalized content"
                  control={<Switch defaultChecked />}
                />
                <SettingItem
                  title="Crash Reports"
                  description="Automatically send crash reports to help fix issues"
                  control={<Switch defaultChecked />}
                />
                <SettingItem
                  title="Marketing Communications"
                  description="Receive emails about new features and tips"
                  control={<Switch />}
                />

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Data Management</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Download className="h-4 w-4" />
                      Download My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Eye className="h-4 w-4" />
                      View Privacy Policy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingItem
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  control={<Switch />}
                />
                <SettingItem
                  title="Biometric Login"
                  description="Use fingerprint or face recognition to log in"
                  control={<Switch defaultChecked />}
                />
                <SettingItem
                  title="Auto-lock"
                  description="Automatically lock the app when inactive"
                  control={<Switch defaultChecked />}
                />

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Session Management</h4>
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <Label>Auto-lock Timer</Label>
                      <Select defaultValue="15">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>Set your language and regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">App Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select defaultValue="us">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="es">Spain</SelectItem>
                      <SelectItem value="it">Italy</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="kr">South Korea</SelectItem>
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
                      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                      <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                      <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Format Preferences</h4>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select defaultValue="12">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentEmail">Email Address</Label>
                    <Input id="currentEmail" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <Button variant="outline" className="w-full">
                    Change Email
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Password</h4>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input id="currentPassword" type="password" placeholder="Enter current password" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-sky-500">Update Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Clear All Data</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                      This will permanently delete all your meditation sessions, mood logs, and progress data.
                    </p>
                    <Button
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/30"
                    >
                      Clear All Data
                    </Button>
                  </div>

                  <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      This will permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-teal-500 to-sky-500">Save All Changes</Button>
      </div>
    </div>
  )
}

function SettingItem({
  title,
  description,
  control,
  icon,
}: {
  title: string
  description: string
  control: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3 flex-1">
        {icon && <div className="mt-1">{icon}</div>}
        <div className="flex-1">
          <Label className="text-base font-medium">{title}</Label>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="ml-4">{control}</div>
    </div>
  )
}

function ThemeOption({
  title,
  description,
  icon,
  selected,
}: {
  title: string
  description: string
  icon: React.ReactNode
  selected: boolean
}) {
  return (
    <div
      className={`relative p-4 border rounded-lg cursor-pointer transition-colors ${
        selected
          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
      }`}
    >
      {selected && <Badge className="absolute -top-2 -right-2 bg-teal-500">Selected</Badge>}
      <div className="flex flex-col items-center text-center gap-2">
        <div
          className={`p-2 rounded-full ${selected ? "bg-teal-100 dark:bg-teal-800" : "bg-slate-100 dark:bg-slate-800"}`}
        >
          {icon}
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{description}</div>
        </div>
      </div>
    </div>
  )
}

function ColorOption({ color, selected }: { color: string; selected: boolean }) {
  return (
    <div
      className={`w-8 h-8 rounded-full ${color} cursor-pointer border-2 ${
        selected ? "border-slate-400 dark:border-slate-300" : "border-slate-200 dark:border-slate-700"
      } ${selected ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-300" : ""}`}
    />
  )
}
