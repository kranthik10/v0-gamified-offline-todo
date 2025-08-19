"use client"

import type { UserProgress, Task } from "@/lib/types"
import { ThemeSelector } from "./theme-selector"
import { AvatarSelector } from "./avatar-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Download, Upload, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SettingsPageProps {
  progress: UserProgress
  tasks: Task[]
  onProgressUpdate: (progress: UserProgress) => void
  onTasksUpdate: (tasks: Task[]) => void
}

export function SettingsPage({ progress, tasks, onProgressUpdate, onTasksUpdate }: SettingsPageProps) {
  const { toast } = useToast()

  const handleThemeChange = (themeId: string) => {
    onProgressUpdate({ ...progress, theme: themeId })
    toast({
      title: "Theme updated! 🎨",
      description: "Your new theme has been applied.",
    })
  }

  const handleAvatarChange = (avatar: string) => {
    onProgressUpdate({ ...progress, avatar })
    toast({
      title: "Avatar updated! 👤",
      description: "Your new avatar looks great!",
    })
  }

  const handleExportData = () => {
    const data = {
      tasks,
      progress,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `gamedo-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Data exported! 📁",
      description: "Your GameDo data has been downloaded as a backup file.",
    })
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)

          if (data.tasks && data.progress) {
            // Convert date strings back to Date objects
            const importedTasks = data.tasks.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
            }))

            const importedProgress = {
              ...data.progress,
              achievements: data.progress.achievements.map((ach: any) => ({
                ...ach,
                unlockedAt: new Date(ach.unlockedAt),
              })),
            }

            onTasksUpdate(importedTasks)
            onProgressUpdate(importedProgress)

            toast({
              title: "Data imported! 📥",
              description: "Your GameDo data has been successfully restored.",
            })
          } else {
            throw new Error("Invalid file format")
          }
        } catch (error) {
          toast({
            title: "Import failed! ❌",
            description: "The file format is invalid or corrupted.",
          })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all your data? This action cannot be undone.")) {
      onTasksUpdate([])
      onProgressUpdate({
        level: 1,
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        achievements: [],
        theme: "default",
        avatar: "🎮",
      })

      toast({
        title: "Data reset! 🔄",
        description: "All your data has been cleared. Time for a fresh start!",
      })
    }
  }

  const completedTasks = tasks.filter((t) => t.completed).length

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Profile Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{progress.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">Level {progress.level} Player</h3>
                <Badge variant="secondary">{progress.totalXP} XP</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">{completedTasks}</span> tasks completed
                </div>
                <div>
                  <span className="font-medium text-foreground">{progress.currentStreak}</span> day streak
                </div>
                <div>
                  <span className="font-medium text-foreground">{progress.achievements.length}</span> achievements
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Selector */}
      <ThemeSelector
        currentTheme={progress.theme}
        progress={progress}
        tasks={tasks}
        onThemeChange={handleThemeChange}
      />

      {/* Avatar Selector */}
      <AvatarSelector currentAvatar={progress.avatar} progress={progress} onAvatarChange={handleAvatarChange} />

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button variant="outline" onClick={handleImportData} className="flex items-center gap-2 bg-transparent">
              <Upload className="w-4 h-4" />
              Import Data
            </Button>
            <Button variant="destructive" onClick={handleResetData} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset All Data
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Export:</strong> Download your tasks and progress as a backup file.
            </p>
            <p>
              <strong>Import:</strong> Restore your data from a previously exported backup file.
            </p>
            <p>
              <strong>Reset:</strong> Clear all data and start fresh (cannot be undone).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
