"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Plus, Trash2, Calendar, Repeat } from "lucide-react"
import { motion } from "framer-motion"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

interface Reminder {
  id: string
  title: string
  description?: string
  datetime: string
  repeatType: "none" | "minute" | "hour" | "day"
  repeatInterval: number
  isActive: boolean
  createdAt: string
}

export default function ReminderPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    datetime: "",
    repeatType: "none" as "none" | "minute" | "hour" | "day",
    repeatInterval: 1,
  })

  // Fetch reminders
  const fetchReminders = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.get<Reminder[]>("/reminder")
      setReminders(data)
    } catch (error) {
      console.error("Failed to fetch reminders:", error)
      toast.error("Failed to load reminders")
    } finally {
      setIsLoading(false)
    }
  }

  // Create reminder
  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.datetime) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsCreating(true)
      const reminderData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        datetime: formData.datetime,
        repeatType: formData.repeatType,
        repeatInterval: formData.repeatInterval,
        isActive: true,
      }

      const newReminder = await apiClient.post<Reminder>("/reminder", reminderData)
      setReminders((prev) => [newReminder, ...prev])

      // Reset form
      setFormData({
        title: "",
        description: "",
        datetime: "",
        repeatType: "none",
        repeatInterval: 1,
      })

      toast.success("Reminder created successfully!")
    } catch (error) {
      console.error("Failed to create reminder:", error)
      toast.error("Failed to create reminder")
    } finally {
      setIsCreating(false)
    }
  }

  // Delete reminder
  const handleDeleteReminder = async (id: string) => {
    try {
      await apiClient.delete(`/reminder/${id}`)
      setReminders((prev) => prev.filter((reminder) => reminder._id !== id))
      toast.success("Reminder deleted successfully!")
    } catch (error) {
      console.error("Failed to delete reminder:", error)
      toast.error("Failed to delete reminder")
    }
  }

  // Format datetime for display
  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString()
  }

  // Get repeat display text
  const getRepeatText = (repeatType: string, interval: number) => {
    if (repeatType === "none") return "One-time"
    return `Every ${interval > 1 ? interval : ""} ${repeatType}${interval > 1 ? "s" : ""}`
  }

  useEffect(() => {
    fetchReminders()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Reminders</h1>
            <p className="text-slate-600 dark:text-slate-400">Create and manage your reminders</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Create Reminder Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Reminder
              </CardTitle>
              <CardDescription>Set up a new reminder with custom repeat options</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateReminder} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter reminder title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter reminder description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="datetime">Date & Time *</Label>
                  <Input
                    id="datetime"
                    type="datetime-local"
                    value={formData.datetime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, datetime: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="repeatType">Repeat</Label>
                    <Select
                      value={formData.repeatType}
                      onValueChange={(value: "none" | "minute" | "hour" | "day") =>
                        setFormData((prev) => ({ ...prev, repeatType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">One-time</SelectItem>
                        <SelectItem value="minute">Every Minute</SelectItem>
                        <SelectItem value="hour">Every Hour</SelectItem>
                        <SelectItem value="day">Every Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.repeatType !== "none" && (
                    <div className="space-y-2">
                      <Label htmlFor="interval">Interval</Label>
                      <Input
                        id="interval"
                        type="number"
                        min="1"
                        max="60"
                        value={formData.repeatInterval}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            repeatInterval: Number.parseInt(e.target.value) || 1,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Reminder"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reminders List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your Reminders
              </CardTitle>
              <CardDescription>
                {reminders.length} reminder{reminders.length !== 1 ? "s" : ""} total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : reminders.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reminders yet</p>
                  <p className="text-sm">Create your first reminder to get started</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reminders.map((reminder, index) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">{reminder.title}</h3>
                          {reminder.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{reminder.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>{formatDateTime(reminder.datetime)}</span>
                            <Separator orientation="vertical" className="h-3" />
                            <Badge variant="outline" className="text-xs">
                              <Repeat className="h-3 w-3 mr-1" />
                              {getRepeatText(reminder.repeatType, reminder.repeatInterval)}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReminder(reminder._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
