"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedInput } from "@/components/ui-kit/forms/animated-input"
import { SearchBar } from "@/components/ui-kit/forms/search-bar"
import { AnimatedCheckbox } from "@/components/ui-kit/forms/animated-checkbox"
import { AnimatedRadioGroup } from "@/components/ui-kit/forms/animated-radio-group"
import { AnimatedSelect } from "@/components/ui-kit/forms/animated-select"
import { AnimatedTextarea } from "@/components/ui-kit/forms/animated-textarea"
import { AnimatedSwitch } from "@/components/ui-kit/forms/animated-switch"
import { FormSection } from "@/components/ui-kit/forms/form-section"

export default function FormsShowcase() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    message: "",
    country: "",
    notifications: true,
    newsletter: false,
    theme: "light",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
  ]

  const themeOptions = [
    { id: "light", label: "Light", value: "light", description: "Light theme for daytime use" },
    { id: "dark", label: "Dark", value: "dark", description: "Dark theme for nighttime use" },
    { id: "auto", label: "Auto", value: "auto", description: "Automatically switch based on system" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight">Forms Showcase</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Interactive form components with smooth animations and validation
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Form Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Form Inputs</CardTitle>
            <CardDescription>Animated inputs with floating labels and icons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatedInput
              id="email"
              label="Email Address"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <AnimatedInput
              id="password"
              label="Password"
              type="password"
              icon={<Lock className="h-4 w-4" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />

            <AnimatedInput
              id="name"
              label="Full Name"
              icon={<User className="h-4 w-4" />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </CardContent>
        </Card>

        {/* Search and Select */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Select</CardTitle>
            <CardDescription>Search bars and dropdown selectors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Bar</label>
              <SearchBar
                placeholder="Search for anything..."
                onSearch={(value) => console.log("Search:", value)}
                onChange={(value) => console.log("Change:", value)}
              />
            </div>

            <AnimatedSelect
              id="country"
              label="Country"
              options={countries}
              value={formData.country}
              onValueChange={(value) => setFormData({ ...formData, country: value })}
              placeholder="Select your country"
            />

            <AnimatedTextarea
              id="message"
              label="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about yourself..."
            />
          </CardContent>
        </Card>

        {/* Checkboxes and Switches */}
        <Card>
          <CardHeader>
            <CardTitle>Checkboxes & Switches</CardTitle>
            <CardDescription>Interactive selection components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatedCheckbox
              id="newsletter"
              label="Subscribe to Newsletter"
              description="Get weekly updates about new features and wellness tips"
              checked={formData.newsletter}
              onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked })}
            />

            <AnimatedSwitch
              id="notifications"
              label="Push Notifications"
              description="Receive notifications about your wellness journey"
              checked={formData.notifications}
              onCheckedChange={(checked) => setFormData({ ...formData, notifications: checked })}
            />
          </CardContent>
        </Card>

        {/* Radio Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Radio Groups</CardTitle>
            <CardDescription>Single selection from multiple options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <label className="text-sm font-medium">Theme Preference</label>
              <AnimatedRadioGroup
                options={themeOptions}
                value={formData.theme}
                onValueChange={(value) => setFormData({ ...formData, theme: value })}
                name="theme"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Form Sections</CardTitle>
          <CardDescription>Collapsible form sections for better organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSection title="Personal Information" description="Basic details about yourself" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedInput id="firstName" label="First Name" icon={<User className="h-4 w-4" />} />
              <AnimatedInput id="lastName" label="Last Name" icon={<User className="h-4 w-4" />} />
            </div>
          </FormSection>

          <FormSection title="Preferences" description="Customize your experience" defaultOpen={false}>
            <div className="space-y-4">
              <AnimatedSwitch
                id="darkMode"
                label="Dark Mode"
                description="Use dark theme for better nighttime viewing"
              />
              <AnimatedSwitch
                id="analytics"
                label="Analytics"
                description="Help us improve by sharing anonymous usage data"
              />
            </div>
          </FormSection>

          <FormSection title="Communication" description="How you'd like to hear from us" defaultOpen={false}>
            <div className="space-y-4">
              <AnimatedCheckbox
                id="emailUpdates"
                label="Email Updates"
                description="Receive important updates via email"
              />
              <AnimatedCheckbox
                id="smsAlerts"
                label="SMS Alerts"
                description="Get urgent notifications via text message"
              />
            </div>
          </FormSection>
        </CardContent>
      </Card>

      {/* Complete Form Example */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Form Example</CardTitle>
          <CardDescription>A real-world form using multiple components</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedInput id="form-email" label="Email" type="email" icon={<Mail className="h-4 w-4" />} required />
              <AnimatedInput id="form-name" label="Full Name" icon={<User className="h-4 w-4" />} required />
            </div>

            <AnimatedSelect id="form-country" label="Country" options={countries} placeholder="Select your country" />

            <AnimatedTextarea id="form-feedback" label="Feedback" placeholder="Share your thoughts about our app..." />

            <div className="flex items-center justify-between">
              <AnimatedCheckbox id="form-terms" label="I agree to the terms and conditions" />
              <Button type="submit" className="bg-gradient-to-r from-teal-500 to-sky-500">
                Submit Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
