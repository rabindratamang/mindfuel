"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormInput, BarChart3, Navigation, Bell, Layout, ImageIcon, Palette, ArrowRight } from "lucide-react"
import { AnimatedCard } from "@/components/animated-card"

const showcasePages = [
  {
    title: "Forms",
    description: "Interactive form components with animations",
    icon: <FormInput className="h-6 w-6 text-teal-500" />,
    href: "/dashboard/showcase/forms",
    color: "from-teal-500 to-cyan-500",
  },
  {
    title: "Data Display",
    description: "Tables, cards, and data visualization components",
    icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
    href: "/dashboard/showcase/data-display",
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Charts",
    description: "Interactive charts and data visualization",
    icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
    href: "/dashboard/showcase/charts",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Navigation",
    description: "Navigation components and indicators",
    icon: <Navigation className="h-6 w-6 text-green-500" />,
    href: "/dashboard/showcase/navigation",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Feedback",
    description: "Alerts, toasts, and loading components",
    icon: <Bell className="h-6 w-6 text-orange-500" />,
    href: "/dashboard/showcase/feedback",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Layout",
    description: "Grid systems and layout components",
    icon: <Layout className="h-6 w-6 text-slate-500" />,
    href: "/dashboard/showcase/layout",
    color: "from-slate-500 to-gray-500",
  },
  {
    title: "Media",
    description: "Image galleries and avatar components",
    icon: <ImageIcon className="h-6 w-6 text-rose-500" />,
    href: "/dashboard/showcase/media",
    color: "from-rose-500 to-pink-500",
  },
  {
    title: "All Components",
    description: "Complete overview of all UI kit components",
    icon: <Palette className="h-6 w-6 text-violet-500" />,
    href: "/dashboard/showcase/all",
    color: "from-violet-500 to-purple-500",
  },
]

export default function ShowcasePage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight">UI Kit Showcase</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Explore all the reusable components in the MindFuel UI Kit
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {showcasePages.map((page, index) => (
          <AnimatedCard key={page.href} delay={index}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${page.color}`} />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                  >
                    {page.icon}
                  </motion.div>
                  <div>
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm">{page.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={page.href}>
                  <Button className={`w-full bg-gradient-to-r ${page.color} group-hover:shadow-md transition-all`}>
                    Explore Components
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/20 rounded-lg p-6 border border-teal-200 dark:border-teal-800"
      >
        <h2 className="text-xl font-semibold mb-2">About the UI Kit</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          The MindFuel UI Kit is a comprehensive collection of reusable React components built with TypeScript, Tailwind
          CSS, and Framer Motion. All components follow the calming design principles of the MindFuel brand with smooth
          animations and accessibility in mind.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full" />
            <span>50+ Components</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-sky-500 rounded-full" />
            <span>Fully Responsive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            <span>Dark Mode Support</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
