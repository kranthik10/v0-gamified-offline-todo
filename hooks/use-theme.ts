"use client"

import { useEffect } from "react"
import { AVAILABLE_THEMES } from "@/lib/themes"

export function useTheme(currentThemeId: string) {
  useEffect(() => {
    const theme = AVAILABLE_THEMES.find((t) => t.id === currentThemeId) || AVAILABLE_THEMES[0]

    // Apply theme colors to CSS variables
    const root = document.documentElement
    root.style.setProperty("--primary", theme.colors.primary)
    root.style.setProperty("--secondary", theme.colors.secondary)
    root.style.setProperty("--accent", theme.colors.accent)
    root.style.setProperty("--background", theme.colors.background)
    root.style.setProperty("--foreground", theme.colors.foreground)
    root.style.setProperty("--card", theme.colors.card)
    root.style.setProperty("--card-foreground", theme.colors.cardForeground)
    root.style.setProperty("--muted", theme.colors.muted)
    root.style.setProperty("--muted-foreground", theme.colors.mutedForeground)
  }, [currentThemeId])
}
