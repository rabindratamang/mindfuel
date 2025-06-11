"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui-kit/charts/line-chart"
import { BarChart } from "@/components/ui-kit/charts/bar-chart"
import { DonutChart } from "@/components/ui-kit/charts/donut-chart"

// Sample data
const moodData = [
  { label: "Mon", value: 7.2 },
  { label: "Tue", value: 6.8 },
  { label: "Wed", value: 8.1 },
  { label: "Thu", value: 7.5 },
  { label: "Fri", value: 6.9 },
  { label: "Sat", value: 8.3 },
  { label: "Sun", value: 7.8 },
]

const sessionData = [
  { label: "Mindfulness", value: 45, color: "#14b8a6" },
  { label: "Sleep", value: 32, color: "#0ea5e9" },
  { label: "Anxiety Relief", value: 28, color: "#8b5cf6" },
  { label: "Focus", value: 22, color: "#f59e0b" },
  { label: "Gratitude", value: 18, color: "#ef4444" },
]

const weeklyProgress = [
  { label: "Week 1", value: 65, color: "#14b8a6" },
  { label: "Week 2", value: 72, color: "#0ea5e9" },
  { label: "Week 3", value: 68, color: "#8b5cf6" },
  { label: "Week 4", value: 85, color: "#f59e0b" },
]

const categoryData = [
  { label: "Meditation", value: 40, color: "#14b8a6" },
  { label: "Sleep", value: 30, color: "#0ea5e9" },
  { label: "Mood Tracking", value: 20, color: "#8b5cf6" },
  { label: "Breathing", value: 10, color: "#f59e0b" },
]

const sleepData = [
  { label: "Mon", value: 7.5 },
  { label: "Tue", value: 6.8 },
  { label: "Wed", value: 8.2 },
  { label: "Thu", value: 7.1 },
  { label: "Fri", value: 6.5 },
  { label: "Sat", value: 8.5 },
  { label: "Sun", value: 7.8 },
]

export default function ChartsShowcase() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight">Charts Showcase</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Interactive charts and data visualization components</p>
      </motion.div>

      {/* Line Charts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Line Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Mood Trends</CardTitle>
              <CardDescription>Your mood patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart data={moodData} height={250} color="#14b8a6" showDots={true} showGrid={true} animated={true} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sleep Duration</CardTitle>
              <CardDescription>Hours of sleep per night</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={sleepData}
                height={250}
                color="#0ea5e9"
                strokeWidth={3}
                showDots={true}
                showGrid={false}
                animated={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bar Charts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Bar Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Meditation Sessions by Type</CardTitle>
              <CardDescription>Number of sessions completed this month</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={sessionData} height={250} showValues={true} animated={true} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Overall wellness score by week</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={weeklyProgress} height={250} showValues={true} animated={true} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Donut Charts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Donut Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
              <CardDescription>Time spent on different wellness activities</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart
                data={categoryData}
                size={250}
                strokeWidth={30}
                showLabels={true}
                showValues={true}
                animated={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Types</CardTitle>
              <CardDescription>Breakdown of meditation session types</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart
                data={sessionData}
                size={250}
                strokeWidth={25}
                showLabels={true}
                showValues={false}
                animated={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chart Variations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Chart Variations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Minimal Line Chart</CardTitle>
              <CardDescription>Clean design without grid</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={moodData.slice(0, 5)}
                height={200}
                color="#8b5cf6"
                strokeWidth={2}
                showDots={false}
                showGrid={false}
                animated={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compact Bar Chart</CardTitle>
              <CardDescription>Small format for dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={weeklyProgress.slice(0, 3)}
                height={200}
                color="#f59e0b"
                showValues={false}
                animated={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mini Donut Chart</CardTitle>
              <CardDescription>Compact circular visualization</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <DonutChart
                data={categoryData.slice(0, 3)}
                size={180}
                strokeWidth={20}
                showLabels={false}
                showValues={false}
                animated={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Features */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Features</CardTitle>
          <CardDescription>Charts with hover effects and animations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Hover over the chart elements to see interactions:</h4>
              <LineChart data={moodData} height={200} color="#14b8a6" showDots={true} showGrid={true} animated={true} />
            </div>
            <div>
              <h4 className="font-medium mb-3">Bar chart with hover effects:</h4>
              <BarChart data={sessionData.slice(0, 4)} height={200} showValues={true} animated={true} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
