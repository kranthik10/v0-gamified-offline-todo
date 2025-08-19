export interface Theme {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    card: string
    cardForeground: string
    muted: string
    mutedForeground: string
  }
  unlockRequirement?: {
    type: "level" | "achievement" | "streak" | "tasks"
    value: number | string
  }
}

export const AVAILABLE_THEMES: Theme[] = [
  {
    id: "default",
    name: "Rose Garden",
    description: "The classic GameDo theme with vibrant rose colors",
    colors: {
      primary: "#be123c",
      secondary: "#ec4899",
      accent: "#ec4899",
      background: "#ffffff",
      foreground: "#475569",
      card: "#fdf2f8",
      cardForeground: "#be123c",
      muted: "#fdf2f8",
      mutedForeground: "#475569",
    },
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    description: "Cool blues and teals for a calming experience",
    colors: {
      primary: "#0891b2",
      secondary: "#06b6d4",
      accent: "#06b6d4",
      background: "#ffffff",
      foreground: "#475569",
      card: "#f0f9ff",
      cardForeground: "#0891b2",
      muted: "#f0f9ff",
      mutedForeground: "#475569",
    },
    unlockRequirement: {
      type: "level",
      value: 5,
    },
  },
  {
    id: "forest",
    name: "Forest Path",
    description: "Natural greens for productivity in harmony with nature",
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      accent: "#10b981",
      background: "#ffffff",
      foreground: "#475569",
      card: "#f0fdf4",
      cardForeground: "#059669",
      muted: "#f0fdf4",
      mutedForeground: "#475569",
    },
    unlockRequirement: {
      type: "streak",
      value: 7,
    },
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    description: "Warm oranges and yellows for energetic productivity",
    colors: {
      primary: "#ea580c",
      secondary: "#f59e0b",
      accent: "#f59e0b",
      background: "#ffffff",
      foreground: "#475569",
      card: "#fff7ed",
      cardForeground: "#ea580c",
      muted: "#fff7ed",
      mutedForeground: "#475569",
    },
    unlockRequirement: {
      type: "tasks",
      value: 50,
    },
  },
  {
    id: "midnight",
    name: "Midnight Purple",
    description: "Deep purples for the night owls",
    colors: {
      primary: "#7c3aed",
      secondary: "#a855f7",
      accent: "#a855f7",
      background: "#ffffff",
      foreground: "#475569",
      card: "#faf5ff",
      cardForeground: "#7c3aed",
      muted: "#faf5ff",
      mutedForeground: "#475569",
    },
    unlockRequirement: {
      type: "achievement",
      value: "night-owl",
    },
  },
  {
    id: "champion",
    name: "Champion Gold",
    description: "Luxurious gold theme for true achievers",
    colors: {
      primary: "#d97706",
      secondary: "#f59e0b",
      accent: "#fbbf24",
      background: "#ffffff",
      foreground: "#475569",
      card: "#fffbeb",
      cardForeground: "#d97706",
      muted: "#fffbeb",
      mutedForeground: "#475569",
    },
    unlockRequirement: {
      type: "level",
      value: 10,
    },
  },
]

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
