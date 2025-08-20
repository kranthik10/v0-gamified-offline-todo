"use client"

import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useGame } from "../context/GameContext"
import { getAvailableThemes } from "../utils/themes"
import { commonStyles, typography, spacing } from "../utils/styleHelpers"

export function ThemeSelector() {
  const { currentTheme, setTheme, availableThemes } = useTheme()
  const { tasks, progress } = useGame()

  const completedTasks = tasks.filter((task) => task.completed).length
  const availableThemesList = getAvailableThemes(
    progress.level,
    progress.achievements.map((a) => a.id),
    progress.currentStreak,
    completedTasks,
  )

  const styles = StyleSheet.create({
    container: {
      marginVertical: spacing.md,
    },
    title: {
      ...typography.h3,
      color: currentTheme.colors.text,
      marginBottom: spacing.md,
    },
    themeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    themeCard: {
      width: "48%",
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12,
      padding: spacing.md,
      borderWidth: 2,
      borderColor: "transparent",
      ...commonStyles.shadow,
    },
    selectedTheme: {
      borderColor: currentTheme.colors.primary,
    },
    lockedTheme: {
      opacity: 0.5,
    },
    themePreview: {
      width: "100%",
      height: 40,
      borderRadius: 8,
      marginBottom: spacing.sm,
      flexDirection: "row",
    },
    colorStrip: {
      flex: 1,
      height: "100%",
    },
    firstStrip: {
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
    lastStrip: {
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
    },
    themeInfo: {
      alignItems: "center",
    },
    themeName: {
      ...typography.body,
      fontWeight: "600",
      color: currentTheme.colors.text,
      textAlign: "center",
      marginBottom: 4,
    },
    themeDescription: {
      ...typography.caption,
      color: currentTheme.colors.textSecondary,
      textAlign: "center",
    },
    lockIcon: {
      position: "absolute",
      top: spacing.sm,
      right: spacing.sm,
    },
    unlockText: {
      ...typography.caption,
      color: currentTheme.colors.textSecondary,
      textAlign: "center",
      marginTop: 4,
    },
  })

  const isThemeUnlocked = (themeId: string) => {
    return availableThemesList.some((theme) => theme.id === themeId)
  }

  const getUnlockText = (theme: any) => {
    if (!theme.unlockRequirement) return ""

    switch (theme.unlockRequirement.type) {
      case "level":
        return `Level ${theme.unlockRequirement.value}`
      case "streak":
        return `${theme.unlockRequirement.value}-day streak`
      case "tasks":
        return `${theme.unlockRequirement.value} tasks`
      case "achievement":
        return "Special achievement"
      default:
        return ""
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Themes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.themeGrid}>
          {availableThemes.map((theme) => {
            const isUnlocked = isThemeUnlocked(theme.id)
            const isSelected = currentTheme.id === theme.id

            return (
              <TouchableOpacity
                key={theme.id}
                style={[styles.themeCard, isSelected && styles.selectedTheme, !isUnlocked && styles.lockedTheme]}
                onPress={() => isUnlocked && setTheme(theme.id)}
                disabled={!isUnlocked}
              >
                {!isUnlocked && (
                  <View style={styles.lockIcon}>
                    <Ionicons name="lock-closed" size={16} color={currentTheme.colors.textSecondary} />
                  </View>
                )}

                <View style={styles.themePreview}>
                  <View style={[styles.colorStrip, styles.firstStrip, { backgroundColor: theme.colors.primary }]} />
                  <View style={[styles.colorStrip, { backgroundColor: theme.colors.secondary }]} />
                  <View style={[styles.colorStrip, { backgroundColor: theme.colors.accent }]} />
                  <View style={[styles.colorStrip, styles.lastStrip, { backgroundColor: theme.colors.background }]} />
                </View>

                <View style={styles.themeInfo}>
                  <Text style={styles.themeName}>{theme.name}</Text>
                  <Text style={styles.themeDescription} numberOfLines={2}>
                    {theme.description}
                  </Text>
                  {!isUnlocked && <Text style={styles.unlockText}>{getUnlockText(theme)}</Text>}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}
