"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { Task, UserProgress, Achievement } from "../types"
import { calculateXPForTask, calculateLevel, updateStreak, checkForNewAchievements } from "../utils/gameLogic"
import { StorageManager } from "../utils/storage"

interface GameState {
  tasks: Task[]
  progress: UserProgress
  loading: boolean
}

interface GameContextType extends GameState {
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  toggleTaskComplete: (
    taskId: string,
  ) => Promise<{ xpGained: number; levelUp: boolean; newAchievements: Achievement[] }>
  updateProgress: (updates: Partial<UserProgress>) => void
  exportData: () => Promise<void>
  importData: () => Promise<void>
  clearAllData: () => Promise<void>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const initialProgress: UserProgress = {
  level: 1,
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  achievements: [],
  theme: "default",
  avatar: "🎮",
  streakHistory: [],
}

type GameAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "SET_PROGRESS"; payload: UserProgress }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: { id: string; updates: Partial<Task> } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "UPDATE_PROGRESS"; payload: Partial<UserProgress> }

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_TASKS":
      return { ...state, tasks: action.payload }
    case "SET_PROGRESS":
      return { ...state, progress: action.payload }
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task,
        ),
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      }
    case "UPDATE_PROGRESS":
      return {
        ...state,
        progress: { ...state.progress, ...action.payload },
      }
    default:
      return state
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, {
    tasks: [],
    progress: initialProgress,
    loading: true,
  })

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData()
  }, [])

  // Save data to AsyncStorage whenever state changes
  useEffect(() => {
    if (!state.loading) {
      saveData()
    }
  }, [state.tasks, state.progress, state.loading])

  const loadData = async () => {
    try {
      const [tasks, progress] = await Promise.all([StorageManager.loadTasks(), StorageManager.loadProgress()])

      if (tasks.length > 0) {
        dispatch({ type: "SET_TASKS", payload: tasks })
      }

      if (progress) {
        dispatch({ type: "SET_PROGRESS", payload: progress })
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const saveData = async () => {
    try {
      await Promise.all([StorageManager.saveTasks(state.tasks), StorageManager.saveProgress(state.progress)])
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }

  const exportData = async () => {
    try {
      await StorageManager.exportData(state.tasks, state.progress)
    } catch (error) {
      console.error("Error exporting data:", error)
      throw error
    }
  }

  const importData = async () => {
    try {
      const gameData = await StorageManager.importData()
      dispatch({ type: "SET_TASKS", payload: gameData.tasks })
      dispatch({ type: "SET_PROGRESS", payload: gameData.progress })
    } catch (error) {
      console.error("Error importing data:", error)
      throw error
    }
  }

  const clearAllData = async () => {
    try {
      await StorageManager.clearAllData()
      dispatch({ type: "SET_TASKS", payload: [] })
      dispatch({ type: "SET_PROGRESS", payload: initialProgress })
    } catch (error) {
      console.error("Error clearing data:", error)
      throw error
    }
  }

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      completed: false,
    }
    dispatch({ type: "ADD_TASK", payload: newTask })
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: "UPDATE_TASK", payload: { id: taskId, updates } })
  }

  const deleteTask = (taskId: string) => {
    dispatch({ type: "DELETE_TASK", payload: taskId })
  }

  const toggleTaskComplete = async (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task) return { xpGained: 0, levelUp: false, newAchievements: [] }

    const wasCompleted = task.completed
    const updatedTask = {
      ...task,
      completed: !wasCompleted,
      completedAt: !wasCompleted ? new Date() : undefined,
    }

    dispatch({ type: "UPDATE_TASK", payload: { id: taskId, updates: updatedTask } })

    if (!wasCompleted) {
      // Task is being completed
      const xpGained = calculateXPForTask(task)
      const newTotalXP = state.progress.totalXP + xpGained
      const newLevel = calculateLevel(newTotalXP)
      const levelUp = newLevel > state.progress.level

      const updatedTasks = state.tasks.map((t) => (t.id === taskId ? updatedTask : t))
      const streakData = updateStreak(updatedTasks, state.progress.lastCompletionDate)

      const newProgress = {
        ...state.progress,
        totalXP: newTotalXP,
        level: newLevel,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastCompletionDate: new Date().toDateString(),
        streakHistory: streakData.streakHistory,
      }

      const newAchievements = checkForNewAchievements(updatedTasks, newProgress, state.progress.achievements)

      if (newAchievements.length > 0) {
        newProgress.achievements = [...state.progress.achievements, ...newAchievements]
        newProgress.totalXP += newAchievements.reduce((sum, ach) => sum + ach.points, 0)
        newProgress.level = calculateLevel(newProgress.totalXP)
      }

      dispatch({ type: "UPDATE_PROGRESS", payload: newProgress })

      return { xpGained, levelUp, newAchievements }
    }

    return { xpGained: 0, levelUp: false, newAchievements: [] }
  }

  const updateProgress = (updates: Partial<UserProgress>) => {
    dispatch({ type: "UPDATE_PROGRESS", payload: updates })
  }

  const value: GameContextType = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    updateProgress,
    exportData,
    importData,
    clearAllData,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
