"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, Check, Code, Eye, Palette, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { notFound } from "next/navigation"

// Import all UI kit components for live examples
import { AnimatedInput } from "@/components/ui-kit/forms/animated-input"
import { SearchBar } from "@/components/ui-kit/forms/search-bar"
import { StatCard } from "@/components/ui-kit/data-display/stat-card"
import { LineChart } from "@/components/ui-kit/charts/line-chart"
import { LoadingSpinner } from "@/components/ui-kit/feedback/loading-spinner"
import { AnimatedTextarea } from "@/components/ui-kit/forms/animated-textarea"
import { AnimatedCheckbox } from "@/components/ui-kit/forms/animated-checkbox"
import { AnimatedSwitch } from "@/components/ui-kit/forms/animated-switch"
import { ProgressBar } from "@/components/ui-kit/feedback/progress-bar"
import { InfoCard } from "@/components/ui-kit/data-display/info-card"
import { AnimatedRadioGroup } from "@/components/ui-kit/forms/animated-radio-group"
import { AnimatedSelect } from "@/components/ui-kit/forms/animated-select"
import { FormSection } from "@/components/ui-kit/forms/form-section"
import { DataTable } from "@/components/ui-kit/data-display/data-table"
import { Timeline } from "@/components/ui-kit/data-display/timeline"
import { BarChart } from "@/components/ui-kit/charts/bar-chart"
import { DonutChart } from "@/components/ui-kit/charts/donut-chart"
import { Breadcrumbs } from "@/components/ui-kit/navigation/breadcrumbs"
import { Pagination } from "@/components/ui-kit/navigation/pagination"
import { StepIndicator } from "@/components/ui-kit/navigation/step-indicator"
import { Toast } from "@/components/ui-kit/feedback/toast-notification"
import { AlertBanner } from "@/components/ui-kit/feedback/alert-banner"
import { TooltipMenu } from "@/components/ui-kit/overlays/tooltip-menu"
import { GridContainer } from "@/components/ui-kit/layout/grid-container"
import { SectionDivider } from "@/components/ui-kit/layout/section-divider"
import { ImageGallery } from "@/components/ui-kit/media/image-gallery"
import { AvatarGroup } from "@/components/ui-kit/media/avatar-group"

