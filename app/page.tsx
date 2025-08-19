"use client"

import { useState } from "react"
import type { Task, UserProgress, Achievement } from "@/lib/types"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTheme } from "@/hooks/use-theme"
import { calculateXPForTask, calculateLevel, updateStreak, checkForNewAchievements } from "@/lib/game-logic"
import { TaskCard } from "@/components/task-card"
import { AddTaskForm } from "@/components/add-task-form"
import { StatsDashboard } from "@/components/stats-dashboard"
import { AchievementGallery } from "@/components/achievement-gallery"
import { SettingsPage } from "@/components/settings-page"
import { LevelUpAnimation } from "@/components/level-up-animation"
import { XPGainAnimation } from "@/components/xp-gain-animation"
import { AchievementNotification } from "@/components/achievement-notification"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, ListTodo, Settings, Trophy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialProgress: UserProgress = {
  level: 1,
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  achievements: [],
  theme: "default",
  avatar: "🎮",
}

export default function HomePage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("gamedo-tasks", [])
  const [progress, setProgress] = useLocalStorage<UserProgress>("gamedo-progress", initialProgress)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showXPGain, setShowXPGain] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)
  const [lastXPGain, setLastXPGain] = useState(0)
  const [newLevel, setNewLevel] = useState(0)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const { toast } = useToast()

  useTheme(progress.theme)

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "completed" | "completedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      completed: false,
    }

    if (editingTask) {
      // Update existing task
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? {
                ...newTask,
                id: editingTask.id,
                createdAt: editingTask.createdAt,
                completed: editingTask.completed,
                completedAt: editingTask.completedAt,
              }
            : task,
        ),
      )
      setEditingTask(null)
      toast({
        title: "Task updated! 📝",
        description: `"${newTask.title}" has been updated.`,
      })
    } else {
      // Add new task
      setTasks((prev) => [...prev, newTask])
      toast({
        title: "Task added! ✨",
        description: `"${newTask.title}" is ready to be conquered!`,
      })
    }
  }

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined,
          }

          if (!task.completed) {
            // Task is being completed
            const xpGained = calculateXPForTask(task)
            const newTotalXP = progress.totalXP + xpGained
            const newLevel = calculateLevel(newTotalXP)
            const streakData = updateStreak(
              [...prev.filter((t) => t.id !== taskId), updatedTask],
              progress.lastCompletionDate,
            )

            const newProgress = {
              ...progress,
              totalXP: newTotalXP,
              level: newLevel,
              currentStreak: streakData.currentStreak,
              longestStreak: streakData.longestStreak,
              lastCompletionDate: new Date().toDateString(),
            }

            // Check for new achievements
            const newAchievements = checkForNewAchievements(
              [...prev.filter((t) => t.id !== taskId), updatedTask],
              newProgress,
              progress.achievements,
            )

            if (newAchievements.length > 0) {
              newProgress.achievements = [...progress.achievements, ...newAchievements]
              newProgress.totalXP += newAchievements.reduce((sum, ach) => sum + ach.points, 0)
              newProgress.level = calculateLevel(newProgress.totalXP)
            }

            setProgress(newProgress)

            setLastXPGain(xpGained)
            setShowXPGain(true)

            if (newLevel > progress.level) {
              setNewLevel(newLevel)
              setTimeout(() => setShowLevelUp(true), 1000)
            }

            // Show achievement notifications
            if (newAchievements.length > 0) {
              setNewAchievement(newAchievements[0])
              setTimeout(() => setShowAchievement(true), 2500)
            }

            // Show completion toast
            toast({
              title: `🎉 Task completed! +${xpGained} XP`,
              description:
                newLevel > progress.level
                  ? `Level up! You're now level ${newLevel}! 🚀`
                  : `Great job! Keep the momentum going! 💪`,
            })
          }

          return updatedTask
        }
        return task
      }),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    toast({
      title: "Task deleted 🗑️",
      description: "Task has been removed from your list.",
    })
  }

  const editTask = (task: Task) => {
    setEditingTask(task)
  }

  const cancelEdit = () => {
    setEditingTask(null)
  }

  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <LevelUpAnimation show={showLevelUp} newLevel={newLevel} onComplete={() => setShowLevelUp(false)} />
      <XPGainAnimation show={showXPGain} xpGained={lastXPGain} onComplete={() => setShowXPGain(false)} />
      <AchievementNotification
        achievement={newAchievement}
        show={showAchievement}
        onComplete={() => {
          setShowAchievement(false)
          setNewAchievement(null)
        }}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl">{progress.avatar}</span>
            <h1 className="text-4xl font-bold text-primary font-sans">GameDo</h1>
          </div>
          <p className="text-muted-foreground font-serif">Level up your productivity, one task at a time</p>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Add Task Form */}
            <AddTaskForm onAddTask={addTask} editingTask={editingTask || undefined} onCancelEdit={cancelEdit} />

            {/* Tasks */}
            <div className="space-y-6">
              {pendingTasks.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground font-sans">
                    Active Tasks ({pendingTasks.length})
                  </h2>
                  <div className="space-y-3">
                    {pendingTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={toggleTaskComplete}
                        onEdit={editTask}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>
                </div>
              )}

              {completedTasks.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground font-sans">
                    Completed Tasks ({completedTasks.length})
                  </h2>
                  <div className="space-y-3">
                    {completedTasks.slice(0, 5).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={toggleTaskComplete}
                        onEdit={editTask}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>
                  {completedTasks.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      And {completedTasks.length - 5} more completed tasks...
                    </p>
                  )}
                </div>
              )}

              {tasks.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold mb-2">Ready to level up?</h3>
                    <p className="text-muted-foreground">Add your first task and start your productivity journey!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <StatsDashboard tasks={tasks} progress={progress} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementGallery achievements={progress.achievements} tasks={tasks} progress={progress} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPage progress={progress} tasks={tasks} onProgressUpdate={setProgress} onTasksUpdate={setTasks} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
