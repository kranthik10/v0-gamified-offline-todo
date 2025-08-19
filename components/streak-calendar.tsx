"use client"

import { useState } from "react"
import type { Task } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Flame, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakCalendarProps {
  tasks: Task[]
  currentStreak: number
  longestStreak: number
}

export function StreakCalendar({ tasks, currentStreak, longestStreak }: StreakCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getTasksForDate = (date: Date) => {
    const dateString = date.toDateString()
    return tasks.filter(
      (task) => task.completed && task.completedAt && new Date(task.completedAt).toDateString() === dateString,
    )
  }

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const days = []

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const tasksForDay = getTasksForDate(date)
    const hasCompletedTasks = tasksForDay.length > 0
    const isCurrentDay = isToday(date)
    const isFutureDate = date > new Date()

    days.push(
      <div
        key={day}
        className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200",
          hasCompletedTasks && "bg-primary text-primary-foreground shadow-sm",
          !hasCompletedTasks && !isFutureDate && "bg-muted/50 text-muted-foreground",
          isCurrentDay && "ring-2 ring-accent ring-offset-2",
          isFutureDate && "text-muted-foreground/50",
        )}
      >
        <span>{day}</span>
        {hasCompletedTasks && (
          <div className="absolute mt-6">
            <div className="w-1 h-1 bg-accent rounded-full" />
          </div>
        )}
      </div>,
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Activity Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">{monthName}</span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Streak Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Current: {currentStreak} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Best: {longestStreak} days
                </Badge>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground text-center font-medium">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1 relative">{days}</div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded" />
              <span>Tasks completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted/50 rounded" />
              <span>No tasks</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
