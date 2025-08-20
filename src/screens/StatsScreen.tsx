"use client"

import { View, Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useGame } from "../context/GameContext"
import { useTheme } from "../context/ThemeContext"
import { ProgressRing } from "../components/ProgressRing"
import { StreakCalendar } from "../components/StreakCalendar"
import { commonStyles, typography, spacing } from "../utils/styleHelpers"

export default function StatsScreen() {
  const { tasks, progress } = useGame()
  const { currentTheme } = useTheme()

  const completedTasks = tasks.filter((task) => task.completed)
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0

  const todayTasks = tasks.filter((task) => {
    const today = new Date().toDateString()
    return task.completed && task.completedAt && new Date(task.completedAt).toDateString() === today
  })

  const currentLevelXP = progress.level === 1 ? 0 : Math.pow(progress.level - 1, 2) * 100
  const nextLevelXP = Math.pow(progress.level, 2) * 100
  const progressToNextLevel = ((progress.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  const categoryStats = tasks.reduce(
    (acc, task) => {
      if (task.completed) {
        acc[task.category] = (acc[task.category] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategory = Object.entries(categoryStats).sort(([, a], [, b]) => b - a)[0]

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    content: {
      flex: 1,
      padding: spacing.md,
    },
    levelCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16,
      padding: spacing.lg,
      alignItems: "center",
      marginBottom: spacing.lg,
      ...commonStyles.shadow,
    },
    levelTitle: {
      ...typography.h3,
      color: currentTheme.colors.text,
      marginBottom: spacing.md,
      flexDirection: "row",
      alignItems: "center",
    },
    levelNumber: {
      ...typography.h1,
      color: currentTheme.colors.primary,
      fontWeight: "bold",
    },
    levelLabel: {
      ...typography.bodySmall,
      color: currentTheme.colors.textSecondary,
    },
    xpInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: spacing.md,
    },
    xpText: {
      ...typography.bodySmall,
      color: currentTheme.colors.textSecondary,
    },
    xpBadge: {
      backgroundColor: currentTheme.colors.primary + "20",
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 8,
      marginTop: spacing.sm,
    },
    xpBadgeText: {
      ...typography.bodySmall,
      color: currentTheme.colors.primary,
      fontWeight: "600",
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12,
      padding: spacing.md,
      width: "48%",
      alignItems: "center",
      ...commonStyles.shadow,
    },
    statIcon: {
      marginBottom: spacing.sm,
    },
    statValue: {
      ...typography.h2,
      fontWeight: "bold",
      marginBottom: 4,
    },
    statLabel: {
      ...typography.bodySmall,
      color: currentTheme.colors.textSecondary,
      textAlign: "center",
    },
    statSubtext: {
      ...typography.caption,
      color: currentTheme.colors.textSecondary,
      textAlign: "center",
      marginTop: 2,
    },
    categoryCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...commonStyles.shadow,
    },
    categoryTitle: {
      ...typography.h4,
      color: currentTheme.colors.text,
      marginBottom: spacing.sm,
    },
    categoryContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      ...typography.body,
      fontWeight: "600",
      color: currentTheme.colors.text,
    },
    categoryCount: {
      ...typography.bodySmall,
      color: currentTheme.colors.textSecondary,
    },
    categoryBadge: {
      backgroundColor: currentTheme.colors.accent + "20",
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 8,
    },
    categoryBadgeText: {
      ...typography.bodySmall,
      color: currentTheme.colors.accent,
      fontWeight: "600",
    },
  })

  const StatCard = ({ icon, value, label, subtext, color }: any) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={color} style={styles.statIcon} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {subtext && <Text style={styles.statSubtext}>{subtext}</Text>}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Level Progress */}
        <View style={styles.levelCard}>
          <View style={styles.levelTitle}>
            <Ionicons name="trophy" size={20} color={currentTheme.colors.primary} />
            <Text style={[styles.levelTitle, { marginLeft: spacing.sm }]}>Level Progress</Text>
          </View>

          <ProgressRing progress={progressToNextLevel} size={140} strokeWidth={10}>
            <View style={commonStyles.centerContent}>
              <Text style={styles.levelNumber}>{progress.level}</Text>
              <Text style={styles.levelLabel}>Level</Text>
            </View>
          </ProgressRing>

          <View style={styles.xpInfo}>
            <Text style={styles.xpText}>{progress.totalXP} XP</Text>
            <Text style={styles.xpText}>{nextLevelXP} XP</Text>
          </View>

          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeText}>{nextLevelXP - progress.totalXP} XP to next level</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="flame"
            value={progress.currentStreak}
            label="Current Streak"
            subtext={`Best: ${progress.longestStreak} days`}
            color="#f59e0b"
          />
          <StatCard
            icon="calendar"
            value={todayTasks.length}
            label="Today's Tasks"
            subtext="Keep it up!"
            color="#10b981"
          />
          <StatCard
            icon="target"
            value={`${completionRate.toFixed(0)}%`}
            label="Completion Rate"
            subtext={`${completedTasks.length}/${totalTasks} tasks`}
            color="#3b82f6"
          />
          <StatCard
            icon="trophy"
            value={progress.achievements.length}
            label="Achievements"
            subtext="Unlocked"
            color="#8b5cf6"
          />
        </View>

        {/* Streak Calendar */}
        <StreakCalendar tasks={tasks} currentStreak={progress.currentStreak} longestStreak={progress.longestStreak} />

        {/* Top Category */}
        {topCategory && (
          <View style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Top Category</Text>
            <View style={styles.categoryContent}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{topCategory[0]}</Text>
                <Text style={styles.categoryCount}>{topCategory[1]} tasks completed</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>Champion</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
