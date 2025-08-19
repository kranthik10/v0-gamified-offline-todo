"use client"

import type { UserProgress } from "@/lib/types"
import { AVAILABLE_AVATARS } from "@/lib/themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Lock, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarSelectorProps {
  currentAvatar: string
  progress: UserProgress
  onAvatarChange: (avatar: string) => void
}

export function AvatarSelector({ currentAvatar, progress, onAvatarChange }: AvatarSelectorProps) {
  const isAvatarUnlocked = (avatar: (typeof AVAILABLE_AVATARS)[0]) => {
    return progress.level >= avatar.unlockLevel
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Avatar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {AVAILABLE_AVATARS.map((avatar) => {
            const isUnlocked = isAvatarUnlocked(avatar)
            const isSelected = currentAvatar === avatar.emoji

            return (
              <div
                key={avatar.id}
                className={cn(
                  "relative aspect-square p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center",
                  isSelected && "border-primary bg-primary/5",
                  !isSelected && isUnlocked && "border-border hover:border-primary/50",
                  !isUnlocked && "border-muted bg-muted/30",
                )}
              >
                <div className={cn("text-2xl mb-1", !isUnlocked && "grayscale opacity-50")}>
                  {isUnlocked ? avatar.emoji : "🔒"}
                </div>
                <div className="text-xs text-center">
                  <p className={cn("font-medium", !isUnlocked && "text-muted-foreground")}>{avatar.name}</p>
                  {!isUnlocked && <p className="text-muted-foreground">Lv.{avatar.unlockLevel}</p>}
                </div>

                {isSelected && (
                  <div className="absolute -top-1 -right-1">
                    <Check className="w-3 h-3 text-primary bg-background rounded-full p-0.5" />
                  </div>
                )}

                {!isUnlocked && (
                  <div className="absolute -top-1 -right-1">
                    <Lock className="w-3 h-3 text-muted-foreground bg-background rounded-full p-0.5" />
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100"
                  onClick={() => onAvatarChange(avatar.emoji)}
                  disabled={!isUnlocked}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
