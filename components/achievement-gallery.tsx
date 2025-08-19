"use client"

import type { Achievement, UserProgress, Task } from "@/lib/types"
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Lock, Star, Crown, Gem, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementGalleryProps {
  achievements: Achievement[]
  tasks: Task[]
  progress: UserProgress
}

export function AchievementGallery({ achievements, tasks, progress }: AchievementGalleryProps) {
  const unlockedIds = new Set(achievements.map((a) => a.id))

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return <Star className="w-3 h-3" />
      case "rare":
        return <Gem className="w-3 h-3" />
      case "epic":
        return <Crown className="w-3 h-3" />
      case "legendary":
        return <Sparkles className="w-3 h-3" />
      default:
        return <Star className="w-3 h-3" />
    }
  }

  const getProgressForAchievement = (def: any) => {
    // This is a simplified progress calculation
    // In a real app, you'd want more sophisticated progress tracking
    if (def.id === "task-10") {
      const completed = tasks.filter((t) => t.completed).length
      return Math.min((completed / 10) * 100, 100)
    }
    if (def.id === "task-50") {
      const completed = tasks.filter((t) => t.completed).length
      return Math.min((completed / 50) * 100, 100)
    }
    if (def.id === "task-100") {
      const completed = tasks.filter((t) => t.completed).length
      return Math.min((completed / 100) * 100, 100)
    }
    if (def.id === "streak-3") {
      return Math.min((progress.currentStreak / 3) * 100, 100)
    }
    if (def.id === "streak-7") {
      return Math.min((progress.currentStreak / 7) * 100, 100)
    }
    if (def.id === "streak-30") {
      return Math.min((progress.currentStreak / 30) * 100, 100)
    }
    if (def.id === "high-priority-5") {
      const completed = tasks.filter((t) => t.completed && t.priority === "high").length
      return Math.min((completed / 5) * 100, 100)
    }
    if (def.id === "high-priority-25") {
      const completed = tasks.filter((t) => t.completed && t.priority === "high").length
      return Math.min((completed / 25) * 100, 100)
    }

    return unlockedIds.has(def.id) ? 100 : 0
  }

  const categories = [...new Set(ACHIEVEMENT_DEFINITIONS.map((def) => def.category))]
  const unlockedCount = achievements.length
  const totalCount = ACHIEVEMENT_DEFINITIONS.length

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {unlockedCount}/{totalCount} unlocked
              </span>
            </div>
            <Progress value={(unlockedCount / totalCount) * 100} className="h-2" />

            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {
                    ACHIEVEMENT_DEFINITIONS.filter((d) => d.rarity === "common").filter((d) => unlockedIds.has(d.id))
                      .length
                  }
                </div>
                <div className="text-xs text-muted-foreground">Common</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {
                    ACHIEVEMENT_DEFINITIONS.filter((d) => d.rarity === "rare").filter((d) => unlockedIds.has(d.id))
                      .length
                  }
                </div>
                <div className="text-xs text-muted-foreground">Rare</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {
                    ACHIEVEMENT_DEFINITIONS.filter((d) => d.rarity === "epic").filter((d) => unlockedIds.has(d.id))
                      .length
                  }
                </div>
                <div className="text-xs text-muted-foreground">Epic</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    ACHIEVEMENT_DEFINITIONS.filter((d) => d.rarity === "legendary").filter((d) => unlockedIds.has(d.id))
                      .length
                  }
                </div>
                <div className="text-xs text-muted-foreground">Legendary</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Gallery */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3 text-foreground">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENT_DEFINITIONS.filter((def) => def.category === category).map((def) => {
                  const isUnlocked = unlockedIds.has(def.id)
                  const progressValue = getProgressForAchievement(def)
                  const achievement = achievements.find((a) => a.id === def.id)

                  return (
                    <Card
                      key={def.id}
                      className={cn(
                        "transition-all duration-200",
                        isUnlocked ? "bg-primary/5 border-primary/20" : "bg-muted/30",
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn("text-2xl", !isUnlocked && "grayscale opacity-50")}>
                            {isUnlocked ? def.icon : "🔒"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={cn("font-semibold text-sm", !isUnlocked && "text-muted-foreground")}>
                                {def.title}
                              </h4>
                              <Badge variant="outline" className={cn("text-xs", getRarityColor(def.rarity))}>
                                {getRarityIcon(def.rarity)}
                                {def.rarity}
                              </Badge>
                            </div>
                            <p className={cn("text-xs mb-2", !isUnlocked && "text-muted-foreground")}>
                              {def.description}
                            </p>

                            {!isUnlocked && progressValue > 0 && progressValue < 100 && (
                              <div className="space-y-1">
                                <Progress value={progressValue} className="h-1" />
                                <p className="text-xs text-muted-foreground">{Math.round(progressValue)}% complete</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="secondary" className="text-xs">
                                +{def.points} XP
                              </Badge>
                              {isUnlocked && achievement && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="unlocked">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements
              .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
              .map((achievement) => {
                const def = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === achievement.id)
                if (!def) return null

                return (
                  <Card key={achievement.id} className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{def.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{def.title}</h4>
                            <Badge variant="outline" className={cn("text-xs", getRarityColor(def.rarity))}>
                              {getRarityIcon(def.rarity)}
                              {def.rarity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{def.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              +{def.points} XP
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="locked">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACHIEVEMENT_DEFINITIONS.filter((def) => !unlockedIds.has(def.id)).map((def) => (
              <Card key={def.id} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl grayscale opacity-50">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-muted-foreground">{def.title}</h4>
                        <Badge variant="outline" className={cn("text-xs", getRarityColor(def.rarity))}>
                          {getRarityIcon(def.rarity)}
                          {def.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{def.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        +{def.points} XP
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACHIEVEMENT_DEFINITIONS.filter((def) => {
              const progressValue = getProgressForAchievement(def)
              return !unlockedIds.has(def.id) && progressValue > 0 && progressValue < 100
            }).map((def) => {
              const progressValue = getProgressForAchievement(def)

              return (
                <Card key={def.id} className="bg-accent/5 border-accent/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl opacity-75">{def.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{def.title}</h4>
                          <Badge variant="outline" className={cn("text-xs", getRarityColor(def.rarity))}>
                            {getRarityIcon(def.rarity)}
                            {def.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{def.description}</p>
                        <div className="space-y-2">
                          <Progress value={progressValue} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-accent font-medium">
                              {Math.round(progressValue)}% complete
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              +{def.points} XP
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