// Component documentation data
const componentDocs = {
  "animated-input": {
    name: "AnimatedInput",
    category: "Forms",
    description: "A beautiful input component with floating labels and smooth animations",
    complexity: "Simple",
    props: [
      { name: "label", type: "string", required: true, description: "The floating label text" },
      { name: "placeholder", type: "string", required: false, description: "Placeholder text when empty" },
      {
        name: "type",
        type: "string",
        required: false,
        default: "text",
        description: "Input type (text, email, password, etc.)",
      },
      { name: "error", type: "string", required: false, description: "Error message to display" },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        default: "false",
        description: "Whether the input is disabled",
      },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Usage",
        code: `<AnimatedInput 
  label="Email Address" 
  placeholder="Enter your email" 
  type="email" 
/>`,
        component: <AnimatedInput label="Email Address" placeholder="Enter your email" type="email" />,
      },
      {
        title: "With Error State",
        code: `<AnimatedInput 
  label="Password" 
  type="password" 
  error="Password must be at least 8 characters" 
/>`,
        component: <AnimatedInput label="Password" type="password" error="Password must be at least 8 characters" />,
      },
      {
        title: "Disabled State",
        code: `<AnimatedInput 
  label="Username" 
  placeholder="Not available" 
  disabled 
/>`,
        component: <AnimatedInput label="Username" placeholder="Not available" disabled />,
      },
    ],
    usage: `import { AnimatedInput } from "@/components/ui-kit/forms/animated-input"

export function MyForm() {
  const [email, setEmail] = useState("")
  
  return (
    <AnimatedInput
      label="Email Address"
      placeholder="Enter your email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  )
}`,
    bestPractices: [
      "Always provide a descriptive label for accessibility",
      "Use appropriate input types (email, password, tel, etc.)",
      "Provide clear error messages when validation fails",
      "Consider using placeholder text for additional context",
      "Test with screen readers to ensure accessibility",
    ],
    relatedComponents: ["SearchBar", "AnimatedTextarea", "FormSection"],
  },

  "search-bar": {
    name: "SearchBar",
    category: "Forms",
    description: "An expandable search input with clear functionality and smooth animations",
    complexity: "Medium",
    props: [
      { name: "placeholder", type: "string", required: false, default: "Search...", description: "Placeholder text" },
      {
        name: "onSearch",
        type: "(query: string) => void",
        required: false,
        description: "Callback when search is performed",
      },
      { name: "onClear", type: "() => void", required: false, description: "Callback when search is cleared" },
      {
        name: "expandable",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether the search bar expands on focus",
      },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Search Bar",
        code: `<SearchBar 
  placeholder="Search components..." 
  onSearch={(query) => console.log(query)} 
/>`,
        component: <SearchBar placeholder="Search components..." onSearch={(query) => console.log(query)} />,
      },
      {
        title: "Non-expandable",
        code: `<SearchBar 
  placeholder="Quick search" 
  expandable={false} 
/>`,
        component: <SearchBar placeholder="Quick search" expandable={false} />,
      },
    ],
    usage: `import { SearchBar } from "@/components/ui-kit/forms/search-bar"

export function SearchableList() {
  const [query, setQuery] = useState("")
  
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    // Perform search logic
  }
  
  return (
    <SearchBar
      placeholder="Search items..."
      onSearch={handleSearch}
      onClear={() => setQuery("")}
    />
  )
}`,
    bestPractices: [
      "Provide immediate visual feedback when typing",
      "Include a clear button for easy reset",
      "Consider debouncing search queries for performance",
      "Use appropriate placeholder text to guide users",
      "Implement keyboard shortcuts (Ctrl+K, Cmd+K) for power users",
    ],
    relatedComponents: ["AnimatedInput", "DataTable", "Pagination"],
  },

  "animated-checkbox": {
    name: "AnimatedCheckbox",
    category: "Forms",
    description: "Checkbox with spring animations and smooth state transitions",
    complexity: "Simple",
    props: [
      { name: "label", type: "string", required: true, description: "The checkbox label text" },
      { name: "checked", type: "boolean", required: false, description: "Controlled checked state" },
      { name: "defaultChecked", type: "boolean", required: false, description: "Default checked state" },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        default: "false",
        description: "Whether the checkbox is disabled",
      },
      {
        name: "onChange",
        type: "(checked: boolean) => void",
        required: false,
        description: "Callback when state changes",
      },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Checkbox",
        code: `<AnimatedCheckbox 
  label="I agree to the terms" 
  onChange={(checked) => console.log(checked)} 
/>`,
        component: <AnimatedCheckbox label="I agree to the terms" onChange={(checked) => console.log(checked)} />,
      },
      {
        title: "Pre-checked",
        code: `<AnimatedCheckbox 
  label="Enable notifications" 
  defaultChecked={true} 
/>`,
        component: <AnimatedCheckbox label="Enable notifications" defaultChecked={true} />,
      },
      {
        title: "Disabled State",
        code: `<AnimatedCheckbox 
  label="Unavailable option" 
  disabled 
/>`,
        component: <AnimatedCheckbox label="Unavailable option" disabled />,
      },
    ],
    usage: `import { AnimatedCheckbox } from "@/components/ui-kit/forms/animated-checkbox"

export function SettingsForm() {
  const [notifications, setNotifications] = useState(false)
  
  return (
    <AnimatedCheckbox
      label="Enable email notifications"
      checked={notifications}
      onChange={setNotifications}
    />
  )
}`,
    bestPractices: [
      "Use clear, actionable labels that describe what the checkbox does",
      "Group related checkboxes together logically",
      "Provide immediate visual feedback on state changes",
      "Consider using controlled components for form validation",
      "Ensure sufficient touch target size for mobile users",
    ],
    relatedComponents: ["AnimatedSwitch", "AnimatedRadioGroup", "FormSection"],
  },

  "animated-radio-group": {
    name: "AnimatedRadioGroup",
    category: "Forms",
    description: "Radio button group with hover effects and smooth animations",
    complexity: "Medium",
    props: [
      { name: "options", type: "Array<{value: string, label: string}>", required: true, description: "Radio options" },
      { name: "value", type: "string", required: false, description: "Controlled selected value" },
      { name: "defaultValue", type: "string", required: false, description: "Default selected value" },
      { name: "name", type: "string", required: true, description: "Radio group name" },
      {
        name: "onChange",
        type: "(value: string) => void",
        required: false,
        description: "Callback when selection changes",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        default: "false",
        description: "Whether the radio group is disabled",
      },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Radio Group",
        code: `<AnimatedRadioGroup 
  name="theme" 
  options={[
    { value: "light", label: "Light Mode" },
    { value: "dark", label: "Dark Mode" },
    { value: "auto", label: "Auto" }
  ]}
  onChange={(value) => console.log(value)} 
/>`,
        component: (
          <AnimatedRadioGroup
            name="theme"
            options={[
              { value: "light", label: "Light Mode" },
              { value: "dark", label: "Dark Mode" },
              { value: "auto", label: "Auto" },
            ]}
            onChange={(value) => console.log(value)}
          />
        ),
      },
      {
        title: "With Default Selection",
        code: `<AnimatedRadioGroup 
  name="size" 
  defaultValue="medium"
  options={[
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" }
  ]}
/>`,
        component: (
          <AnimatedRadioGroup
            name="size"
            defaultValue="medium"
            options={[
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ]}
          />
        ),
      },
    ],
    usage: `import { AnimatedRadioGroup } from "@/components/ui-kit/forms/animated-radio-group"

export function PreferencesForm() {
  const [theme, setTheme] = useState("light")
  
  const themeOptions = [
    { value: "light", label: "Light Mode" },
    { value: "dark", label: "Dark Mode" },
    { value: "auto", label: "System Default" }
  ]
  
  return (
    <AnimatedRadioGroup
      name="theme-preference"
      options={themeOptions}
      value={theme}
      onChange={setTheme}
    />
  )
}`,
    bestPractices: [
      "Use radio buttons for mutually exclusive choices",
      "Provide clear, distinct labels for each option",
      "Consider the logical order of options",
      "Use consistent naming conventions for radio groups",
      "Ensure all options are visible without scrolling when possible",
    ],
    relatedComponents: ["AnimatedCheckbox", "AnimatedSelect", "FormSection"],
  },

  "animated-select": {
    name: "AnimatedSelect",
    category: "Forms",
    description: "Dropdown select with focus animations and smooth transitions",
    complexity: "Medium",
    props: [
      { name: "label", type: "string", required: true, description: "The select label text" },
      { name: "options", type: "Array<{value: string, label: string}>", required: true, description: "Select options" },
      { name: "value", type: "string", required: false, description: "Controlled selected value" },
      { name: "defaultValue", type: "string", required: false, description: "Default selected value" },
      { name: "placeholder", type: "string", required: false, description: "Placeholder text" },
      {
        name: "onChange",
        type: "(value: string) => void",
        required: false,
        description: "Callback when selection changes",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        default: "false",
        description: "Whether the select is disabled",
      },
      { name: "error", type: "string", required: false, description: "Error message to display" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Select",
        code: `<AnimatedSelect 
  label="Country" 
  placeholder="Select a country"
  options={[
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" }
  ]}
/>`,
        component: (
          <AnimatedSelect
            label="Country"
            placeholder="Select a country"
            options={[
              { value: "us", label: "United States" },
              { value: "ca", label: "Canada" },
              { value: "uk", label: "United Kingdom" },
            ]}
          />
        ),
      },
      {
        title: "With Error State",
        code: `<AnimatedSelect 
  label="Priority" 
  error="Please select a priority level"
  options={[
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ]}
/>`,
        component: (
          <AnimatedSelect
            label="Priority"
            error="Please select a priority level"
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        ),
      },
    ],
    usage: `import { AnimatedSelect } from "@/components/ui-kit/forms/animated-select"

export function UserForm() {
  const [country, setCountry] = useState("")
  
  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Germany" }
  ]
  
  return (
    <AnimatedSelect
      label="Country"
      placeholder="Select your country"
      options={countryOptions}
      value={country}
      onChange={setCountry}
    />
  )
}`,
    bestPractices: [
      "Keep option lists manageable in length",
      "Use clear, descriptive labels for options",
      "Consider search functionality for long lists",
      "Provide meaningful placeholder text",
      "Group related options when appropriate",
    ],
    relatedComponents: ["AnimatedInput", "AnimatedRadioGroup", "SearchBar"],
  },

  "animated-textarea": {
    name: "AnimatedTextarea",
    category: "Forms",
    description: "Auto-resizing textarea with floating labels and smooth animations",
    complexity: "Medium",
    props: [
      { name: "label", type: "string", required: true, description: "The floating label text" },
      { name: "placeholder", type: "string", required: false, description: "Placeholder text when empty" },
      { name: "rows", type: "number", required: false, default: "3", description: "Initial number of rows" },
      {
        name: "maxRows",
        type: "number",
        required: false,
        default: "6",
        description: "Maximum number of rows before scrolling",
      },
      { name: "error", type: "string", required: false, description: "Error message to display" },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        default: "false",
        description: "Whether the textarea is disabled",
      },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Textarea",
        code: `<AnimatedTextarea 
  label="Message" 
  placeholder="Enter your message..." 
  rows={4} 
/>`,
        component: <AnimatedTextarea label="Message" placeholder="Enter your message..." rows={4} />,
      },
      {
        title: "With Error State",
        code: `<AnimatedTextarea 
  label="Feedback" 
  error="Message must be at least 10 characters" 
/>`,
        component: <AnimatedTextarea label="Feedback" error="Message must be at least 10 characters" />,
      },
      {
        title: "Auto-resizing",
        code: `<AnimatedTextarea 
  label="Description" 
  placeholder="Type to see auto-resize..." 
  maxRows={8} 
/>`,
        component: <AnimatedTextarea label="Description" placeholder="Type to see auto-resize..." maxRows={8} />,
      },
    ],
    usage: `import { AnimatedTextarea } from "@/components/ui-kit/forms/animated-textarea"

export function FeedbackForm() {
  const [message, setMessage] = useState("")
  
  return (
    <AnimatedTextarea
      label="Your Feedback"
      placeholder="Tell us what you think..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      rows={4}
      maxRows={8}
    />
  )
}`,
    bestPractices: [
      "Set appropriate initial rows for the expected content length",
      "Use maxRows to prevent excessive height on long content",
      "Provide clear labels and placeholder text",
      "Handle auto-resize gracefully in your layout",
      "Consider character limits for very long content",
    ],
    relatedComponents: ["AnimatedInput", "FormSection", "SearchBar"],
  },

  "animated-switch": {
    name: "AnimatedSwitch",
    category: "Forms",
    description: "Toggle switch with tap animations and smooth state transitions",
    complexity: "Simple",
    props: [
      { name: "label", type: "string", required: false, description: "Optional label text" },
      { name: "checked", type: "boolean", required: false, description: "Controlled checked state" },
      { name: "defaultChecked", type: "boolean", required: false, description: "Default checked state" },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        default: "false",
        description: "Whether the switch is disabled",
      },
      {
        name: "onChange",
        type: "(checked: boolean) => void",
        required: false,
        description: "Callback when state changes",
      },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, default: "md", description: "Switch size" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Switch",
        code: `<AnimatedSwitch 
  label="Dark Mode" 
  onChange={(checked) => console.log(checked)} 
/>`,
        component: <AnimatedSwitch label="Dark Mode" onChange={(checked) => console.log(checked)} />,
      },
      {
        title: "Different Sizes",
        code: `<div className="space-y-4">
  <AnimatedSwitch label="Small" size="sm" />
  <AnimatedSwitch label="Medium" size="md" />
  <AnimatedSwitch label="Large" size="lg" />
</div>`,
        component: (
          <div className="space-y-4">
            <AnimatedSwitch label="Small" size="sm" />
            <AnimatedSwitch label="Medium" size="md" />
            <AnimatedSwitch label="Large" size="lg" />
          </div>
        ),
      },
      {
        title: "Pre-enabled",
        code: `<AnimatedSwitch 
  label="Auto-save" 
  defaultChecked={true} 
/>`,
        component: <AnimatedSwitch label="Auto-save" defaultChecked={true} />,
      },
    ],
    usage: `import { AnimatedSwitch } from "@/components/ui-kit/forms/animated-switch"

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])
  
  return (
    <AnimatedSwitch
      label="Dark Mode"
      checked={darkMode}
      onChange={setDarkMode}
    />
  )
}`,
    bestPractices: [
      "Use switches for binary settings that take effect immediately",
      "Provide clear labels that indicate what the switch controls",
      "Use appropriate sizes for the context (small for compact UIs)",
      "Consider the visual hierarchy when placing switches",
      "Provide immediate feedback when the state changes",
    ],
    relatedComponents: ["AnimatedCheckbox", "AnimatedRadioGroup", "Button"],
  },

  "form-section": {
    name: "FormSection",
    category: "Forms",
    description: "Collapsible form sections for organizing complex forms",
    complexity: "Medium",
    props: [
      { name: "title", type: "string", required: true, description: "Section title" },
      { name: "description", type: "string", required: false, description: "Section description" },
      { name: "children", type: "React.ReactNode", required: true, description: "Form content" },
      { name: "defaultOpen", type: "boolean", required: false, default: "true", description: "Default open state" },
      {
        name: "collapsible",
        type: "boolean",
        required: false,
        default: "true",
        description: "Whether section can collapse",
      },
      {
        name: "required",
        type: "boolean",
        required: false,
        default: "false",
        description: "Whether section is required",
      },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Form Section",
        code: `<FormSection 
  title="Personal Information" 
  description="Basic details about yourself"
>
  <AnimatedInput label="First Name" />
  <AnimatedInput label="Last Name" />
</FormSection>`,
        component: (
          <FormSection title="Personal Information" description="Basic details about yourself">
            <div className="space-y-4">
              <AnimatedInput label="First Name" />
              <AnimatedInput label="Last Name" />
            </div>
          </FormSection>
        ),
      },
      {
        title: "Collapsible Section",
        code: `<FormSection 
  title="Advanced Settings" 
  defaultOpen={false}
  collapsible={true}
>
  <AnimatedSwitch label="Enable notifications" />
  <AnimatedSelect label="Theme" options={[...]} />
</FormSection>`,
        component: (
          <FormSection title="Advanced Settings" defaultOpen={false} collapsible={true}>
            <div className="space-y-4">
              <AnimatedSwitch label="Enable notifications" />
              <AnimatedSelect
                label="Theme"
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
              />
            </div>
          </FormSection>
        ),
      },
    ],
    usage: `import { FormSection } from "@/components/ui-kit/forms/form-section"

export function UserProfileForm() {
  return (
    <form className="space-y-6">
      <FormSection 
        title="Basic Information" 
        description="Your personal details"
        required
      >
        <AnimatedInput label="Full Name" required />
        <AnimatedInput label="Email" type="email" required />
      </FormSection>
      
      <FormSection 
        title="Preferences" 
        defaultOpen={false}
      >
        <AnimatedSwitch label="Email notifications" />
        <AnimatedSelect label="Language" options={languages} />
      </FormSection>
    </form>
  )
}`,
    bestPractices: [
      "Group related form fields logically",
      "Use clear, descriptive section titles",
      "Consider making optional sections collapsible",
      "Provide descriptions for complex sections",
      "Mark required sections clearly",
    ],
    relatedComponents: ["AnimatedInput", "AnimatedSelect", "AnimatedCheckbox"],
  },

  "stat-card": {
    name: "StatCard",
    category: "Data Display",
    description: "Animated statistics cards with progress indicators and trend visualization",
    complexity: "Medium",
    props: [
      { name: "title", type: "string", required: true, description: "The statistic title" },
      { name: "value", type: "string | number", required: true, description: "The main statistic value" },
      { name: "change", type: "number", required: false, description: "Percentage change (positive/negative)" },
      { name: "trend", type: "'up' | 'down' | 'neutral'", required: false, description: "Trend direction" },
      { name: "icon", type: "React.ComponentType", required: false, description: "Icon component to display" },
      { name: "progress", type: "number", required: false, description: "Progress percentage (0-100)" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Stat Card",
        code: `<StatCard 
  title="Total Users" 
  value="12,345" 
  change={12.5} 
  trend="up" 
/>`,
        component: <StatCard title="Total Users" value="12,345" change={12.5} trend="up" />,
      },
      {
        title: "With Progress Bar",
        code: `<StatCard 
  title="Goal Progress" 
  value="75%" 
  progress={75} 
  trend="up" 
/>`,
        component: <StatCard title="Goal Progress" value="75%" progress={75} trend="up" />,
      },
      {
        title: "Negative Trend",
        code: `<StatCard 
  title="Bounce Rate" 
  value="23.4%" 
  change={-5.2} 
  trend="down" 
/>`,
        component: <StatCard title="Bounce Rate" value="23.4%" change={-5.2} trend="down" />,
      },
    ],
    usage: `import { StatCard } from "@/components/ui-kit/data-display/stat-card"
import { Users } from 'lucide-react'

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Active Users"
        value="1,234"
        change={8.2}
        trend="up"
        icon={Users}
        progress={65}
      />
    </div>
  )
}`,
    bestPractices: [
      "Use consistent formatting for similar types of data",
      "Choose appropriate icons that represent the data",
      "Use color coding for trends (green for positive, red for negative)",
      "Include context with percentage changes when relevant",
      "Keep titles concise but descriptive",
    ],
    relatedComponents: ["InfoCard", "ProgressBar", "LineChart"],
  },

  "info-card": {
    name: "InfoCard",
    category: "Data Display",
    description: "General purpose information cards with flexible content layout",
    complexity: "Simple",
    props: [
      { name: "title", type: "string", required: true, description: "Card title" },
      { name: "description", type: "string", required: false, description: "Card description" },
      { name: "icon", type: "React.ComponentType", required: false, description: "Icon component to display" },
      { name: "badge", type: "string", required: false, description: "Badge text" },
      { name: "action", type: "React.ReactNode", required: false, description: "Action button or element" },
      {
        name: "variant",
        type: "'default' | 'highlighted' | 'minimal'",
        required: false,
        default: "default",
        description: "Card style variant",
      },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Info Card",
        code: `<InfoCard 
  title="Getting Started" 
  description="Learn the basics of using our platform" 
/>`,
        component: <InfoCard title="Getting Started" description="Learn the basics of using our platform" />,
      },
      {
        title: "With Icon and Badge",
        code: `<InfoCard 
  title="Premium Features" 
  description="Unlock advanced functionality" 
  badge="Pro" 
/>`,
        component: <InfoCard title="Premium Features" description="Unlock advanced functionality" badge="Pro" />,
      },
      {
        title: "With Action Button",
        code: `<InfoCard 
  title="Documentation" 
  description="Complete API reference and guides" 
  action={<Button size="sm">Read More</Button>} 
/>`,
        component: (
          <InfoCard
            title="Documentation"
            description="Complete API reference and guides"
            action={<Button size="sm">Read More</Button>}
          />
        ),
      },
    ],
    usage: `import { InfoCard } from "@/components/ui-kit/data-display/info-card"
import { Book } from 'lucide-react'

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InfoCard
        title="Documentation"
        description="Comprehensive guides and API reference"
        icon={Book}
        action={<Button variant="outline">Learn More</Button>}
      />
    </div>
  )
}`,
    bestPractices: [
      "Keep titles concise and descriptive",
      "Use descriptions to provide additional context",
      "Choose icons that clearly represent the content",
      "Use badges sparingly for important highlights",
      "Ensure actions are clearly labeled and accessible",
    ],
    relatedComponents: ["StatCard", "AnimatedCard", "Button"],
  },

  "data-table": {
    name: "DataTable",
    category: "Data Display",
    description: "Sortable, searchable table with pagination and advanced features",
    complexity: "Complex",
    props: [
      { name: "data", type: "Array<Record<string, any>>", required: true, description: "Table data" },
      { name: "columns", type: "Array<ColumnDef>", required: true, description: "Column definitions" },
      {
        name: "searchable",
        type: "boolean",
        required: false,
        default: "true",
        description: "Enable search functionality",
      },
      { name: "sortable", type: "boolean", required: false, default: "true", description: "Enable column sorting" },
      { name: "pagination", type: "boolean", required: false, default: "true", description: "Enable pagination" },
      { name: "pageSize", type: "number", required: false, default: "10", description: "Items per page" },
      { name: "loading", type: "boolean", required: false, default: "false", description: "Loading state" },
      { name: "onRowClick", type: "(row: any) => void", required: false, description: "Row click handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Data Table",
        code: `const data = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive" }
]

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" }
]

<DataTable data={data} columns={columns} />`,
        component: (
          <DataTable
            data={[
              { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
              { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive" },
              { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Active" },
            ]}
            columns={[
              { key: "name", label: "Name", sortable: true },
              { key: "email", label: "Email" },
              { key: "status", label: "Status" },
            ]}
          />
        ),
      },
    ],
    usage: `import { DataTable } from "@/components/ui-kit/data-display/data-table"

export function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role" },
    { key: "lastLogin", label: "Last Login", sortable: true }
  ]
  
  return (
    <DataTable
      data={users}
      columns={columns}
      loading={loading}
      searchable={true}
      pagination={true}
      pageSize={20}
      onRowClick={(user) => navigate(\`/users/\${user.id}\`)}
    />
  )
}`,
    bestPractices: [
      "Define clear, descriptive column headers",
      "Enable sorting for relevant columns",
      "Use appropriate page sizes for your data",
      "Provide loading states for async data",
      "Consider mobile responsiveness for table layouts",
    ],
    relatedComponents: ["SearchBar", "Pagination", "LoadingSpinner"],
  },

  timeline: {
    name: "Timeline",
    category: "Data Display",
    description: "Vertical/horizontal timeline component for displaying chronological events",
    complexity: "Medium",
    props: [
      { name: "items", type: "Array<TimelineItem>", required: true, description: "Timeline items" },
      {
        name: "orientation",
        type: "'vertical' | 'horizontal'",
        required: false,
        default: "vertical",
        description: "Timeline orientation",
      },
      {
        name: "variant",
        type: "'default' | 'minimal' | 'detailed'",
        required: false,
        default: "default",
        description: "Timeline style",
      },
      {
        name: "showConnectors",
        type: "boolean",
        required: false,
        default: "true",
        description: "Show connecting lines",
      },
      { name: "animated", type: "boolean", required: false, default: "true", description: "Enable animations" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Timeline",
        code: `const timelineItems = [
  {
    title: "Account Created",
    description: "User registered successfully",
    timestamp: "2024-01-15",
    status: "completed"
  },
  {
    title: "Profile Updated",
    description: "Added profile picture and bio",
    timestamp: "2024-01-16",
    status: "completed"
  },
  {
    title: "First Purchase",
    description: "Bought premium subscription",
    timestamp: "2024-01-20",
    status: "active"
  }
]

<Timeline items={timelineItems} />`,
        component: (
          <Timeline
            items={[
              {
                title: "Account Created",
                description: "User registered successfully",
                timestamp: "2024-01-15",
                status: "completed",
              },
              {
                title: "Profile Updated",
                description: "Added profile picture and bio",
                timestamp: "2024-01-16",
                status: "completed",
              },
              {
                title: "First Purchase",
                description: "Bought premium subscription",
                timestamp: "2024-01-20",
                status: "active",
              },
            ]}
          />
        ),
      },
    ],
    usage: `import { Timeline } from "@/components/ui-kit/data-display/timeline"

export function UserJourney() {
  const [events, setEvents] = useState([])
  
  useEffect(() => {
    fetchUserEvents().then(setEvents)
  }, [])
  
  return (
    <Timeline
      items={events}
      orientation="vertical"
      variant="detailed"
      animated={true}
    />
  )
}`,
    bestPractices: [
      "Order items chronologically (newest first or oldest first consistently)",
      "Provide clear, descriptive titles for each event",
      "Use appropriate status indicators for different event types",
      "Consider the amount of detail needed for your use case",
      "Test with various screen sizes for responsive design",
    ],
    relatedComponents: ["InfoCard", "StatCard", "ProgressBar"],
  },

  "line-chart": {
    name: "LineChart",
    category: "Charts",
    description: "Animated SVG line charts with customizable styling and interactive features",
    complexity: "Complex",
    props: [
      {
        name: "data",
        type: "Array<{x: string | number, y: number}>",
        required: true,
        description: "Chart data points",
      },
      { name: "width", type: "number", required: false, default: "400", description: "Chart width in pixels" },
      { name: "height", type: "number", required: false, default: "200", description: "Chart height in pixels" },
      { name: "color", type: "string", required: false, default: "#3b82f6", description: "Line color" },
      { name: "strokeWidth", type: "number", required: false, default: "2", description: "Line thickness" },
      { name: "showDots", type: "boolean", required: false, default: "true", description: "Show data point dots" },
      { name: "showGrid", type: "boolean", required: false, default: "true", description: "Show background grid" },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable animations" },
    ],
    examples: [
      {
        title: "Basic Line Chart",
        code: `const data = [
  { x: "Jan", y: 65 },
  { x: "Feb", y: 78 },
  { x: "Mar", y: 82 },
  { x: "Apr", y: 75 },
  { x: "May", y: 90 }
]

<LineChart data={data} />`,
        component: (
          <LineChart
            data={[
              { x: "Jan", y: 65 },
              { x: "Feb", y: 78 },
              { x: "Mar", y: 82 },
              { x: "Apr", y: 75 },
              { x: "May", y: 90 },
            ]}
          />
        ),
      },
      {
        title: "Custom Styling",
        code: `<LineChart 
  data={data} 
  color="#10b981" 
  strokeWidth={3} 
  showDots={false} 
/>`,
        component: (
          <LineChart
            data={[
              { x: "Week 1", y: 45 },
              { x: "Week 2", y: 52 },
              { x: "Week 3", y: 48 },
              { x: "Week 4", y: 61 },
            ]}
            color="#10b981"
            strokeWidth={3}
            showDots={false}
          />
        ),
      },
    ],
    usage: `import { LineChart } from "@/components/ui-kit/charts/line-chart"

export function MoodTrends() {
  const moodData = [
    { x: "Mon", y: 7.2 },
    { x: "Tue", y: 8.1 },
    { x: "Wed", y: 6.8 },
    { x: "Thu", y: 7.9 },
    { x: "Fri", y: 8.5 }
  ]
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Weekly Mood Trends</h3>
      <LineChart
        data={moodData}
        width={500}
        height={250}
        color="#0ea5e9"
        showGrid={true}
      />
    </div>
  )
}`,
    bestPractices: [
      "Ensure data is properly formatted with x and y values",
      "Choose colors that match your design system",
      "Consider accessibility with sufficient color contrast",
      "Use appropriate chart dimensions for the container",
      "Provide meaningful labels and context for the data",
    ],
    relatedComponents: ["BarChart", "DonutChart", "StatCard"],
  },

  "bar-chart": {
    name: "BarChart",
    category: "Charts",
    description: "Animated bar charts with customizable styling and hover effects",
    complexity: "Medium",
    props: [
      {
        name: "data",
        type: "Array<{label: string, value: number}>",
        required: true,
        description: "Chart data points",
      },
      { name: "width", type: "number", required: false, default: "400", description: "Chart width in pixels" },
      { name: "height", type: "number", required: false, default: "300", description: "Chart height in pixels" },
      { name: "color", type: "string", required: false, default: "#3b82f6", description: "Bar color" },
      { name: "showValues", type: "boolean", required: false, default: "true", description: "Show values on bars" },
      { name: "showGrid", type: "boolean", required: false, default: "true", description: "Show background grid" },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable animations" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Bar Chart",
        code: `const data = [
  { label: "Jan", value: 65 },
  { label: "Feb", value: 78 },
  { label: "Mar", value: 82 },
  { label: "Apr", value: 75 }
]

<BarChart data={data} />`,
        component: (
          <BarChart
            data={[
              { label: "Jan", value: 65 },
              { label: "Feb", value: 78 },
              { label: "Mar", value: 82 },
              { label: "Apr", value: 75 },
            ]}
          />
        ),
      },
    ],
    usage: `import { BarChart } from "@/components/ui-kit/charts/bar-chart"

export function SalesChart() {
  const salesData = [
    { label: "Q1", value: 12500 },
    { label: "Q2", value: 15800 },
    { label: "Q3", value: 18200 },
    { label: "Q4", value: 21000 }
  ]
  
  return (
    <BarChart
      data={salesData}
      width={600}
      height={400}
      color="#10b981"
      showValues={true}
    />
  )
}`,
    bestPractices: [
      "Use consistent spacing between bars",
      "Choose appropriate colors for your data",
      "Consider showing values for precise data reading",
      "Use meaningful labels for categories",
      "Ensure the chart is readable at different screen sizes",
    ],
    relatedComponents: ["LineChart", "DonutChart", "StatCard"],
  },

  "donut-chart": {
    name: "DonutChart",
    category: "Charts",
    description: "Donut/pie charts with legends and interactive hover effects",
    complexity: "Complex",
    props: [
      {
        name: "data",
        type: "Array<{label: string, value: number, color?: string}>",
        required: true,
        description: "Chart data segments",
      },
      { name: "size", type: "number", required: false, default: "200", description: "Chart diameter in pixels" },
      { name: "innerRadius", type: "number", required: false, default: "60", description: "Inner radius percentage" },
      { name: "showLegend", type: "boolean", required: false, default: "true", description: "Show legend" },
      { name: "showLabels", type: "boolean", required: false, default: "true", description: "Show segment labels" },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable animations" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Donut Chart",
        code: `const data = [
  { label: "Desktop", value: 45, color: "#3b82f6" },
  { label: "Mobile", value: 35, color: "#10b981" },
  { label: "Tablet", value: 20, color: "#f59e0b" }
]

<DonutChart data={data} />`,
        component: (
          <DonutChart
            data={[
              { label: "Desktop", value: 45, color: "#3b82f6" },
              { label: "Mobile", value: 35, color: "#10b981" },
              { label: "Tablet", value: 20, color: "#f59e0b" },
            ]}
          />
        ),
      },
    ],
    usage: `import { DonutChart } from "@/components/ui-kit/charts/donut-chart"

export function TrafficSources() {
  const trafficData = [
    { label: "Organic Search", value: 45, color: "#3b82f6" },
    { label: "Direct", value: 25, color: "#10b981" },
    { label: "Social Media", value: 20, color: "#f59e0b" },
    { label: "Referral", value: 10, color: "#ef4444" }
  ]
  
  return (
    <DonutChart
      data={trafficData}
      size={300}
      showLegend={true}
      showLabels={true}
    />
  )
}`,
    bestPractices: [
      "Use distinct colors for different segments",
      "Limit the number of segments for readability",
      "Include a legend for segment identification",
      "Consider showing percentages or values",
      "Use consistent color schemes across your application",
    ],
    relatedComponents: ["LineChart", "BarChart", "StatCard"],
  },

  breadcrumbs: {
    name: "Breadcrumbs",
    category: "Navigation",
    description: "Breadcrumb navigation for showing current page location",
    complexity: "Simple",
    props: [
      { name: "items", type: "Array<{label: string, href?: string}>", required: true, description: "Breadcrumb items" },
      { name: "separator", type: "React.ReactNode", required: false, default: "/", description: "Separator element" },
      { name: "maxItems", type: "number", required: false, description: "Maximum items to show" },
      { name: "showHome", type: "boolean", required: false, default: "true", description: "Show home icon" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Breadcrumbs",
        code: `const items = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Laptops", href: "/products/laptops" },
  { label: "MacBook Pro" }
]

<Breadcrumbs items={items} />`,
        component: (
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: "Laptops", href: "/products/laptops" },
              { label: "MacBook Pro" },
            ]}
          />
        ),
      },
    ],
    usage: `import { Breadcrumbs } from "@/components/ui-kit/navigation/breadcrumbs"

export function ProductPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: "Electronics", href: "/categories/electronics" },
    { label: "Current Product" }
  ]
  
  return (
    <div>
      <Breadcrumbs 
        items={breadcrumbItems}
        maxItems={4}
        showHome={true}
      />
      {/* Page content */}
    </div>
  )
}`,
    bestPractices: [
      "Always make intermediate items clickable",
      "Keep labels concise but descriptive",
      "Use consistent separator styling",
      "Consider truncating very long breadcrumb trails",
      "Ensure breadcrumbs reflect the actual site hierarchy",
    ],
    relatedComponents: ["Pagination", "StepIndicator", "Button"],
  },

  pagination: {
    name: "Pagination",
    category: "Navigation",
    description: "Full-featured pagination with page numbers and navigation controls",
    complexity: "Medium",
    props: [
      { name: "currentPage", type: "number", required: true, description: "Current active page" },
      { name: "totalPages", type: "number", required: true, description: "Total number of pages" },
      { name: "onPageChange", type: "(page: number) => void", required: true, description: "Page change handler" },
      {
        name: "showFirstLast",
        type: "boolean",
        required: false,
        default: "true",
        description: "Show first/last buttons",
      },
      {
        name: "showPrevNext",
        type: "boolean",
        required: false,
        default: "true",
        description: "Show prev/next buttons",
      },
      {
        name: "siblingCount",
        type: "number",
        required: false,
        default: "1",
        description: "Number of siblings to show",
      },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, default: "md", description: "Pagination size" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Pagination",
        code: `<Pagination 
  currentPage={3} 
  totalPages={10} 
  onPageChange={(page) => console.log(page)} 
/>`,
        component: <Pagination currentPage={3} totalPages={10} onPageChange={(page) => console.log(page)} />,
      },
      {
        title: "Compact Pagination",
        code: `<Pagination 
  currentPage={5} 
  totalPages={20} 
  onPageChange={(page) => console.log(page)}
  size="sm"
  siblingCount={0}
/>`,
        component: (
          <Pagination
            currentPage={5}
            totalPages={20}
            onPageChange={(page) => console.log(page)}
            size="sm"
            siblingCount={0}
          />
        ),
      },
    ],
    usage: `import { Pagination } from "@/components/ui-kit/navigation/pagination"

export function ProductList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState([])
  const totalPages = Math.ceil(products.length / 10)
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Fetch new data or update view
  }
  
  return (
    <div>
      {/* Product list */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        showFirstLast={true}
        siblingCount={2}
      />
    </div>
  )
}`,
    bestPractices: [
      "Always provide clear visual feedback for the current page",
      "Consider the total number of pages when choosing sibling count",
      "Provide keyboard navigation support",
      "Use appropriate sizing for your layout",
      "Consider infinite scroll for very large datasets",
    ],
    relatedComponents: ["DataTable", "SearchBar", "Button"],
  },

  "step-indicator": {
    name: "StepIndicator",
    category: "Navigation",
    description: "Step-by-step progress indicator for multi-step processes",
    complexity: "Medium",
    props: [
      {
        name: "steps",
        type: "Array<{label: string, description?: string}>",
        required: true,
        description: "Step definitions",
      },
      { name: "currentStep", type: "number", required: true, description: "Current active step (0-based)" },
      { name: "completedSteps", type: "number[]", required: false, description: "Array of completed step indices" },
      {
        name: "orientation",
        type: "'horizontal' | 'vertical'",
        required: false,
        default: "horizontal",
        description: "Layout orientation",
      },
      { name: "showLabels", type: "boolean", required: false, default: "true", description: "Show step labels" },
      { name: "clickable", type: "boolean", required: false, default: "false", description: "Allow clicking on steps" },
      { name: "onStepClick", type: "(step: number) => void", required: false, description: "Step click handler" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Step Indicator",
        code: `const steps = [
  { label: "Account", description: "Create your account" },
  { label: "Profile", description: "Set up your profile" },
  { label: "Preferences", description: "Choose your settings" },
  { label: "Complete", description: "Finish setup" }
]

<StepIndicator 
  steps={steps} 
  currentStep={1} 
  completedSteps={[0]} 
/>`,
        component: (
          <StepIndicator
            steps={[
              { label: "Account", description: "Create your account" },
              { label: "Profile", description: "Set up your profile" },
              { label: "Preferences", description: "Choose your settings" },
              { label: "Complete", description: "Finish setup" },
            ]}
            currentStep={1}
            completedSteps={[0]}
          />
        ),
      },
    ],
    usage: `import { StepIndicator } from "@/components/ui-kit/navigation/step-indicator"

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  
  const steps = [
    { label: "Welcome", description: "Get started" },
    { label: "Profile", description: "Tell us about yourself" },
    { label: "Preferences", description: "Customize your experience" },
    { label: "Done", description: "You're all set!" }
  ]
  
  const handleStepComplete = () => {
    setCompletedSteps([...completedSteps, currentStep])
    setCurrentStep(currentStep + 1)
  }
  
  return (
    <div>
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        clickable={true}
        onStepClick={setCurrentStep}
      />
      {/* Step content */}
    </div>
  )
}`,
    bestPractices: [
      "Use clear, descriptive labels for each step",
      "Provide helpful descriptions when space allows",
      "Show progress clearly with visual indicators",
      "Consider allowing users to navigate to previous steps",
      "Use appropriate orientation for your layout",
    ],
    relatedComponents: ["ProgressBar", "Breadcrumbs", "Button"],
  },

  "loading-spinner": {
    name: "LoadingSpinner",
    category: "Feedback",
    description: "Customizable loading spinners with multiple animation styles",
    complexity: "Simple",
    props: [
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, default: "md", description: "Spinner size" },
      { name: "color", type: "string", required: false, default: "currentColor", description: "Spinner color" },
      {
        name: "variant",
        type: "'spin' | 'pulse' | 'bounce'",
        required: false,
        default: "spin",
        description: "Animation style",
      },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Different Sizes",
        code: `<div className="flex items-center gap-4">
  <LoadingSpinner size="sm" />
  <LoadingSpinner size="md" />
  <LoadingSpinner size="lg" />
</div>`,
        component: (
          <div className="flex items-center gap-4">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
          </div>
        ),
      },
      {
        title: "Different Variants",
        code: `<div className="flex items-center gap-4">
  <LoadingSpinner variant="spin" />
  <LoadingSpinner variant="pulse" />
  <LoadingSpinner variant="bounce" />
</div>`,
        component: (
          <div className="flex items-center gap-4">
            <LoadingSpinner variant="spin" />
            <LoadingSpinner variant="pulse" />
            <LoadingSpinner variant="bounce" />
          </div>
        ),
      },
    ],
    usage: `import { LoadingSpinner } from "@/components/ui-kit/
          </div>
        ),
      },
    ],
    usage: \`import { LoadingSpinner } from "@/components/ui-kit/feedback/loading-spinner"

export function AsyncButton() {
  const [loading, setLoading] = useState(false)
  
  const handleClick = async () => {
    setLoading(true)
    try {
      await someAsyncOperation()
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? <LoadingSpinner size="sm" /> : "Submit"}
    </Button>
  )
}`,
    bestPractices: [
      "Use appropriate sizes for the context (small for buttons, large for page loading)",
      "Provide alternative text for screen readers",
      "Don't overuse loading states - only when necessary",
      "Consider skeleton loading for better perceived performance",
      "Match the spinner color to your design system",
    ],
    relatedComponents: ["ProgressBar", "AlertBanner", "Button"],
  },

  "progress-bar": {
    name: "ProgressBar",
    category: "Feedback",
    description: "Animated progress indicators with customizable styling",
    complexity: "Simple",
    props: [
      { name: "value", type: "number", required: true, description: "Progress value (0-100)" },
      { name: "max", type: "number", required: false, default: "100", description: "Maximum value" },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, default: "md", description: "Progress bar size" },
      {
        name: "variant",
        type: "'default' | 'success' | 'warning' | 'error'",
        required: false,
        default: "default",
        description: "Color variant",
      },
      { name: "showLabel", type: "boolean", required: false, default: "false", description: "Show percentage label" },
      { name: "animated", type: "boolean", required: false, default: "true", description: "Enable animations" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Progress",
        code: `<ProgressBar value={65} showLabel />`,
        component: <ProgressBar value={65} showLabel />,
      },
      {
        title: "Different Variants",
        code: `<div className="space-y-4">
  <ProgressBar value={30} variant="default" showLabel />
  <ProgressBar value={60} variant="success" showLabel />
  <ProgressBar value={80} variant="warning" showLabel />
  <ProgressBar value={95} variant="error" showLabel />
</div>`,
        component: (
          <div className="space-y-4">
            <ProgressBar value={30} variant="default" showLabel />
            <ProgressBar value={60} variant="success" showLabel />
            <ProgressBar value={80} variant="warning" showLabel />
            <ProgressBar value={95} variant="error" showLabel />
          </div>
        ),
      },
    ],
    usage: `import { ProgressBar } from "@/components/ui-kit/feedback/progress-bar"

export function FileUpload() {
  const [progress, setProgress] = useState(0)
  
  const handleUpload = async () => {
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
  
  return (
    <div>
      <ProgressBar 
        value={progress} 
        variant={progress === 100 ? "success" : "default"}
        showLabel 
      />
      <Button onClick={handleUpload}>Start Upload</Button>
    </div>
  )
}`,
    bestPractices: [
      "Always provide context about what the progress represents",
      "Use appropriate variants to indicate status (success, warning, error)",
      "Consider showing labels for important progress indicators",
      "Animate progress changes for better user experience",
      "Use consistent sizing throughout your application",
    ],
    relatedComponents: ["LoadingSpinner", "StatCard", "AlertBanner"],
  },

  toast: {
    name: "Toast",
    category: "Feedback",
    description: "Toast notifications system with multiple variants and auto-dismiss",
    complexity: "Medium",
    props: [
      { name: "title", type: "string", required: true, description: "Toast title" },
      { name: "description", type: "string", required: false, description: "Toast description" },
      {
        name: "variant",
        type: "'default' | 'success' | 'warning' | 'error'",
        required: false,
        default: "default",
        description: "Toast variant",
      },
      { name: "duration", type: "number", required: false, default: "5000", description: "Auto-dismiss duration (ms)" },
      { name: "action", type: "React.ReactNode", required: false, description: "Action button" },
      { name: "onClose", type: "() => void", required: false, description: "Close handler" },
      { name: "persistent", type: "boolean", required: false, default: "false", description: "Prevent auto-dismiss" },
    ],
    examples: [
      {
        title: "Basic Toast",
        code: `<Toast 
  title="Success!" 
  description="Your changes have been saved." 
  variant="success" 
/>`,
        component: <Toast title="Success!" description="Your changes have been saved." variant="success" />,
      },
    ],
    usage: `import { Toast, ToastContainer } from "@/components/ui-kit/feedback/toast-notification"

export function useToast() {
  const showToast = (message: string, variant = 'default') => {
    // Toast implementation
  }
  
  return { showToast }
}

export function SaveButton() {
  const { showToast } = useToast()
  
  const handleSave = async () => {
    try {
      await saveData()
      showToast("Data saved successfully!", "success")
    } catch (error) {
      showToast("Failed to save data", "error")
    }
  }
  
  return <Button onClick={handleSave}>Save</Button>
}`,
    bestPractices: [
      "Use appropriate variants for different message types",
      "Keep messages concise and actionable",
      "Provide actions when users can take next steps",
      "Consider auto-dismiss timing based on message importance",
      "Position toasts consistently in your application",
    ],
    relatedComponents: ["AlertBanner", "Button", "LoadingSpinner"],
  },

  "alert-banner": {
    name: "AlertBanner",
    category: "Feedback",
    description: "Alert banners with actions and dismissible functionality",
    complexity: "Medium",
    props: [
      { name: "title", type: "string", required: true, description: "Alert title" },
      { name: "description", type: "string", required: false, description: "Alert description" },
      {
        name: "variant",
        type: "'info' | 'success' | 'warning' | 'error'",
        required: false,
        default: "info",
        description: "Alert variant",
      },
      { name: "dismissible", type: "boolean", required: false, default: "true", description: "Show dismiss button" },
      { name: "action", type: "React.ReactNode", required: false, description: "Action button" },
      { name: "onDismiss", type: "() => void", required: false, description: "Dismiss handler" },
      { name: "icon", type: "React.ComponentType", required: false, description: "Custom icon" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Info Alert",
        code: `<AlertBanner 
  title="New Feature Available" 
  description="Check out our latest updates in the dashboard." 
  variant="info" 
/>`,
        component: (
          <AlertBanner
            title="New Feature Available"
            description="Check out our latest updates in the dashboard."
            variant="info"
          />
        ),
      },
      {
        title: "Error Alert with Action",
        code: `<AlertBanner 
  title="Connection Error" 
  description="Unable to connect to server." 
  variant="error"
  action={<Button size="sm">Retry</Button>}
/>`,
        component: (
          <AlertBanner
            title="Connection Error"
            description="Unable to connect to server."
            variant="error"
            action={<Button size="sm">Retry</Button>}
          />
        ),
      },
    ],
    usage: `import { AlertBanner } from "@/components/ui-kit/feedback/alert-banner"

export function SystemStatus() {
  const [showAlert, setShowAlert] = useState(true)
  
  if (!showAlert) return null
  
  return (
    <AlertBanner
      title="Maintenance Scheduled"
      description="System will be down for maintenance on Sunday at 2 AM."
      variant="warning"
      dismissible={true}
      onDismiss={() => setShowAlert(false)}
      action={<Button variant="outline" size="sm">Learn More</Button>}
    />
  )
}`,
    bestPractices: [
      "Use appropriate variants to convey message urgency",
      "Provide clear, actionable information",
      "Include relevant actions when users can respond",
      "Consider placement and timing of alerts",
      "Allow dismissal for non-critical alerts",
    ],
    relatedComponents: ["Toast", "Button", "InfoCard"],
  },

  // Add placeholder documentation for remaining components
  "animated-modal": {
    name: "AnimatedModal",
    category: "Overlays",
    description: "Modal with entrance/exit animations and backdrop blur",
    complexity: "Medium",
    props: [
      { name: "open", type: "boolean", required: true, description: "Modal open state" },
      { name: "onClose", type: "() => void", required: true, description: "Close handler" },
      { name: "title", type: "string", required: false, description: "Modal title" },
      { name: "children", type: "React.ReactNode", required: true, description: "Modal content" },
      { name: "size", type: "'sm' | 'md' | 'lg' | 'xl'", required: false, default: "md", description: "Modal size" },
      {
        name: "closeOnBackdrop",
        type: "boolean",
        required: false,
        default: "true",
        description: "Close on backdrop click",
      },
    ],
    examples: [
      {
        title: "Basic Modal",
        code: `<AnimatedModal 
  open={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to continue?</p>
  <div className="flex gap-2 mt-4">
    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="destructive">Confirm</Button>
  </div>
</AnimatedModal>`,
        component: <div className="p-4 border rounded">Modal Preview (Click to open in real app)</div>,
      },
    ],
    usage: `import { AnimatedModal } from "@/components/ui-kit/overlays/animated-modal"

export function DeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Delete Item</Button>
      <AnimatedModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <p>This action cannot be undone.</p>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </AnimatedModal>
    </>
  )
}`,
    bestPractices: [
      "Use modals sparingly to avoid interrupting user flow",
      "Provide clear actions and escape routes",
      "Use appropriate sizes for content",
      "Ensure keyboard accessibility (ESC to close)",
      "Consider mobile responsiveness",
    ],
    relatedComponents: ["ConfirmationDialog", "Button", "AlertBanner"],
  },

  "confirmation-dialog": {
    name: "ConfirmationDialog",
    category: "Overlays",
    description: "Confirmation dialogs with different types and customizable actions",
    complexity: "Medium",
    props: [
      { name: "open", type: "boolean", required: true, description: "Dialog open state" },
      { name: "onClose", type: "() => void", required: true, description: "Close handler" },
      { name: "title", type: "string", required: true, description: "Dialog title" },
      { name: "description", type: "string", required: true, description: "Dialog description" },
      { name: "confirmText", type: "string", required: false, default: "Confirm", description: "Confirm button text" },
      { name: "cancelText", type: "string", required: false, default: "Cancel", description: "Cancel button text" },
      {
        name: "variant",
        type: "'default' | 'destructive'",
        required: false,
        default: "default",
        description: "Dialog variant",
      },
      { name: "onConfirm", type: "() => void", required: true, description: "Confirm handler" },
    ],
    examples: [
      {
        title: "Destructive Confirmation",
        code: `<ConfirmationDialog
  open={showDialog}
  onClose={() => setShowDialog(false)}
  title="Delete Account"
  description="This will permanently delete your account and all data."
  variant="destructive"
  confirmText="Delete Account"
  onConfirm={handleDelete}
/>`,
        component: <div className="p-4 border rounded">Confirmation Dialog Preview</div>,
      },
    ],
    usage: `import { ConfirmationDialog } from "@/components/ui-kit/overlays/confirmation-dialog"

export function AccountSettings() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const handleDeleteAccount = async () => {
    await deleteAccount()
    setShowDeleteDialog(false)
    // Redirect to login
  }
  
  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setShowDeleteDialog(true)}
      >
        Delete Account
      </Button>
      
      <ConfirmationDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Account"
        description="This action cannot be undone. All your data will be permanently deleted."
        variant="destructive"
        confirmText="Delete Account"
        onConfirm={handleDeleteAccount}
      />
    </>
  )
}`,
    bestPractices: [
      "Use clear, specific language in titles and descriptions",
      "Use destructive variant for irreversible actions",
      "Provide context about consequences",
      "Make confirm buttons clearly labeled",
      "Consider requiring additional confirmation for critical actions",
    ],
    relatedComponents: ["AnimatedModal", "AlertBanner", "Button"],
  },

  "tooltip-menu": {
    name: "TooltipMenu",
    category: "Overlays",
    description: "Custom tooltip menus with positioning and interactive content",
    complexity: "Complex",
    props: [
      { name: "trigger", type: "React.ReactNode", required: true, description: "Trigger element" },
      { name: "content", type: "React.ReactNode", required: true, description: "Tooltip content" },
      {
        name: "position",
        type: "'top' | 'bottom' | 'left' | 'right'",
        required: false,
        default: "top",
        description: "Tooltip position",
      },
      { name: "delay", type: "number", required: false, default: "200", description: "Show delay in ms" },
      {
        name: "interactive",
        type: "boolean",
        required: false,
        default: "false",
        description: "Allow interaction with content",
      },
      { name: "maxWidth", type: "number", required: false, description: "Maximum width in pixels" },
    ],
    examples: [
      {
        title: "Basic Tooltip",
        code: `<TooltipMenu
  trigger={<Button>Hover me</Button>}
  content="This is a helpful tooltip"
  position="top"
/>`,
        component: (
          <TooltipMenu trigger={<Button>Hover me</Button>} content="This is a helpful tooltip" position="top" />
        ),
      },
    ],
    usage: `import { TooltipMenu } from "@/components/ui-kit/overlays/tooltip-menu"

export function HelpfulButton() {
  return (
    <TooltipMenu
      trigger={
        <Button variant="outline">
          <HelpCircle className="h-4 w-4" />
        </Button>
      }
      content={
        <div className="p-2">
          <p className="font-medium">Need Help?</p>
          <p className="text-sm text-gray-600">
            Click here to open the help center
          </p>
        </div>
      }
      position="bottom"
      interactive={true}
      maxWidth={200}
    />
  )
}`,
    bestPractices: [
      "Keep tooltip content concise and helpful",
      "Use appropriate positioning to avoid viewport edges",
      "Consider interactive tooltips for complex content",
      "Ensure tooltips don't interfere with other UI elements",
      "Test on mobile devices for touch interactions",
    ],
    relatedComponents: ["AnimatedModal", "Button", "InfoCard"],
  },

  "grid-container": {
    name: "GridContainer",
    category: "Layout",
    description: "Responsive grid container with animations and flexible layouts",
    complexity: "Medium",
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "Grid items" },
      {
        name: "columns",
        type: "number | object",
        required: false,
        default: "3",
        description: "Number of columns or responsive object",
      },
      { name: "gap", type: "number", required: false, default: "4", description: "Grid gap in Tailwind units" },
      {
        name: "animated",
        type: "boolean",
        required: false,
        default: "true",
        description: "Enable entrance animations",
      },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Responsive Grid",
        code: `<GridContainer columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
  <div className="p-4 bg-gray-100 rounded">Item 1</div>
  <div className="p-4 bg-gray-100 rounded">Item 2</div>
  <div className="p-4 bg-gray-100 rounded">Item 3</div>
</GridContainer>`,
        component: (
          <GridContainer columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
            <div className="p-4 bg-gray-100 rounded">Item 1</div>
            <div className="p-4 bg-gray-100 rounded">Item 2</div>
            <div className="p-4 bg-gray-100 rounded">Item 3</div>
          </GridContainer>
        ),
      },
    ],
    usage: `import { GridContainer } from "@/components/ui-kit/layout/grid-container"

export function ProductGrid() {
  return (
    <GridContainer 
      columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      gap={6}
      animated={true}
    >
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </GridContainer>
  )
}`,
    bestPractices: [
      "Use responsive column configurations for different screen sizes",
      "Consider content aspect ratios when setting grid layouts",
      "Use consistent gap spacing throughout your application",
      "Test grid layouts on various screen sizes",
      "Consider loading states for dynamic content",
    ],
    relatedComponents: ["InfoCard", "StatCard", "SectionDivider"],
  },

  "section-divider": {
    name: "SectionDivider",
    category: "Layout",
    description: "Section dividers with titles and customizable styling",
    complexity: "Simple",
    props: [
      { name: "title", type: "string", required: false, description: "Divider title" },
      { name: "subtitle", type: "string", required: false, description: "Divider subtitle" },
      {
        name: "orientation",
        type: "'horizontal' | 'vertical'",
        required: false,
        default: "horizontal",
        description: "Divider orientation",
      },
      {
        name: "variant",
        type: "'default' | 'dashed' | 'dotted'",
        required: false,
        default: "default",
        description: "Line style",
      },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Section with Title",
        code: `<SectionDivider 
  title="User Settings" 
  subtitle="Manage your account preferences" 
/>`,
        component: <SectionDivider title="User Settings" subtitle="Manage your account preferences" />,
      },
    ],
    usage: `import { SectionDivider } from "@/components/ui-kit/layout/section-divider"

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionDivider 
        title="Profile Information" 
        subtitle="Update your personal details"
      />
      {/* Profile form */}
      
      <SectionDivider 
        title="Security Settings" 
        subtitle="Manage passwords and authentication"
      />
      {/* Security form */}
    </div>
  )
}`,
    bestPractices: [
      "Use dividers to create clear visual separation",
      "Keep titles concise and descriptive",
      "Use subtitles to provide additional context",
      "Maintain consistent spacing around dividers",
      "Consider the visual hierarchy of your page",
    ],
    relatedComponents: ["GridContainer", "FormSection", "InfoCard"],
  },

  "image-gallery": {
    name: "ImageGallery",
    category: "Media",
    description: "Image gallery with lightbox functionality and responsive layouts",
    complexity: "Complex",
    props: [
      {
        name: "images",
        type: "Array<{src: string, alt: string, caption?: string}>",
        required: true,
        description: "Gallery images",
      },
      { name: "columns", type: "number", required: false, default: "3", description: "Number of columns" },
      { name: "lightbox", type: "boolean", required: false, default: "true", description: "Enable lightbox view" },
      { name: "aspectRatio", type: "string", required: false, default: "square", description: "Image aspect ratio" },
      { name: "gap", type: "number", required: false, default: "2", description: "Grid gap" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Gallery",
        code: `const images = [
  { src: "/image1.jpg", alt: "Image 1", caption: "Beautiful sunset" },
  { src: "/image2.jpg", alt: "Image 2", caption: "Mountain view" },
  { src: "/image3.jpg", alt: "Image 3", caption: "Ocean waves" }
]

<ImageGallery images={images} columns={3} />`,
        component: (
          <ImageGallery
            images={[
              { src: "/placeholder.svg?height=200&width=200", alt: "Image 1", caption: "Beautiful sunset" },
              { src: "/placeholder.svg?height=200&width=200", alt: "Image 2", caption: "Mountain view" },
              { src: "/placeholder.svg?height=200&width=200", alt: "Image 3", caption: "Ocean waves" },
            ]}
            columns={3}
          />
        ),
      },
    ],
    usage: `import { ImageGallery } from "@/components/ui-kit/media/image-gallery"

export function PhotoGallery() {
  const [images, setImages] = useState([])
  
  useEffect(() => {
    fetchGalleryImages().then(setImages)
  }, [])
  
  return (
    <ImageGallery
      images={images}
      columns={4}
      lightbox={true}
      aspectRatio="16/9"
      gap={4}
    />
  )
}`,
    bestPractices: [
      "Optimize images for web display",
      "Provide meaningful alt text for accessibility",
      "Use consistent aspect ratios for better layout",
      "Consider lazy loading for large galleries",
      "Test lightbox functionality on mobile devices",
    ],
    relatedComponents: ["GridContainer", "AnimatedModal", "LoadingSpinner"],
  },

  "avatar-group": {
    name: "AvatarGroup",
    category: "Media",
    description: "Grouped avatars with overflow handling and hover effects",
    complexity: "Medium",
    props: [
      {
        name: "avatars",
        type: "Array<{src?: string, name: string, fallback?: string}>",
        required: true,
        description: "Avatar data",
      },
      { name: "max", type: "number", required: false, default: "5", description: "Maximum avatars to show" },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, default: "md", description: "Avatar size" },
      { name: "showTooltip", type: "boolean", required: false, default: "true", description: "Show name tooltips" },
      { name: "spacing", type: "number", required: false, default: "-2", description: "Avatar overlap spacing" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Team Avatars",
        code: `const team = [
  { name: "John Doe", src: "/avatar1.jpg" },
  { name: "Jane Smith", src: "/avatar2.jpg" },
  { name: "Bob Johnson", fallback: "BJ" },
  { name: "Alice Brown", fallback: "AB" }
]

<AvatarGroup avatars={team} max={3} size="md" />`,
        component: (
          <AvatarGroup
            avatars={[
              { name: "John Doe", src: "/placeholder.svg?height=40&width=40" },
              { name: "Jane Smith", src: "/placeholder.svg?height=40&width=40" },
              { name: "Bob Johnson", fallback: "BJ" },
              { name: "Alice Brown", fallback: "AB" },
            ]}
            max={3}
            size="md"
          />
        ),
      },
    ],
    usage: `import { AvatarGroup } from "@/components/ui-kit/media/avatar-group"

export function ProjectTeam({ projectId }) {
  const [teamMembers, setTeamMembers] = useState([])
  
  useEffect(() => {
    fetchProjectTeam(projectId).then(setTeamMembers)
  }, [projectId])
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">Team:</span>
      <AvatarGroup
        avatars={teamMembers}
        max={5}
        size="sm"
        showTooltip={true}
        spacing={-1}
      />
    </div>
  )
}`,
    bestPractices: [
      "Use consistent avatar sizes throughout your application",
      "Provide fallback initials when images aren't available",
      "Consider the maximum number of avatars for your layout",
      "Use tooltips to show full names on hover",
      "Optimize avatar images for fast loading",
    ],
    relatedComponents: ["TooltipMenu", "InfoCard", "Button"],
  },
}

