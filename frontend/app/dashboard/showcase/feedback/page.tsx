"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toast, ToastContainer } from "@/components/ui-kit/feedback/toast-notification"
import { LoadingSpinner } from "@/components/ui-kit/feedback/loading-spinner"
import { ProgressBar } from "@/components/ui-kit/feedback/progress-bar"
import { AlertBanner } from "@/components/ui-kit/feedback/alert-banner"

export default function FeedbackShowcase() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string
      title: string
      description?: string
      type: "success" | "error" | "warning" | "info"
    }>
  >([])
  const [progress, setProgress] = useState(65)
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(true)

  const addToast = (type: "success" | "error" | "warning" | "info") => {
    const toastMessages = {
      success: {
        title: "Success!",
        description: "Your meditation session has been saved successfully.",
      },
      error: {
        title: "Error occurred",
        description: "Failed to save your progress. Please try again.",
      },
      warning: {
        title: "Warning",
        description: "Your session will expire in 5 minutes.",
      },
      info: {
        title: "New feature available",
        description: "Check out our new sleep tracking feature!",
      },
    }

    const newToast = {
      id: Date.now().toString(),
      ...toastMessages[type],
      type,
    }

    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      addToast("success")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight">Feedback Showcase</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Alerts, toasts, loading states, and progress indicators
        </p>
      </motion.div>

      {/* Alert Banners */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Alert Banners</h2>
        <div className="space-y-4">
          <AlertBanner
            type="success"
            title="Profile Updated"
            description="Your wellness profile has been successfully updated with new preferences."
            visible={showAlert}
            onClose={() => setShowAlert(false)}
            action={{
              label: "View Profile",
              onClick: () => console.log("View profile clicked"),
            }}
          />

          <AlertBanner
            type="warning"
            title="Session Reminder"
            description="You haven't completed your daily meditation. Take a few minutes to practice mindfulness."
            action={{
              label: "Start Session",
              onClick: () => console.log("Start session clicked"),
            }}
          />

          <AlertBanner
            type="info"
            title="New Feature Available"
            description="We've added guided breathing exercises to help you relax during stressful moments."
            action={{
              label: "Try Now",
              onClick: () => console.log("Try now clicked"),
            }}
          />

          <AlertBanner
            type="error"
            title="Sync Failed"
            description="Unable to sync your data. Please check your internet connection and try again."
            action={{
              label: "Retry",
              onClick: () => console.log("Retry clicked"),
            }}
          />
        </div>
      </div>

      {/* Toast Notifications */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Toast Notifications</h2>
        <Card>
          <CardHeader>
            <CardTitle>Interactive Toast Examples</CardTitle>
            <CardDescription>Click the buttons to trigger different types of toast notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button onClick={() => addToast("success")} className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Success
              </Button>
              <Button onClick={() => addToast("error")} className="bg-red-500 hover:bg-red-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                Error
              </Button>
              <Button onClick={() => addToast("warning")} className="bg-yellow-500 hover:bg-yellow-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Warning
              </Button>
              <Button onClick={() => addToast("info")} className="bg-blue-500 hover:bg-blue-600">
                <Info className="h-4 w-4 mr-2" />
                Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Spinners */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Loading Spinners</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Spinner Sizes</CardTitle>
              <CardDescription>Different sizes for various use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <LoadingSpinner size="sm" color="primary" />
                  <div className="text-xs mt-2">Small</div>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="md" color="primary" />
                  <div className="text-xs mt-2">Medium</div>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="lg" color="primary" />
                  <div className="text-xs mt-2">Large</div>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="xl" color="primary" />
                  <div className="text-xs mt-2">Extra Large</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spinner Colors</CardTitle>
              <CardDescription>Different colors for different contexts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <LoadingSpinner size="md" color="primary" />
                  <div className="text-xs mt-2">Primary</div>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="md" color="success" />
                  <div className="text-xs mt-2">Success</div>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="md" color="warning" />
                  <div className="text-xs mt-2">Warning</div>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="md" color="danger" />
                  <div className="text-xs mt-2">Danger</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Bars */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Progress Bars</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Variations</CardTitle>
              <CardDescription>Different styles and sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Meditation Progress (Small)</div>
                <ProgressBar value={progress} size="sm" color="primary" showValue={true} animated={true} />
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Sleep Goal (Medium)</div>
                <ProgressBar
                  value={78}
                  size="md"
                  color="success"
                  showValue={true}
                  valueFormat={(value, max) => `${Math.round((value / max) * 8)} hours`}
                />
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Weekly Challenge (Large)</div>
                <ProgressBar value={45} size="lg" color="warning" showValue={true} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Progress</CardTitle>
              <CardDescription>Simulate progress updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Current Progress: {progress}%</div>
                <ProgressBar value={progress} color="primary" showValue={true} animated={true} />
              </div>

              <div className="flex gap-2">
                <Button onClick={simulateProgress} size="sm">
                  Simulate Progress
                </Button>
                <Button onClick={() => setProgress(Math.min(100, progress + 10))} size="sm" variant="outline">
                  +10%
                </Button>
                <Button onClick={() => setProgress(Math.max(0, progress - 10))} size="sm" variant="outline">
                  -10%
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loading States */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Loading States</h2>
        <Card>
          <CardHeader>
            <CardTitle>Interactive Loading Example</CardTitle>
            <CardDescription>Simulate loading states with feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={simulateLoading}
                disabled={isLoading}
                className="bg-gradient-to-r from-teal-500 to-sky-500"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="default" className="mr-2 border-t-white" />
                    Processing...
                  </>
                ) : (
                  "Start Process"
                )}
              </Button>

              {isLoading && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <LoadingSpinner size="sm" color="primary" />
                    <span className="text-sm font-medium">Processing your request...</span>
                  </div>
                  <ProgressBar value={33} color="primary" animated={true} size="sm" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Combined Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Real-world Feedback Scenarios</CardTitle>
          <CardDescription>Common feedback patterns in wellness applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Meditation Session Progress */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Meditation Session Progress</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mindful Breathing</span>
                  <span className="text-sm text-slate-500">3:45 / 10:00</span>
                </div>
                <ProgressBar
                  value={37.5}
                  color="primary"
                  animated={true}
                  valueFormat={(value) => `${Math.round(value)}% complete`}
                  showValue={true}
                />
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Session in progress
                </div>
              </div>
            </div>

            {/* Goal Achievement */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Weekly Goal Achievement</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Meditation Sessions</span>
                  <span className="text-sm font-medium">5 / 7 sessions</span>
                </div>
                <ProgressBar value={71} color="success" animated={true} showValue={false} />
                <div className="text-xs text-slate-500">2 more sessions to reach your weekly goal</div>
              </div>
            </div>

            {/* Data Sync Status */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Data Synchronization</h4>
              <div className="flex items-center gap-3">
                <LoadingSpinner size="sm" color="primary" />
                <div>
                  <div className="text-sm font-medium">Syncing your data...</div>
                  <div className="text-xs text-slate-500">This may take a few moments</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast Container */}
      <ToastContainer position="bottom-right">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            onClose={removeToast}
            duration={5000}
          />
        ))}
      </ToastContainer>
    </div>
  )
}
