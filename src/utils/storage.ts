import AsyncStorage from "@react-native-async-storage/async-storage"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import * as DocumentPicker from "expo-document-picker"
import type { Task, UserProgress } from "../types"

export interface GameData {
  tasks: Task[]
  progress: UserProgress
  exportDate: string
  version: string
}

export class StorageManager {
  private static readonly TASKS_KEY = "gamedo-tasks"
  private static readonly PROGRESS_KEY = "gamedo-progress"
  private static readonly VERSION = "1.0.0"

  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error("Error saving tasks:", error)
      throw new Error("Failed to save tasks")
    }
  }

  static async loadTasks(): Promise<Task[]> {
    try {
      const tasksData = await AsyncStorage.getItem(this.TASKS_KEY)
      if (tasksData) {
        const tasks = JSON.parse(tasksData)
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }))
      }
      return []
    } catch (error) {
      console.error("Error loading tasks:", error)
      return []
    }
  }

  static async saveProgress(progress: UserProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress))
    } catch (error) {
      console.error("Error saving progress:", error)
      throw new Error("Failed to save progress")
    }
  }

  static async loadProgress(): Promise<UserProgress | null> {
    try {
      const progressData = await AsyncStorage.getItem(this.PROGRESS_KEY)
      if (progressData) {
        const progress = JSON.parse(progressData)
        return {
          ...progress,
          achievements:
            progress.achievements?.map((achievement: any) => ({
              ...achievement,
              unlockedAt: new Date(achievement.unlockedAt),
            })) || [],
        }
      }
      return null
    } catch (error) {
      console.error("Error loading progress:", error)
      return null
    }
  }

  static async exportData(tasks: Task[], progress: UserProgress): Promise<void> {
    try {
      const gameData: GameData = {
        tasks,
        progress,
        exportDate: new Date().toISOString(),
        version: this.VERSION,
      }

      const jsonString = JSON.stringify(gameData, null, 2)
      const fileName = `gamedo-backup-${new Date().toISOString().split("T")[0]}.json`
      const fileUri = FileSystem.documentDirectory + fileName

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      })

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export GameDo Data",
        })
      } else {
        throw new Error("Sharing is not available on this device")
      }
    } catch (error) {
      console.error("Error exporting data:", error)
      throw new Error("Failed to export data")
    }
  }

  static async importData(): Promise<GameData> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      })

      if (result.canceled) {
        throw new Error("Import cancelled")
      }

      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.UTF8,
      })

      const gameData: GameData = JSON.parse(fileContent)

      // Validate data structure
      if (!gameData.tasks || !gameData.progress) {
        throw new Error("Invalid backup file format")
      }

      // Convert date strings back to Date objects
      const tasks = gameData.tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }))

      const progress = {
        ...gameData.progress,
        achievements:
          gameData.progress.achievements?.map((achievement: any) => ({
            ...achievement,
            unlockedAt: new Date(achievement.unlockedAt),
          })) || [],
      }

      return {
        ...gameData,
        tasks,
        progress,
      }
    } catch (error) {
      console.error("Error importing data:", error)
      throw new Error("Failed to import data")
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.TASKS_KEY, this.PROGRESS_KEY])
    } catch (error) {
      console.error("Error clearing data:", error)
      throw new Error("Failed to clear data")
    }
  }

  static async getStorageInfo(): Promise<{ tasksSize: number; progressSize: number; totalSize: number }> {
    try {
      const [tasksData, progressData] = await AsyncStorage.multiGet([this.TASKS_KEY, this.PROGRESS_KEY])

      const tasksSize = tasksData[1] ? new Blob([tasksData[1]]).size : 0
      const progressSize = progressData[1] ? new Blob([progressData[1]]).size : 0

      return {
        tasksSize,
        progressSize,
        totalSize: tasksSize + progressSize,
      }
    } catch (error) {
      console.error("Error getting storage info:", error)
      return { tasksSize: 0, progressSize: 0, totalSize: 0 }
    }
  }
}
