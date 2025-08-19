"use client"

import type { Task } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit3, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  const priorityIcons = {
    low: "📝",
    medium: "⚡",
    high: "🔥",
  }

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", task.completed && "opacity-75 bg-muted")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} className="mt-1" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={cn("font-semibold text-sm", task.completed && "line-through text-muted-foreground")}>
                {task.title}
              </h3>
              <span className="text-lg">{priorityIcons[task.priority]}</span>
            </div>

            {task.description && (
              <p className={cn("text-sm text-muted-foreground mb-2", task.completed && "line-through")}>
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  {task.category}
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-accent">{task.points} XP</span>
              </div>
            </div>
          </div>

          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-8 w-8 p-0">
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
