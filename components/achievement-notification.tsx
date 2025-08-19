"use client"

import { useEffect, useState } from "react"
import type { Achievement } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Crown, Gem, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementNotificationProps {
  achievement: Achievement | null
  show: boolean
  onComplete: () => void
}

export function AchievementNotification({ achievement, show, onComplete }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show && achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 300)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, achievement, onComplete])

  if (!show || !achievement || !isVisible) return null

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 bg-gray-50"
      case "rare":
        return "border-blue-300 bg-blue-50"
      case "epic":
        return "border-purple-300 bg-purple-50"
      case "legendary":
        return "border-yellow-300 bg-yellow-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return <Star className="w-4 h-4" />
      case "rare":
        return <Gem className="w-4 h-4" />
      case "epic":
        return <Crown className="w-4 h-4" />
      case "legendary":
        return <Sparkles className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-500 max-w-sm",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full",
      )}
    >
      <Card className={cn("shadow-lg", getRarityColor(achievement.rarity))}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Trophy className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 animate-bounce">{getRarityIcon(achievement.rarity)}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-sm text-primary">Achievement Unlocked!</h4>
                <Badge variant="outline" className="text-xs">
                  {achievement.rarity}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{achievement.icon}</span>
                <h5 className="font-semibold text-sm">{achievement.title}</h5>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
              <Badge variant="secondary" className="text-xs">
                +{achievement.points} XP
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
