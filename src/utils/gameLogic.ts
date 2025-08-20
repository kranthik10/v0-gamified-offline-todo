import type { Task, UserProgress, Achievement } from "../types"

export function calculateXPForTask(task: Task): number {
  const baseXP = 10
  const priorityMultiplier = {
    low: 1,
    medium: 1.5,
    high: 2,
  }
  return Math.floor(baseXP * priorityMultiplier[task.priority])
}

export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1
}

export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * 100
}

export function updateStreak(
  tasks: Task[],
  lastCompletionDate?: string,
): { currentStreak: number; longestStreak: number; streakHistory: string[] } {
  const today = new Date().toDateString()
  const completedTasks = tasks.filter((task) => task.completed && task.completedAt)

  // Get unique completion dates
  const completionDates = Array.from(
    new Set(completedTasks.map((task) => task.completedAt?.toDateString()).filter(Boolean)),
  ).sort()

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  // Calculate streaks
  for (let i = 0; i < completionDates.length; i++) {
    const currentDate = new Date(completionDates[i])
    const prevDate = i > 0 ? new Date(completionDates[i - 1]) : null

    if (prevDate) {
      const daysDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    } else {
      tempStreak = 1
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak)

  // Calculate current streak
  if (completionDates.includes(today)) {
    currentStreak = tempStreak
  } else if (lastCompletionDate) {
    const lastDate = new Date(lastCompletionDate)
    const daysSinceLastCompletion = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceLastCompletion <= 1) {
      currentStreak = tempStreak
    }
  }

  return {
    currentStreak,
    longestStreak,
    streakHistory: completionDates,
  }
}

export function checkForNewAchievements(
  tasks: Task[],
  progress: UserProgress,
  currentAchievements: Achievement[],
): Achievement[] {
  const newAchievements: Achievement[] = []
  const completedTasks = tasks.filter((task) => task.completed)
  const achievementIds = currentAchievements.map((a) => a.id)

  // First Task Achievement
  if (completedTasks.length >= 1 && !achievementIds.includes("first-task")) {
    newAchievements.push({
      id: "first-task",
      title: "First Steps",
      description: "Complete your first task",
      icon: "🎯",
      points: 50,
      rarity: "common",
      unlockedAt: new Date(),
    })
  }

  // Task Milestone Achievements
  const taskMilestones = [
    { count: 10, id: "task-10", title: "Getting Started", description: "Complete 10 tasks", icon: "📝", points: 100 },
    { count: 50, id: "task-50", title: "Productive", description: "Complete 50 tasks", icon: "⚡", points: 250 },
    { count: 100, id: "task-100", title: "Centurion", description: "Complete 100 tasks", icon: "💯", points: 500 },
  ]

  taskMilestones.forEach((milestone) => {
    if (completedTasks.length >= milestone.count && !achievementIds.includes(milestone.id)) {
      newAchievements.push({
        ...milestone,
        rarity: "rare" as const,
        unlockedAt: new Date(),
      })
    }
  })

  // Streak Achievements
  const streakMilestones = [
    { streak: 3, id: "streak-3", title: "On Fire", description: "3-day streak", icon: "🔥", points: 75 },
    { streak: 7, id: "streak-7", title: "Week Warrior", description: "7-day streak", icon: "⚔️", points: 200 },
    { streak: 30, id: "streak-30", title: "Unstoppable", description: "30-day streak", icon: "🚀", points: 1000 },
  ]

  streakMilestones.forEach((milestone) => {
    if (progress.currentStreak >= milestone.streak && !achievementIds.includes(milestone.id)) {
      newAchievements.push({
        ...milestone,
        rarity: "epic" as const,
        unlockedAt: new Date(),
      })
    }
  })

  return newAchievements
}
