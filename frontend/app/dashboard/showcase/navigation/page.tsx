"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, User, ChevronRight, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/ui-kit/navigation/breadcrumbs"
import { Pagination } from "@/components/ui-kit/navigation/pagination"
import { StepIndicator } from "@/components/ui-kit/navigation/step-indicator"

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Showcase", href: "/dashboard/showcase" },
  { label: "Navigation", href: "/dashboard/showcase/navigation" },
]

const onboardingSteps = [
  {
    id: "profile",
    title: "Profile Setup",
    description: "Complete your personal information",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Set your wellness goals",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: "assessment",
    title: "Initial Assessment",
    description: "Take your first mood assessment",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    id: "complete",
    title: "Complete",
    description: "Start your wellness journey",
    icon: <CheckCircle className="h-4 w-4" />,
  },
]

const progressSteps = [
  {
    id: "start",
    title: "Getting Started",
    description: "Welcome to MindFuel",
  },
  {
    id: "learn",
    title: "Learn the Basics",
    description: "Understanding mindfulness",
  },
  {
    id: "practice",
    title: "Daily Practice",
    description: "Build healthy habits",
  },
  {
    id: "advanced",
    title: "Advanced Techniques",
    description: "Deepen your practice",
  },
  {
    id: "mastery",
    title: "Mastery",
    description: "Become a mindfulness expert",
  },
]

export default function NavigationShowcase() {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentStep, setCurrentStep] = useState(2)
  const [progressStep, setProgressStep] = useState(1)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight">Navigation Showcase</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Navigation components and progress indicators</p>
      </motion.div>

      {/* Breadcrumbs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Breadcrumbs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Breadcrumbs</CardTitle>
              <CardDescription>Standard breadcrumb navigation with home icon</CardDescription>
            </CardHeader>
            <CardContent>
              <Breadcrumbs items={breadcrumbItems} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Breadcrumbs</CardTitle>
              <CardDescription>Breadcrumbs without home and custom separator</CardDescription>
            </CardHeader>
            <CardContent>
              <Breadcrumbs items={breadcrumbItems} showHome={false} separator={<ChevronRight className="h-3 w-3" />} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pagination */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pagination</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Standard Pagination</CardTitle>
              <CardDescription>Full pagination with first/last buttons</CardDescription>
            </CardHeader>
            <CardContent>
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
                showFirstLast={true}
                showPrevNext={true}
                maxVisiblePages={5}
              />
              <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">Current page: {currentPage} of 10</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compact Pagination</CardTitle>
              <CardDescription>Minimal pagination without first/last</CardDescription>
            </CardHeader>
            <CardContent>
              <Pagination
                currentPage={3}
                totalPages={15}
                onPageChange={(page) => console.log("Page:", page)}
                showFirstLast={false}
                showPrevNext={true}
                maxVisiblePages={3}
              />
              <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">Showing 3 of 15 pages</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Step Indicators */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Step Indicators</h2>

        {/* Horizontal Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Horizontal Step Indicator</CardTitle>
            <CardDescription>Onboarding process with clickable steps</CardDescription>
          </CardHeader>
          <CardContent>
            <StepIndicator
              steps={onboardingSteps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              orientation="horizontal"
            />
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-medium mb-2">{onboardingSteps[currentStep]?.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{onboardingSteps[currentStep]?.description}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(onboardingSteps.length - 1, currentStep + 1))}
                  disabled={currentStep === onboardingSteps.length - 1}
                  className="px-3 py-1 text-sm bg-teal-500 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vertical Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vertical Step Indicator</CardTitle>
              <CardDescription>Learning path progress tracker</CardDescription>
            </CardHeader>
            <CardContent>
              <StepIndicator
                steps={progressSteps}
                currentStep={progressStep}
                onStepClick={setProgressStep}
                orientation="vertical"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Non-Interactive Steps</CardTitle>
              <CardDescription>Progress display without click handlers</CardDescription>
            </CardHeader>
            <CardContent>
              <StepIndicator
                steps={[
                  {
                    id: "order",
                    title: "Order Placed",
                    description: "Your wellness plan has been created",
                    icon: <CheckCircle className="h-4 w-4" />,
                  },
                  {
                    id: "processing",
                    title: "Processing",
                    description: "Personalizing your experience",
                    icon: <Clock className="h-4 w-4" />,
                  },
                  {
                    id: "ready",
                    title: "Ready",
                    description: "Your plan is ready to start",
                    icon: <AlertCircle className="h-4 w-4" />,
                  },
                ]}
                currentStep={1}
                orientation="vertical"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Navigation Examples</CardTitle>
          <CardDescription>Real-world navigation scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Multi-step Form Navigation */}
            <div>
              <h4 className="font-medium mb-3">Multi-step Form Navigation</h4>
              <div className="p-4 border rounded-lg">
                <Breadcrumbs
                  items={[{ label: "Account", href: "#" }, { label: "Profile", href: "#" }, { label: "Preferences" }]}
                  showHome={false}
                />
                <div className="mt-4">
                  <StepIndicator
                    steps={[
                      { id: "account", title: "Account", description: "Basic information" },
                      { id: "profile", title: "Profile", description: "Personal details" },
                      { id: "preferences", title: "Preferences", description: "Customize settings" },
                    ]}
                    currentStep={1}
                    orientation="horizontal"
                  />
                </div>
              </div>
            </div>

            {/* Content Pagination */}
            <div>
              <h4 className="font-medium mb-3">Content Pagination</h4>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Showing 1-10 of 47 meditation sessions
                  </div>
                  <Pagination
                    currentPage={1}
                    totalPages={5}
                    onPageChange={(page) => console.log("Content page:", page)}
                    showFirstLast={false}
                    maxVisiblePages={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                      <div className="font-medium">Meditation Session {i + 1}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">10 minutes</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
