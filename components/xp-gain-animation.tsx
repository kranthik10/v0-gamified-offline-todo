"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface XPGainAnimationProps {
  show: boolean
  xpGained: number
  onComplete: () => void
}

export function XPGainAnimation({ show, xpGained, onComplete }: XPGainAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 300)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show && !isVisible) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
      <div
        className={cn(
          "flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full shadow-lg transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
        )}
      >
        <Star className="w-4 h-4 fill-current" />
        <span className="font-semibold">+{xpGained} XP</span>
      </div>
    </div>
  )
}
