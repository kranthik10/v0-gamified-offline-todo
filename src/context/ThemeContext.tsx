"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Theme } from "../types"
import { themes } from "../utils/themes"

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (themeId: string) => void
  availableThemes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.default)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedThemeId = await AsyncStorage.getItem("gamedo-theme")
      if (savedThemeId && themes[savedThemeId]) {
        setCurrentTheme(themes[savedThemeId])
      }
    } catch (error) {
      console.error("Error loading theme:", error)
    }
  }

  const setTheme = async (themeId: string) => {
    if (themes[themeId]) {
      setCurrentTheme(themes[themeId])
      try {
        await AsyncStorage.setItem("gamedo-theme", themeId)
      } catch (error) {
        console.error("Error saving theme:", error)
      }
    }
  }

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes: Object.values(themes),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
