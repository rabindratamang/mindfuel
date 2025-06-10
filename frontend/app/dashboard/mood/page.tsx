import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoodAnalyzer } from "@/components/mood-analyzer"

export default function MoodPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mood Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400">Track and analyze your mood patterns with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling?</CardTitle>
              <CardDescription>
                Share your thoughts and our AI will analyze your mood and provide personalized suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoodAnalyzer />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
              <CardDescription>Your mood patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                {/* Placeholder for chart */}
                <div className="flex items-end justify-between h-full gap-1">
                  {[60, 75, 45, 80, 65, 70, 85].map((value, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-teal-500 to-sky-500 rounded-sm w-full"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="journal">
        <TabsList className="mb-4">
          <TabsTrigger value="journal">Mood Journal</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood Journal</CardTitle>
              <CardDescription>Record your daily moods and reflections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <JournalEntry
                  date="Today, 2:30 PM"
                  mood="Calm"
                  content="Had a productive morning meeting. The team was receptive to my ideas and I felt confident presenting."
                />
                <JournalEntry
                  date="Yesterday, 8:15 PM"
                  mood="Anxious"
                  content="Feeling overwhelmed with the upcoming project deadline. Need to break down tasks and create a better plan."
                />
                <JournalEntry
                  date="June 3, 11:45 AM"
                  mood="Happy"
                  content="Great workout this morning followed by a healthy breakfast. Starting the day with good energy."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Personalized insights based on your mood patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Weekly Pattern</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Your mood tends to be more positive in the mornings, especially after physical activity. Consider
                    scheduling important tasks during these peak times.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Stress Triggers</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Work deadlines appear to be a consistent source of anxiety. Try implementing time-blocking
                    techniques and breaking large projects into smaller tasks.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Mood Boosters</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Social interactions and outdoor activities consistently improve your mood. Consider scheduling
                    regular walks or coffee breaks with friends.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Mood History</CardTitle>
              <CardDescription>View your complete mood tracking history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                Coming soon! This feature is under development.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function JournalEntry({ date, mood, content }: { date: string; mood: string; content: string }) {
  return (
    <div className="border-l-4 border-teal-500 pl-4 py-1">
      <div className="flex justify-between items-center mb-1">
        <div className="text-sm text-slate-500 dark:text-slate-400">{date}</div>
        <div className="text-sm font-medium text-teal-500">{mood}</div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{content}</p>
    </div>
  )
}
