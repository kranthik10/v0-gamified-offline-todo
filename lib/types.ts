export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
  priority: "low" | "medium" | "high"
  category: string
  points: number
}

export interface UserProgress {
  level: number
  totalXP: number
  currentStreak: number
  longestStreak: number
  lastCompletionDate?: string
  achievements: Achievement[]
  theme: string
  avatar: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  points: number
  category: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

export const ACHIEVEMENT_DEFINITIONS = [
  // Getting Started Achievements
  {
    id: "first-task",
    title: "Getting Started",
    description: "Complete your first task",
    icon: "🎯",
    points: 10,
    category: "Getting Started",
    rarity: "common" as const,
    condition: (tasks: Task[]) => tasks.filter((t) => t.completed).length >= 1,
  },
  {
    id: "first-day",
    title: "Day One",
    description: "Complete your first day of tasks",
    icon: "🌅",
    points: 15,
    category: "Getting Started",
    rarity: "common" as const,
    condition: (tasks: Task[]) => {
      const today = new Date().toDateString()
      return (
        tasks.filter((t) => t.completed && t.completedAt && new Date(t.completedAt).toDateString() === today).length >=
        1
      )
    },
  },

  // Streak Achievements
  {
    id: "streak-3",
    title: "3-Day Warrior",
    description: "Complete tasks for 3 days in a row",
    icon: "🔥",
    points: 25,
    category: "Streaks",
    rarity: "common" as const,
    condition: (tasks: Task[], progress: UserProgress) => progress.currentStreak >= 3,
  },
  {
    id: "streak-7",
    title: "Week Champion",
    description: "Complete tasks for 7 days in a row",
    icon: "👑",
    points: 50,
    category: "Streaks",
    rarity: "rare" as const,
    condition: (tasks: Task[], progress: UserProgress) => progress.currentStreak >= 7,
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "Complete tasks for 30 days in a row",
    icon: "💎",
    points: 200,
    category: "Streaks",
    rarity: "epic" as const,
    condition: (tasks: Task[], progress: UserProgress) => progress.currentStreak >= 30,
  },
  {
    id: "streak-100",
    title: "Century Legend",
    description: "Complete tasks for 100 days in a row",
    icon: "🌟",
    points: 1000,
    category: "Streaks",
    rarity: "legendary" as const,
    condition: (tasks: Task[], progress: UserProgress) => progress.currentStreak >= 100,
  },

  // Task Count Achievements
  {
    id: "task-10",
    title: "Getting Things Done",
    description: "Complete 10 tasks",
    icon: "✅",
    points: 30,
    category: "Productivity",
    rarity: "common" as const,
    condition: (tasks: Task[]) => tasks.filter((t) => t.completed).length >= 10,
  },
  {
    id: "task-50",
    title: "Task Master",
    description: "Complete 50 tasks",
    icon: "⭐",
    points: 100,
    category: "Productivity",
    rarity: "rare" as const,
    condition: (tasks: Task[]) => tasks.filter((t) => t.completed).length >= 50,
  },
  {
    id: "task-100",
    title: "Productivity Pro",
    description: "Complete 100 tasks",
    icon: "🏆",
    points: 250,
    category: "Productivity",
    rarity: "epic" as const,
    condition: (tasks: Task[]) => tasks.filter((t) => t.completed).length >= 100,
  },
  {
    id: "task-500",
    title: "Task Titan",
    description: "Complete 500 tasks",
    icon: "🚀",
    points: 1000,
    category: "Productivity",
    rarity: "legendary" as const,
    condition: (tasks: Task[]) => tasks.filter((t) => t.completed).length >= 500,
  },

  // Priority Achievements
  {
    id: "high-priority-5",
    title: "Priority Focused",
    description: "Complete 5 high-priority tasks",
    icon: "🎯",
    points: 25,
    category: "Priority",
    rarity: "common" as const,
    condition: (tasks: Task[]) => tasks.filter((t) => t.completed && t.priority === "high").length >= 5,
  },
  {
    id: "high-priority-25",
    title: "Priority Pro",
    description: "Complete 25 high-priority tasks",
    icon: "🚀",
    points: 75,
    category: "Priority",
    rarity: "rare" as const,
    condition: (tasks: Task[]) => tasks.filter((t) => t.completed && t.priority === "high").length >= 25,
  },

  // Category Achievements
  {
    id: "work-specialist",
    title: "Work Specialist",
    description: "Complete 20 work tasks",
    icon: "💼",
    points: 50,
    category: "Categories",
    rarity: "rare" as const,
    condition: (tasks: Task[]) => tasks.filter((t) => t.completed && t.category === "Work").length >= 20,
  },
  {
    id: "health-guru",
    title: "Health Guru",
    description: "Complete 15 health tasks",
    icon: "💪",
    points: 50,
    category: "Categories",
    rarity: "rare" as const,
    condition: (tasks: Task[]) => tasks.filter((t) => t.completed && t.category === "Health").length >= 15,
  },
  {
    id: "learning-enthusiast",
    title: "Learning Enthusiast",
    description: "Complete 25 learning tasks",
    icon: "📚",
    points: 75,
    category: "Categories",
    rarity: "rare" as const,
    condition: (tasks: Task[]) => tasks.filter((t) => t.completed && t.category === "Learning").length >= 25,
  },

  // Special Achievements
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Complete a task before 8 AM",
    icon: "🌅",
    points: 20,
    category: "Special",
    rarity: "common" as const,
    condition: (tasks: Task[]) => {
      return tasks.some((t) => {
        if (!t.completed || !t.completedAt) return false
        const hour = new Date(t.completedAt).getHours()
        return hour < 8
      })
    },
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Complete a task after 10 PM",
    icon: "🦉",
    points: 20,
    category: "Special",
    rarity: "common" as const,
    condition: (tasks: Task[]) => {
      return tasks.some((t) => {
        if (!t.completed || !t.completedAt) return false
        const hour = new Date(t.completedAt).getHours()
        return hour >= 22
      })
    },
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Complete all tasks in a day",
    icon: "💯",
    points: 100,
    category: "Special",
    rarity: "epic" as const,
    condition: (tasks: Task[]) => {
      const today = new Date().toDateString()
      const todayTasks = tasks.filter((t) => new Date(t.createdAt).toDateString() === today)
      return todayTasks.length > 0 && todayTasks.every((t) => t.completed)
    },
  },
]
