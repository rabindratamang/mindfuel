"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const allComponents = [
  // Forms
  {
    name: "AnimatedInput",
    slug: "animated-input",
    category: "Forms",
    description: "Input with floating labels and animations",
    complexity: "Simple",
  },
  {
    name: "SearchBar",
    slug: "search-bar",
    category: "Forms",
    description: "Expandable search with clear functionality",
    complexity: "Medium",
  },
  {
    name: "AnimatedCheckbox",
    slug: "animated-checkbox",
    category: "Forms",
    description: "Checkbox with spring animations",
    complexity: "Simple",
  },
  {
    name: "AnimatedRadioGroup",
    slug: "animated-radio-group",
    category: "Forms",
    description: "Radio buttons with hover effects",
    complexity: "Medium",
  },
  {
    name: "AnimatedSelect",
    slug: "animated-select",
    category: "Forms",
    description: "Dropdown with focus animations",
    complexity: "Medium",
  },
  {
    name: "AnimatedTextarea",
    slug: "animated-textarea",
    category: "Forms",
    description: "Auto-resizing textarea with floating labels",
    complexity: "Medium",
  },
  {
    name: "AnimatedSwitch",
    slug: "animated-switch",
    category: "Forms",
    description: "Toggle switch with tap animations",
    complexity: "Simple",
  },
  {
    name: "FormSection",
    slug: "form-section",
    category: "Forms",
    description: "Collapsible form sections",
    complexity: "Medium",
  },

  // Data Display
  {
    name: "DataTable",
    slug: "data-table",
    category: "Data Display",
    description: "Sortable, searchable table with pagination",
    complexity: "Complex",
  },
  {
    name: "StatCard",
    slug: "stat-card",
    category: "Data Display",
    description: "Animated statistics cards with progress bars",
    complexity: "Medium",
  },
  {
    name: "InfoCard",
    slug: "info-card",
    category: "Data Display",
    description: "General purpose information cards",
    complexity: "Simple",
  },
  {
    name: "Timeline",
    slug: "timeline",
    category: "Data Display",
    description: "Vertical/horizontal timeline component",
    complexity: "Medium",
  },

  // Charts
  {
    name: "LineChart",
    slug: "line-chart",
    category: "Charts",
    description: "Animated line charts with SVG",
    complexity: "Complex",
  },
  { name: "BarChart", slug: "bar-chart", category: "Charts", description: "Animated bar charts", complexity: "Medium" },
  {
    name: "DonutChart",
    slug: "donut-chart",
    category: "Charts",
    description: "Donut/pie charts with legends",
    complexity: "Complex",
  },

  // Navigation
  {
    name: "Breadcrumbs",
    slug: "breadcrumbs",
    category: "Navigation",
    description: "Breadcrumb navigation",
    complexity: "Simple",
  },
  {
    name: "Pagination",
    slug: "pagination",
    category: "Navigation",
    description: "Full-featured pagination",
    complexity: "Medium",
  },
  {
    name: "StepIndicator",
    slug: "step-indicator",
    category: "Navigation",
    description: "Step-by-step progress indicator",
    complexity: "Medium",
  },

  // Feedback
  {
    name: "Toast",
    slug: "toast",
    category: "Feedback",
    description: "Toast notifications system",
    complexity: "Medium",
  },
  {
    name: "LoadingSpinner",
    slug: "loading-spinner",
    category: "Feedback",
    description: "Customizable loading spinners",
    complexity: "Simple",
  },
  {
    name: "ProgressBar",
    slug: "progress-bar",
    category: "Feedback",
    description: "Animated progress indicators",
    complexity: "Simple",
  },
  {
    name: "AlertBanner",
    slug: "alert-banner",
    category: "Feedback",
    description: "Alert banners with actions",
    complexity: "Medium",
  },

  // Overlays
  {
    name: "AnimatedModal",
    slug: "animated-modal",
    category: "Overlays",
    description: "Modal with entrance/exit animations",
    complexity: "Medium",
  },
  {
    name: "ConfirmationDialog",
    slug: "confirmation-dialog",
    category: "Overlays",
    description: "Confirmation dialogs with different types",
    complexity: "Medium",
  },
  {
    name: "TooltipMenu",
    slug: "tooltip-menu",
    category: "Overlays",
    description: "Custom tooltip menus with positioning",
    complexity: "Complex",
  },

  // Layout
  {
    name: "GridContainer",
    slug: "grid-container",
    category: "Layout",
    description: "Responsive grid with animations",
    complexity: "Medium",
  },
  {
    name: "SectionDivider",
    slug: "section-divider",
    category: "Layout",
    description: "Section dividers with titles",
    complexity: "Simple",
  },

  // Media
  {
    name: "ImageGallery",
    slug: "image-gallery",
    category: "Media",
    description: "Image gallery with lightbox",
    complexity: "Complex",
  },
  {
    name: "AvatarGroup",
    slug: "avatar-group",
    category: "Media",
    description: "Grouped avatars with overflow",
    complexity: "Medium",
  },
]

