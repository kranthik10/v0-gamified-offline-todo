"use client"

import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { commonStyles, typography, spacing } from "../utils/styleHelpers"
import type { Task } from "../types"

interface StreakCalendarProps {
  tasks: Task[]
  currentStreak: number
  longestStreak: number
}

export function StreakCalendar({ tasks, currentStreak, longestStreak }: StreakCalendarProps) {
  const { currentTheme } = useTheme()

  // Get last 30 days
  const getDaysArray = () => {
    const days = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push(date)
    }

    return days
  }

  const hasTasksOnDate = (date: Date) => {
    const dateString = date.toDateString()
    return tasks.some(
      (task) => task.completed && task.completedAt && new Date(task.completedAt).toDateString() === dateString,
    )
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...commonStyles.shadow,
    },
    title: {
      ...typography.h4,
      color: currentTheme.colors.text,
      marginBottom: spacing.md,
      textAlign: "center",
    },
    calendar: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 4,
    },
    daySquare: {
      width: 24,
      height: 24,
      borderRadius: 4,
      backgroundColor: currentTheme.colors.background,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    completedDay: {
      backgroundColor: currentTheme.colors.primary,
      borderColor: currentTheme.colors.primary,
    },
    streakInfo: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: currentTheme.colors.border,
    },
    streakItem: {
      alignItems: "center",
    },
    streakValue: {
      ...typography.h4,
      color: currentTheme.colors.primary,
      fontWeight: "bold",
    },
    streakLabel: {
      ...typography.bodySmall,
      color: currentTheme.colors.textSecondary,
    },
  })

  const days = getDaysArray()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Activity Calendar</Text>

      <View style={styles.calendar}>
        {days.map((day, index) => (
          <View key={index} style={[styles.daySquare, hasTasksOnDate(day) && styles.completedDay]} />
        ))}
      </View>

      <View style={styles.streakInfo}>
        <View style={styles.streakItem}>
          <Text style={styles.streakValue}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>Current</Text>
        </View>
        <View style={styles.streakItem}>
          <Text style={styles.streakValue}>{longestStreak}</Text>
          <Text style={styles.streakLabel}>Best</Text>
        </View>
      </View>
    </View>
  )
}
