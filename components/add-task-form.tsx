"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "completed" | "completedAt">) => void
  editingTask?: Task
  onCancelEdit?: () => void
}

export function AddTaskForm({ onAddTask, editingTask, onCancelEdit }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(!!editingTask)
  const [title, setTitle] = useState(editingTask?.title || "")
  const [description, setDescription] = useState(editingTask?.description || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(editingTask?.priority || "medium")
  const [category, setCategory] = useState(editingTask?.category || "Personal")
  const [points, setPoints] = useState(editingTask?.points || 10)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      points,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setPriority("medium")
    setCategory("Personal")
    setPoints(10)
    setIsOpen(false)

    if (onCancelEdit) {
      onCancelEdit()
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    if (onCancelEdit) {
      onCancelEdit()
    }
  }

  if (!isOpen && !editingTask) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Task
      </Button>
    )
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-primary">
            {editingTask ? "Edit Task" : "Add New Task"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">📝 Low</SelectItem>
                  <SelectItem value="medium">⚡ Medium</SelectItem>
                  <SelectItem value="high">🔥 High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">🏠 Personal</SelectItem>
                  <SelectItem value="Work">💼 Work</SelectItem>
                  <SelectItem value="Health">💪 Health</SelectItem>
                  <SelectItem value="Learning">📚 Learning</SelectItem>
                  <SelectItem value="Shopping">🛒 Shopping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="points">XP Points</Label>
            <Select value={points.toString()} onValueChange={(value) => setPoints(Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 XP - Quick task</SelectItem>
                <SelectItem value="10">10 XP - Normal task</SelectItem>
                <SelectItem value="20">20 XP - Important task</SelectItem>
                <SelectItem value="50">50 XP - Major task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              {editingTask ? "Update Task" : "Add Task"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
