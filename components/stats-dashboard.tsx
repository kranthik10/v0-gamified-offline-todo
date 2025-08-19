"use client"

import type { Task, UserProgress } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressRing } from "./progress-ring"
import { StreakCalendar } from "./streak-calendar"
import { StreakMilestones } from "./streak-milestones"
import { Trophy, Target, Calendar, TrendingUp, Flame } from "lucide-react"

interface StatsDashboardProps {
  tasks: Task[]
  progress: UserProgress
}

export function StatsDashboard({ tasks, progress }: StatsDashboardProps) {
  const completedTasks = tasks.filter((task) => task.completed)
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0

  const todayTasks = tasks.filter((task) => {
    const today = new Date().toDateString()
    return task.completed && task.completedAt && new Date(task.completedAt).toDateString() === today
  })

  const currentLevelXP = progress.level === 1 ? 0 : Math.pow(progress.level - 1, 2) * 100
  const nextLevelXP = Math.pow(progress.level, 2) * 100
  const progressToNextLevel = ((progress.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  const categoryStats = tasks.reduce(
    (acc, task) => {
      if (task.completed) {
        acc[task.category] = (acc[task.category] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategory = Object.entries(categoryStats).sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="space-y-6">
      {/* Level Progress Ring */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <ProgressRing progress={progressToNextLevel} size={140} strokeWidth={10}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{progress.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
            </ProgressRing>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{progress.totalXP} XP</span>
              <span className="text-muted-foreground">{nextLevelXP} XP</span>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {nextLevelXP - progress.totalXP} XP to next level
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-2xl font-bold text-orange-500">{progress.currentStreak}</span>
            </div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-xs text-muted-foreground mt-1">Best: {progress.longestStreak} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-green-500">{todayTasks.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Today's Tasks</p>
            <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold text-blue-500">{completionRate.toFixed(0)}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks.length}/{totalTasks} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold text-purple-500">{progress.achievements.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Achievements</p>
            <p className="text-xs text-muted-foreground mt-1">Unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Streak Calendar */}
      <StreakCalendar tasks={tasks} currentStreak={progress.currentStreak} longestStreak={progress.longestStreak} />

      {/* Streak Milestones */}
      <StreakMilestones progress={progress} />

      {/* Category Performance */}
      {topCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{topCategory[0]}</p>
                <p className="text-sm text-muted-foreground">{topCategory[1]} tasks completed</p>
              </div>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                Champion
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
