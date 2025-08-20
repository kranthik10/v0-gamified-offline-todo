"use client"

import { useState } from "react"
import { View, Text, FlatList, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import type { Task } from "../types"
import { useGame } from "../context/GameContext"
import { useTheme } from "../context/ThemeContext"
import { useHaptics } from "../hooks/useHaptics"
import { useNotifications } from "../hooks/useNotifications"
import { SwipeableTaskCard } from "../components/SwipeableTaskCard"
import { AddTaskForm } from "../components/AddTaskForm"
import { PullToRefresh } from "../components/PullToRefresh"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { spacing } from "../utils/styleHelpers"

export default function TasksScreen() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete, loading } = useGame()
  const { currentTheme } = useTheme()
  const { success, lightImpact } = useHaptics()
  const { sendAchievementNotification, sendLevelUpNotification } = useNotifications()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    lightImpact()
    if (editingTask) {
      updateTask(editingTask.id, taskData)
      setEditingTask(null)
    } else {
      addTask(taskData)
    }
  }

  const handleToggleComplete = async (taskId: string) => {
    const result = await toggleTaskComplete(taskId)
    if (result.xpGained > 0) {
      success()

      // Send notifications for achievements and level ups
      if (result.newAchievements.length > 0) {
        for (const achievement of result.newAchievements) {
          await sendAchievementNotification(achievement.title, achievement.points)
        }
      }

      if (result.levelUp) {
        // Get new level from progress (this would need to be passed or calculated)
        await sendLevelUpNotification(result.levelUp ? 1 : 1) // This needs proper level calculation
      }

      Alert.alert("🎉 Task Completed!", `You earned ${result.xpGained} XP!${result.levelUp ? " Level up! 🚀" : ""}`, [
        { text: "Awesome!", style: "default" },
      ])
    }
  }

  const handleEdit = (task: Task) => {
    lightImpact()
    setEditingTask(task)
  }

  const handleDelete = (taskId: string) => {
    lightImpact()
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTask(taskId) },
    ])
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  const handleRefresh = async () => {
    // Simulate refresh - in a real app this might sync with a server
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    content: {
      flex: 1,
      padding: spacing.md,
    },
    header: {
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: currentTheme.colors.primary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: currentTheme.colors.textSecondary,
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: currentTheme.colors.text,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      padding: 48,
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16,
      marginTop: spacing.lg,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: currentTheme.colors.text,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 16,
      color: currentTheme.colors.textSecondary,
      textAlign: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  })

  const renderTask = ({ item }: { item: Task }) => (
    <SwipeableTaskCard
      task={item}
      onToggleComplete={handleToggleComplete}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={50} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <PullToRefresh onRefresh={handleRefresh}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>🎮 GameDo</Text>
            <Text style={styles.subtitle}>Level up your productivity, one task at a time</Text>
          </View>

          <AddTaskForm
            onAddTask={handleAddTask}
            editingTask={editingTask || undefined}
            onCancelEdit={handleCancelEdit}
          />

          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>Ready to level up?</Text>
              <Text style={styles.emptyDescription}>Add your first task and start your productivity journey!</Text>
            </View>
          ) : (
            <FlatList
              data={[...pendingTasks, ...completedTasks]}
              renderItem={renderTask}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                pendingTasks.length > 0 ? (
                  <Text style={styles.sectionTitle}>Active Tasks ({pendingTasks.length})</Text>
                ) : null
              }
              ListFooterComponent={
                completedTasks.length > 0 ? (
                  <Text style={styles.sectionTitle}>Completed Tasks ({completedTasks.length})</Text>
                ) : null
              }
            />
          )}
        </View>
      </PullToRefresh>
    </SafeAreaView>
  )
}
