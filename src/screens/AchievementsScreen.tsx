"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useGame } from "../context/GameContext"
import { useTheme } from "../context/ThemeContext"
import { commonStyles, typography, spacing } from "../utils/styleHelpers"

export default function AchievementsScreen() {
  const { tasks, progress } = useGame()
  const { currentTheme } = useTheme()

  // Mock achievements data - in a real app this would come from a service
  const allAchievements = [
    {
      id: "first-task",
      title: "First Steps",
      description: "Complete your first task",
      icon: "🎯",
      points: 50,
      rarity: "common",
      unlocked: progress.achievements.some((a) => a.id === "first-task"),
    },
    {
      id: "task-10",
      title: "Getting Started",
      description: "Complete 10 tasks",
      icon: "📝",
      points: 100,
      rarity: "rare",
      unlocked: progress.achievements.some((a) => a.id === "task-10"),
    },
    {
      id: "streak-3",
      title: "On Fire",
      description: "3-day streak",
      icon: "🔥",
      points: 75,
      rarity: "epic",
      unlocked: progress.achievements.some((a) => a.id === "streak-3"),
    },
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "7-day streak",
      icon: "⚔️",
      points: 200,
      rarity: "epic",
      unlocked: progress.achievements.some((a) => a.id === "streak-7"),
    },
    {
      id: "task-50",
      title: "Productive",
      description: "Complete 50 tasks",
      icon: "⚡",
      points: 250,
      rarity: "rare",
      unlocked: progress.achievements.some((a) => a.id === "task-50"),
    },
    {
      id: "task-100",
      title: "Centurion",
      description: "Complete 100 tasks",
      icon: "💯",
      points: 500,
      rarity: "legendary",
      unlocked: progress.achievements.some((a) => a.id === "task-100"),
    },
  ]

  const rarityColors = {
    common: "#6b7280",
    rare: "#3b82f6",
    epic: "#8b5cf6",
    legendary: "#f59e0b",
  }

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
    headerTitle: {
      ...typography.h2,
      color: currentTheme.colors.text,
      marginBottom: spacing.sm,
    },
    headerSubtitle: {
      ...typography.body,
      color: currentTheme.colors.textSecondary,
      textAlign: "center",
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.lg,
      ...commonStyles.shadow,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      ...typography.h3,
      color: currentTheme.colors.primary,
      fontWeight: "bold",
    },
    statLabel: {
      ...typography.bodySmall,
      color: currentTheme.colors.textSecondary,
    },
    achievementCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      ...commonStyles.shadow,
    },
    lockedCard: {
      opacity: 0.6,
    },
    achievementIcon: {
      fontSize: 32,
      marginRight: spacing.md,
    },
    achievementContent: {
      flex: 1,
    },
    achievementTitle: {
      ...typography.body,
      fontWeight: "600",
      color: currentTheme.colors.text,
      marginBottom: 2,
    },
    achievementDescription: {
      ...typography.bodySmall,
      color: currentTheme.colors.textSecondary,
      marginBottom: spacing.sm,
    },
    achievementFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rarityBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: 6,
      marginRight: spacing.sm,
    },
    rarityText: {
      ...typography.caption,
      fontWeight: "600",
      textTransform: "uppercase",
    },
    pointsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    pointsText: {
      ...typography.bodySmall,
      color: currentTheme.colors.primary,
      fontWeight: "600",
      marginLeft: 4,
    },
    lockIcon: {
      marginLeft: spacing.sm,
    },
  })

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalPoints = progress.achievements.reduce((sum, achievement) => sum + achievement.points, 0)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏆 Achievements</Text>
          <Text style={styles.headerSubtitle}>Unlock rewards by completing tasks and reaching milestones</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.achievements.length}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{allAchievements.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        {/* Achievements List */}
        {allAchievements.map((achievement) => (
          <TouchableOpacity
            key={achievement.id}
            style={[styles.achievementCard, !achievement.unlocked && styles.lockedCard]}
            activeOpacity={0.7}
          >
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>

            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>

              <View style={styles.achievementFooter}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={[
                      styles.rarityBadge,
                      { backgroundColor: rarityColors[achievement.rarity as keyof typeof rarityColors] + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rarityText,
                        { color: rarityColors[achievement.rarity as keyof typeof rarityColors] },
                      ]}
                    >
                      {achievement.rarity}
                    </Text>
                  </View>

                  <View style={styles.pointsContainer}>
                    <Ionicons name="star" size={12} color={currentTheme.colors.primary} />
                    <Text style={styles.pointsText}>{achievement.points} XP</Text>
                  </View>
                </View>

                {!achievement.unlocked && (
                  <Ionicons
                    name="lock-closed"
                    size={16}
                    color={currentTheme.colors.textSecondary}
                    style={styles.lockIcon}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
