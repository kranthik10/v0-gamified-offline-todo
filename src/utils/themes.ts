export interface Theme {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    success: string
    warning: string
    error: string
    border: string
  }
  unlockRequirement?: {
    type: "level" | "achievement" | "streak" | "tasks"
    value: number | string
  }
}

export const themes: Record<string, Theme> = {
  default: {
    id: "default",
    name: "Rose Garden",
    description: "The classic GameDo theme with vibrant rose colors",
    colors: {
      primary: "#be123c",
      secondary: "#ec4899",
      accent: "#ec4899",
      background: "#f8fafc",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      border: "#e2e8f0",
    },
  },
  ocean: {
    id: "ocean",
    name: "Ocean Breeze",
    description: "Cool blues and teals for a calming experience",
    colors: {
      primary: "#0891b2",
      secondary: "#06b6d4",
      accent: "#06b6d4",
      background: "#f0f9ff",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      border: "#bae6fd",
    },
    unlockRequirement: {
      type: "level",
      value: 5,
    },
  },
  forest: {
    id: "forest",
    name: "Forest Path",
    description: "Natural greens for productivity in harmony with nature",
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      accent: "#10b981",
      background: "#f0fdf4",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      border: "#bbf7d0",
    },
    unlockRequirement: {
      type: "streak",
      value: 7,
    },
  },
  sunset: {
    id: "sunset",
    name: "Sunset Glow",
    description: "Warm oranges and yellows for energetic productivity",
    colors: {
      primary: "#ea580c",
      secondary: "#f59e0b",
      accent: "#f59e0b",
      background: "#fff7ed",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      border: "#fed7aa",
    },
    unlockRequirement: {
      type: "tasks",
      value: 50,
    },
  },
  midnight: {
    id: "midnight",
    name: "Midnight Purple",
    description: "Deep purples for the night owls",
    colors: {
      primary: "#7c3aed",
      secondary: "#a855f7",
      accent: "#a855f7",
      background: "#faf5ff",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      border: "#e9d5ff",
    },
    unlockRequirement: {
      type: "achievement",
      value: "night-owl",
    },
  },
  champion: {
    id: "champion",
    name: "Champion Gold",
    description: "Luxurious gold theme for true achievers",
    colors: {
      primary: "#d97706",
      secondary: "#f59e0b",
      accent: "#fbbf24",
      background: "#fffbeb",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      border: "#fde68a",
    },
    unlockRequirement: {
      type: "level",
      value: 10,
    },
  },
}

export const AVAILABLE_AVATARS = [
  { id: "gamer", emoji: "🎮", name: "Gamer", unlockLevel: 1 },
  { id: "rocket", emoji: "🚀", name: "Rocket", unlockLevel: 3 },
  { id: "star", emoji: "⭐", name: "Star", unlockLevel: 5 },
  { id: "crown", emoji: "👑", name: "Crown", unlockLevel: 7 },
  { id: "diamond", emoji: "💎", name: "Diamond", unlockLevel: 10 },
  { id: "trophy", emoji: "🏆", name: "Trophy", unlockLevel: 15 },
  { id: "fire", emoji: "🔥", name: "Fire", unlockLevel: 20 },
  { id: "lightning", emoji: "⚡", name: "Lightning", unlockLevel: 25 },
]

export function getAvailableThemes(
  level: number,
  achievements: string[],
  streak: number,
  completedTasks: number,
): Theme[] {
  return Object.values(themes).filter((theme) => {
    if (!theme.unlockRequirement) return true

    switch (theme.unlockRequirement.type) {
      case "level":
        return level >= (theme.unlockRequirement.value as number)
      case "streak":
        return streak >= (theme.unlockRequirement.value as number)
      case "tasks":
        return completedTasks >= (theme.unlockRequirement.value as number)
      case "achievement":
        return achievements.includes(theme.unlockRequirement.value as string)
      default:
        return false
    }
  })
}

export function getAvailableAvatars(level: number) {
  return AVAILABLE_AVATARS.filter((avatar) => level >= avatar.unlockLevel)
}
