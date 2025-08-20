export interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  category: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
}

export interface UserProgress {
  level: number
  totalXP: number
  currentStreak: number
  longestStreak: number
  achievements: Achievement[]
  theme: string
  avatar: string
  lastCompletionDate?: string
  streakHistory: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  rarity: "common" | "rare" | "epic" | "legendary"
  unlockedAt: Date
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    success: string
    warning: string
    error: string
  }
  unlockLevel: number
}

export interface GameStats {
  tasksCompleted: number
  totalTasks: number
  completionRate: number
  averageTasksPerDay: number
  mostProductiveDay: string
  categoriesUsed: string[]
}