const categories = ["All", "Forms", "Data Display", "Charts", "Navigation", "Feedback", "Overlays", "Layout", "Media"]
const complexities = ["All", "Simple", "Medium", "Complex"]

export default function AllComponentsShowcase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedComplexity, setSelectedComplexity] = useState("All")

  const filteredComponents = allComponents.filter((component) => {
    const matchesSearch =
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || component.category === selectedCategory
    const matchesComplexity = selectedComplexity === "All" || component.complexity === selectedComplexity

    return matchesSearch && matchesCategory && matchesComplexity
  })

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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight">Complete UI Kit</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Browse all {allComponents.length} components in the MindFuel UI Kit
        </p>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Search and filter components by category and complexity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger>
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                {complexities.map((complexity) => (
                  <SelectItem key={complexity} value={complexity}>
                    {complexity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || selectedCategory !== "All" || selectedComplexity !== "All") && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-slate-500">Active filters:</span>
              {searchTerm && (
                <Badge variant="outline" className="gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== "All" && (
                <Badge variant="outline" className="gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("All")} className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              )}
              {selectedComplexity !== "All" && (
                <Badge variant="outline" className="gap-1">
                  Complexity: {selectedComplexity}
                  <button onClick={() => setSelectedComplexity("All")} className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                  setSelectedComplexity("All")
                }}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredComponents.length} of {allComponents.length} components
        </div>
        <div className="flex gap-2">
          {categories.slice(1).map((category) => {
            const count = allComponents.filter((c) => c.category === category).length
            return (
              <Badge
                key={category}
                variant="outline"
                className={`text-xs cursor-pointer ${selectedCategory === category ? getCategoryColor(category) : ""}`}
                onClick={() => setSelectedCategory(selectedCategory === category ? "All" : category)}
              >
                {category} ({count})
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComponents.map((component, index) => (
          <motion.div
            key={component.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/dashboard/showcase/component/${component.slug}`} className="block h-full">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group border-2 hover:border-teal-500/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg group-hover:text-teal-500 transition-colors">
                      {component.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Badge className={getCategoryColor(component.category)} variant="outline">
                        {component.category}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{component.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge className={getComplexityColor(component.complexity)} variant="outline">
                      {component.complexity}
                    </Badge>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" /> View docs
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-slate-500 dark:text-slate-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No components found</h3>
              <p className="text-sm">Try adjusting your search terms or filters to find what you're looking for.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Component Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Component Statistics</CardTitle>
          <CardDescription>Overview of the UI Kit components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">By Category</h4>
              <div className="space-y-2">
                {categories.slice(1).map((category) => {
                  const count = allComponents.filter((c) => c.category === category).length
                  const percentage = (count / allComponents.length) * 100
                  return (
                    <div key={category} className="flex items-center justify-between text-sm">
                      <span>{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-teal-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">By Complexity</h4>
              <div className="space-y-2">
                {complexities.slice(1).map((complexity) => {
                  const count = allComponents.filter((c) => c.complexity === complexity).length
                  const percentage = (count / allComponents.length) * 100
                  return (
                    <div key={complexity} className="flex items-center justify-between text-sm">
                      <span>{complexity}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-sky-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Components</span>
                  <span className="font-medium">{allComponents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Categories</span>
                  <span className="font-medium">{categories.length - 1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Most Complex</span>
                  <span className="font-medium">{allComponents.filter((c) => c.complexity === "Complex").length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Easiest to Use</span>
                  <span className="font-medium">{allComponents.filter((c) => c.complexity === "Simple").length}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
