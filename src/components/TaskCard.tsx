"use client"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Task } from "../types"
import { useTheme } from "../context/ThemeContext"

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const { currentTheme } = useTheme()

  const priorityColors = {
    low: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
    medium: { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
    high: { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
  }

  const priorityIcons = {
    low: "📝",
    medium: "⚡",
    high: "🔥",
  }

  const styles = StyleSheet.create({
    card: {
      backgroundColor: task.completed ? currentTheme.colors.surface + "80" : currentTheme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      opacity: task.completed ? 0.7 : 1,
    },
    content: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: currentTheme.colors.primary,
      backgroundColor: task.completed ? currentTheme.colors.primary : "transparent",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
    },
    taskContent: {
      flex: 1,
      minWidth: 0,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: currentTheme.colors.text,
      textDecorationLine: task.completed ? "line-through" : "none",
      flex: 1,
    },
    priorityIcon: {
      fontSize: 18,
    },
    description: {
      fontSize: 14,
      color: currentTheme.colors.textSecondary,
      marginBottom: 12,
      textDecorationLine: task.completed ? "line-through" : "none",
    },
    bottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    badges: {
      flexDirection: "row",
      gap: 8,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "500",
    },
    priorityBadge: {
      backgroundColor: priorityColors[task.priority].bg,
      borderColor: priorityColors[task.priority].border,
    },
    priorityBadgeText: {
      color: priorityColors[task.priority].text,
    },
    categoryBadge: {
      backgroundColor: currentTheme.colors.primary + "20",
      borderColor: currentTheme.colors.primary + "40",
    },
    categoryBadgeText: {
      color: currentTheme.colors.primary,
    },
    xpContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    xpText: {
      fontSize: 12,
      fontWeight: "600",
      color: currentTheme.colors.primary,
    },
    actions: {
      flexDirection: "row",
      gap: 4,
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: currentTheme.colors.background,
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.checkbox} onPress={() => onToggleComplete(task.id)}>
          {task.completed && <Ionicons name="checkmark" size={16} color="white" />}
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {task.title}
            </Text>
            <Text style={styles.priorityIcon}>{priorityIcons[task.priority]}</Text>
          </View>

          {task.description && (
            <Text style={styles.description} numberOfLines={3}>
              {task.description}
            </Text>
          )}

          <View style={styles.bottomRow}>
            <View style={styles.badges}>
              <View style={[styles.badge, styles.priorityBadge]}>
                <Text style={[styles.badgeText, styles.priorityBadgeText]}>{task.priority}</Text>
              </View>
              <View style={[styles.badge, styles.categoryBadge]}>
                <Text style={[styles.badgeText, styles.categoryBadgeText]}>{task.category}</Text>
              </View>
            </View>

            <View style={styles.xpContainer}>
              <Ionicons name="star" size={12} color="#fbbf24" />
              <Text style={styles.xpText}>10 XP</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(task)}>
            <Ionicons name="pencil" size={16} color={currentTheme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(task.id)}>
            <Ionicons name="trash" size={16} color={currentTheme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
