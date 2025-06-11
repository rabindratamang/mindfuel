"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, Calendar, Clock, CheckCircle, AlertCircle, Star, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui-kit/data-display/data-table"
import { StatCard } from "@/components/ui-kit/data-display/stat-card"
import { InfoCard } from "@/components/ui-kit/data-display/info-card"
import { Timeline, TimelineItem } from "@/components/ui-kit/data-display/timeline"

// Sample data for the table
const userData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    joinDate: "2024-01-15",
    sessions: 24,
    progress: 85,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Active",
    joinDate: "2024-02-20",
    sessions: 18,
    progress: 72,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "Inactive",
    joinDate: "2024-01-08",
    sessions: 12,
    progress: 45,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    status: "Active",
    joinDate: "2024-03-10",
    sessions: 31,
    progress: 92,
  },
  {
    id: 5,
    name: "Tom Brown",
    email: "tom@example.com",
    status: "Active",
    joinDate: "2024-02-05",
    sessions: 15,
    progress: 68,
  },
]

const tableColumns = [
  {
    header: "Name",
    accessorKey: "name" as keyof (typeof userData)[0],
    sortable: true,
  },
  {
    header: "Email",
    accessorKey: "email" as keyof (typeof userData)[0],
    sortable: true,
  },
  {
    header: "Status",
    accessorKey: "status" as keyof (typeof userData)[0],
    sortable: true,
    cell: (item: (typeof userData)[0]) => (
      <Badge variant={item.status === "Active" ? "default" : "secondary"}>{item.status}</Badge>
    ),
  },
  {
    header: "Sessions",
    accessorKey: "sessions" as keyof (typeof userData)[0],
    sortable: true,
  },
  {
    header: "Progress",
    accessorKey: "progress" as keyof (typeof userData)[0],
    sortable: true,
    cell: (item: (typeof userData)[0]) => (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div className="bg-teal-500 h-2 rounded-full transition-all" style={{ width: `${item.progress}%` }} />
        </div>
        <span className="text-sm">{item.progress}%</span>
      </div>
    ),
  },
]

export default function DataDisplayShowcase() {
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight">Data Display Showcase</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Tables, cards, and data visualization components</p>
      </motion.div>

      {/* Stat Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Stat Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value="2,847"
            description="Active users this month"
            icon={<Users className="h-4 w-4 text-teal-500" />}
            trend={{ value: 12, label: "from last month", positive: true }}
            progress={75}
            onClick={() => console.log("Users clicked")}
          />

          <StatCard
            title="Meditation Sessions"
            value="15,432"
            description="Sessions completed"
            icon={<Calendar className="h-4 w-4 text-sky-500" />}
            trend={{ value: 8, label: "from last week", positive: true }}
            progress={85}
          />

          <StatCard
            title="Average Session"
            value="12.5 min"
            description="Average duration"
            icon={<Clock className="h-4 w-4 text-indigo-500" />}
            trend={{ value: 3, label: "from last month", positive: false }}
            progress={60}
          />

          <StatCard
            title="User Satisfaction"
            value="4.8/5"
            description="Average rating"
            icon={<Star className="h-4 w-4 text-yellow-500" />}
            trend={{ value: 5, label: "from last quarter", positive: true }}
            progress={96}
          />
        </div>
      </div>

      {/* Info Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Info Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            title="Welcome Guide"
            description="Get started with your wellness journey"
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            badge={{ text: "New", variant: "default" }}
            content={
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Complete your profile and take your first mood assessment to get personalized recommendations.
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">5 min read</Badge>
                  <Badge variant="outline">Beginner</Badge>
                </div>
              </div>
            }
            onClick={() => console.log("Welcome guide clicked")}
          />

          <InfoCard
            title="System Update"
            description="New features and improvements"
            icon={<AlertCircle className="h-5 w-5 text-blue-500" />}
            badge={{ text: "Update", variant: "secondary" }}
            content={
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  We've added new meditation categories and improved the sleep tracking algorithm.
                </p>
                <div className="text-xs text-slate-500 dark:text-slate-400">Released 2 days ago</div>
              </div>
            }
          />

          <InfoCard
            title="Achievement Unlocked"
            description="7-day meditation streak"
            icon={<Award className="h-5 w-5 text-yellow-500" />}
            badge={{ text: "Achievement", variant: "outline" }}
            content={
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Congratulations! You've maintained a 7-day meditation streak. Keep up the great work!
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Data Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Data Table</h2>
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage and view user data with sorting and search</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={tableColumns}
              data={userData}
              searchable={true}
              searchPlaceholder="Search users..."
              onSearch={setSearchValue}
              pagination={true}
              pageSize={3}
            />
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Timeline</h2>
        <Card>
          <CardHeader>
            <CardTitle>User Journey</CardTitle>
            <CardDescription>Track user progress and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline>
              <TimelineItem
                title="Account Created"
                description="User signed up and completed profile setup"
                date="2 weeks ago"
                icon={<Users className="h-4 w-4" />}
                active={true}
              >
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm">Welcome email sent and profile verification completed.</p>
                </div>
              </TimelineItem>

              <TimelineItem
                title="First Meditation Session"
                description="Completed 10-minute mindfulness meditation"
                date="12 days ago"
                icon={<CheckCircle className="h-4 w-4" />}
                active={true}
              >
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline">Mindfulness</Badge>
                  <Badge variant="outline">10 min</Badge>
                </div>
              </TimelineItem>

              <TimelineItem
                title="Mood Assessment"
                description="Completed weekly mood check-in"
                date="1 week ago"
                icon={<TrendingUp className="h-4 w-4" />}
                active={true}
              >
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm">Mood score: 7.5/10 (Improved from last week)</p>
                </div>
              </TimelineItem>

              <TimelineItem
                title="Achievement Unlocked"
                description="Earned 7-day meditation streak badge"
                date="3 days ago"
                icon={<Award className="h-4 w-4" />}
                active={true}
              >
                <div className="mt-2 flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    🏆 Streak Master
                  </Badge>
                </div>
              </TimelineItem>

              <TimelineItem
                title="Sleep Goal Reached"
                description="Achieved 8 hours of sleep for 5 consecutive nights"
                date="Today"
                icon={<CheckCircle className="h-4 w-4" />}
                active={false}
                last={true}
              >
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Congratulations! Your sleep quality has improved significantly.
                  </p>
                </div>
              </TimelineItem>
            </Timeline>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
