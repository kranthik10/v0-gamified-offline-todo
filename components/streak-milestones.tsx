"use client"

import type { UserProgress } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, Trophy, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakMilestonesProps {
  progress: UserProgress
}

const STREAK_MILESTONES = [
  { days: 3, title: "Getting Started", icon: "🔥", reward: "25 XP" },
  { days: 7, title: "Week Warrior", icon: "⚡", reward: "50 XP" },
  { days: 14, title: "Two Week Champion", icon: "🏆", reward: "100 XP" },
  { days: 30, title: "Monthly Master", icon: "👑", reward: "200 XP" },
  { days: 60, title: "Consistency King", icon: "💎", reward: "400 XP" },
  { days: 100, title: "Century Achiever", icon: "🌟", reward: "1000 XP" },
]

export function StreakMilestones({ progress }: StreakMilestonesProps) {
  const currentStreak = progress.currentStreak
  const longestStreak = progress.longestStreak

  const getNextMilestone = () => {
    return STREAK_MILESTONES.find((milestone) => milestone.days > currentStreak)
  }

  const nextMilestone = getNextMilestone()
  const progressToNext = nextMilestone ? (currentStreak / nextMilestone.days) * 100 : 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Streak Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Next Milestone Progress */}
        {nextMilestone && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Next: {nextMilestone.title}</p>
                <p className="text-sm text-muted-foreground">{nextMilestone.days - currentStreak} days to go</p>
              </div>
              <div className="text-right">
                <div className="text-2xl">{nextMilestone.icon}</div>
                <Badge variant="outline" className="text-xs">
                  {nextMilestone.reward}
                </Badge>
              </div>
            </div>
            <Progress value={progressToNext} className="h-2" />
          </div>
        )}

        {/* All Milestones */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">All Milestones</h4>
          <div className="space-y-2">
            {STREAK_MILESTONES.map((milestone) => {
              const isAchieved = longestStreak >= milestone.days
              const isCurrent = currentStreak >= milestone.days

              return (
                <div
                  key={milestone.days}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
                    isAchieved && "bg-primary/5 border-primary/20",
                    !isAchieved && "bg-muted/30 border-muted",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{milestone.icon}</div>
                    <div>
                      <p className={cn("font-medium", isAchieved && "text-primary")}>{milestone.title}</p>
                      <p className="text-sm text-muted-foreground">{milestone.days} day streak</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isAchieved ? "default" : "outline"}
                      className={cn("text-xs", isAchieved && "bg-primary text-primary-foreground")}
                    >
                      {milestone.reward}
                    </Badge>
                    {isAchieved && <Trophy className="w-4 h-4 text-primary" />}
                    {isCurrent && currentStreak >= milestone.days && <Flame className="w-4 h-4 text-orange-500" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Streak Stats Summary */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
