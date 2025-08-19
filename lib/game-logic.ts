import { type Task, type UserProgress, type Achievement, ACHIEVEMENT_DEFINITIONS } from "./types"

export function calculateXPForTask(task: Task): number {
  const basePoints = task.points
  const priorityMultiplier = {
    low: 1,
    medium: 1.5,
    high: 2,
  }
  return Math.floor(basePoints * priorityMultiplier[task.priority])
}

export function calculateLevel(totalXP: number): number {
  // Level formula: level = floor(sqrt(totalXP / 100)) + 1
  return Math.floor(Math.sqrt(totalXP / 100)) + 1
}

export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100
}

export function updateStreak(
  tasks: Task[],
  lastCompletionDate?: string,
): { currentStreak: number; longestStreak: number } {
  const today = new Date()
  const todayString = today.toDateString()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString()

  // Get tasks completed today
  const todayTasks = tasks.filter(
    (task) => task.completed && task.completedAt && new Date(task.completedAt).toDateString() === todayString,
  )

  // If no tasks completed today, check if streak should be broken
  if (todayTasks.length === 0) {
    // If last completion was yesterday, streak continues (user has until end of day)
    if (lastCompletionDate === yesterday) {
      return { currentStreak: getCurrentStreakFromTasks(tasks), longestStreak: getLongestStreakFromTasks(tasks) }
    }
    // If last completion was before yesterday, streak is broken
    return { currentStreak: 0, longestStreak: getLongestStreakFromTasks(tasks) }
  }

  // Calculate current streak
  const currentStreak = getCurrentStreakFromTasks(tasks)
  const longestStreak = getLongestStreakFromTasks(tasks)

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) }
}

function getCurrentStreakFromTasks(tasks: Task[]): number {
  const completedTasks = tasks
    .filter((task) => task.completed && task.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

  if (completedTasks.length === 0) return 0

  // Group tasks by date
  const tasksByDate = new Map<string, Task[]>()
  completedTasks.forEach((task) => {
    const dateString = new Date(task.completedAt!).toDateString()
    if (!tasksByDate.has(dateString)) {
      tasksByDate.set(dateString, [])
    }
    tasksByDate.get(dateString)!.push(task)
  })

  const uniqueDates = Array.from(tasksByDate.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  if (uniqueDates.length === 0) return 0

  let streak = 0
  const today = new Date()

  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i])
    const expectedDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)

    // Check if the current date matches the expected date in the streak
    if (currentDate.toDateString() === expectedDate.toDateString()) {
      streak++
    } else {
      break
    }
  }

  return streak
}

function getLongestStreakFromTasks(tasks: Task[]): number {
  const completedTasks = tasks
    .filter((task) => task.completed && task.completedAt)
    .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())

  if (completedTasks.length === 0) return 0

  // Group tasks by date
  const tasksByDate = new Map<string, Task[]>()
  completedTasks.forEach((task) => {
    const dateString = new Date(task.completedAt!).toDateString()
    if (!tasksByDate.has(dateString)) {
      tasksByDate.set(dateString, [])
    }
    tasksByDate.get(dateString)!.push(task)
  })

  const uniqueDates = Array.from(tasksByDate.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  if (uniqueDates.length === 0) return 0

  let longestStreak = 1
  let currentStreak = 1

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1])
    const currDate = new Date(uniqueDates[i])
    const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      currentStreak++
    } else {
      longestStreak = Math.max(longestStreak, currentStreak)
      currentStreak = 1
    }
  }

  return Math.max(longestStreak, currentStreak)
}

export function getStreakMilestoneReward(streak: number): number {
  const milestones = [
    { days: 3, reward: 25 },
    { days: 7, reward: 50 },
    { days: 14, reward: 100 },
    { days: 30, reward: 200 },
    { days: 60, reward: 400 },
    { days: 100, reward: 1000 },
  ]

  return milestones.find((m) => m.days === streak)?.reward || 0
}

export function checkForNewAchievements(
  tasks: Task[],
  progress: UserProgress,
  existingAchievements: Achievement[],
): Achievement[] {
  const newAchievements: Achievement[] = []
  const existingIds = new Set(existingAchievements.map((a) => a.id))

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (!existingIds.has(def.id) && def.condition(tasks, progress)) {
      newAchievements.push({
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        points: def.points,
        unlockedAt: new Date(),
      })
    }
  }

  return newAchievements
}