interface ComponentDocPageProps {
  params: {
    componentName: string
  }
}

export default function ComponentDocPage({ params }: ComponentDocPageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeExample, setActiveExample] = useState(0)

  const componentName = params.componentName
  const doc = componentDocs[componentName as keyof typeof componentDocs]

  if (!doc) {
    notFound()
  }

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Complex":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Forms: "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300",
      "Data Display": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      Charts: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      Navigation: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      Feedback: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      Overlays: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
      Layout: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
      Media: "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300",
    }
    return colors[category as keyof typeof colors] || "bg-slate-100 text-slate-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard/showcase/all">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Components
            </Button>
          </Link>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{doc.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">{doc.description}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getCategoryColor(doc.category)} variant="outline">
              {doc.category}
            </Badge>
            <Badge className={getComplexityColor(doc.complexity)} variant="outline">
              {doc.complexity}
            </Badge>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Eye className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="props" className="gap-2">
            <Settings className="h-4 w-4" />
            Props
          </TabsTrigger>
          <TabsTrigger value="examples" className="gap-2">
            <Code className="h-4 w-4" />
            Examples
          </TabsTrigger>
          <TabsTrigger value="usage" className="gap-2">
            <Palette className="h-4 w-4" />
            Usage
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Overview</CardTitle>
              <CardDescription>Learn about the {doc.name} component and its capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-slate-600 dark:text-slate-300">{doc.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
                <ul className="space-y-2">
                  {doc.bestPractices.map((practice, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Related Components</h3>
                <div className="flex flex-wrap gap-2">
                  {doc.relatedComponents.map((component) => (
                    <Badge
                      key={component}
                      variant="outline"
                      className="cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/20"
                    >
                      {component}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Props Tab */}
        <TabsContent value="props" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Props</CardTitle>
              <CardDescription>All available props and their descriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Prop</th>
                      <th className="text-left p-3 font-semibold">Type</th>
                      <th className="text-left p-3 font-semibold">Required</th>
                      <th className="text-left p-3 font-semibold">Default</th>
                      <th className="text-left p-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doc.props.map((prop, index) => (
                      <tr key={index} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono text-sm font-medium">{prop.name}</td>
                        <td className="p-3 font-mono text-sm text-blue-600 dark:text-blue-400">{prop.type}</td>
                        <td className="p-3">
                          {prop.required ? (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Optional
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 font-mono text-sm text-slate-500">{prop.default || "-"}</td>
                        <td className="p-3 text-sm text-slate-600 dark:text-slate-300">{prop.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          {doc.examples.map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{example.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-6 bg-slate-50 dark:bg-slate-800/50">{example.component}</div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Code</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(example.code, `example-${index}`)}
                      className="gap-2"
                    >
                      {copiedCode === `example-${index}` ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{example.code}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guide</CardTitle>
              <CardDescription>Complete example of how to use this component in your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Full Implementation Example</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(doc.usage, "usage")}
                    className="gap-2"
                  >
                    {copiedCode === "usage" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{doc.usage}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
