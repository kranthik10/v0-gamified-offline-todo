"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LevelUpAnimationProps {
  show: boolean
  newLevel: number
  onComplete: () => void
}

export function LevelUpAnimation({ show, newLevel, onComplete }: LevelUpAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 300)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show && !isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <Card
        className={cn(
          "mx-4 max-w-sm transform transition-all duration-500",
          isVisible ? "scale-100 rotate-0" : "scale-75 rotate-12",
        )}
      >
        <CardContent className="p-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping">
              <Trophy className="w-16 h-16 mx-auto text-primary opacity-75" />
            </div>
            <Trophy className="w-16 h-16 mx-auto text-primary relative z-10" />
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-bounce delay-150">
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mb-2 font-sans">Level Up!</h2>
          <p className="text-muted-foreground mb-4 font-serif">Congratulations! You've reached</p>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-primary text-primary-foreground">
            Level {newLevel}
          </Badge>
          <p className="text-sm text-muted-foreground mt-4">Keep up the amazing work!</p>
        </CardContent>
      </Card>
    </div>
  )
}
