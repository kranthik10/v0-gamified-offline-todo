"use client"

import type { Theme, UserProgress, Task } from "@/lib/types"
import { AVAILABLE_THEMES } from "@/lib/themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Lock, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeSelectorProps {
  currentTheme: string
  progress: UserProgress
  tasks: Task[]
  onThemeChange: (themeId: string) => void
}

export function ThemeSelector({ currentTheme, progress, tasks, onThemeChange }: ThemeSelectorProps) {
  const isThemeUnlocked = (theme: Theme) => {
    if (!theme.unlockRequirement) return true

    const { type, value } = theme.unlockRequirement

    switch (type) {
      case "level":
        return progress.level >= (value as number)
      case "streak":
        return progress.longestStreak >= (value as number)
      case "tasks":
        return tasks.filter((t) => t.completed).length >= (value as number)
      case "achievement":
        return progress.achievements.some((a) => a.id === value)
      default:
        return false
    }
  }

  const getUnlockText = (theme: Theme) => {
    if (!theme.unlockRequirement) return ""

    const { type, value } = theme.unlockRequirement

    switch (type) {
      case "level":
        return `Unlock at level ${value}`
      case "streak":
        return `Unlock with ${value}-day streak`
      case "tasks":
        return `Unlock after ${value} completed tasks`
      case "achievement":
        return `Unlock with "${value}" achievement`
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Themes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_THEMES.map((theme) => {
            const isUnlocked = isThemeUnlocked(theme)
            const isSelected = currentTheme === theme.id

            return (
              <div
                key={theme.id}
                className={cn(
                  "relative p-4 rounded-lg border-2 transition-all duration-200",
                  isSelected && "border-primary bg-primary/5",
                  !isSelected && isUnlocked && "border-border hover:border-primary/50",
                  !isUnlocked && "border-muted bg-muted/30",
                )}
              >
                {/* Theme Preview */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.colors.secondary }} />
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.colors.accent }} />
                  </div>
                  <div className="flex-1">
                    <h4 className={cn("font-semibold text-sm", !isUnlocked && "text-muted-foreground")}>
                      {theme.name}
                    </h4>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                  {!isUnlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>

                <p className={cn("text-xs mb-3", !isUnlocked && "text-muted-foreground")}>{theme.description}</p>

                {!isUnlocked && (
                  <Badge variant="outline" className="text-xs mb-3">
                    {getUnlockText(theme)}
                  </Badge>
                )}

                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={() => onThemeChange(theme.id)}
                  disabled={!isUnlocked}
                >
                  {isSelected ? "Selected" : isUnlocked ? "Select" : "Locked"}
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
