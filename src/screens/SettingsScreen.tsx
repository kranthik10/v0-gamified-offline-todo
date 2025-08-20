"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useGame } from "../context/GameContext"
import { useTheme } from "../context/ThemeContext"
import { ThemeSelector } from "../components/ThemeSelector"
import { AvatarSelector } from "../components/AvatarSelector"
import { commonStyles, typography, spacing } from "../utils/styleHelpers"

export default function SettingsScreen() {
  const { progress, exportData, importData, clearAllData } = useGame()
  const { currentTheme } = useTheme()

  const handleExportData = async () => {
    try {
      await exportData()
      Alert.alert("Success", "Your data has been exported successfully!")
    } catch (error) {
      Alert.alert("Error", "Failed to export data. Please try again.")
    }
  }

  const handleImportData = async () => {
    Alert.alert("Import Data", "This will replace all your current data. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Import",
        style: "destructive",
        onPress: async () => {
          try {
            await importData()
            Alert.alert("Success", "Your data has been imported successfully!")
          } catch (error) {
            Alert.alert("Error", "Failed to import data. Please check the file and try again.")
          }
        },
      },
    ])
  }

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your tasks, progress, and achievements. This cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData()
              Alert.alert("Success", "All data has been cleared.")
            } catch (error) {
              Alert.alert("Error", "Failed to clear data. Please try again.")
            }
          },
        },
      ],
    )
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
    profileCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16,
      padding: spacing.lg,
      alignItems: "center",
      marginBottom: spacing.lg,
      ...commonStyles.shadow,
    },
    avatar: {
      fontSize: 48,
      marginBottom: spacing.sm,
    },
    levelText: {
      ...typography.h3,
      color: currentTheme.colors.primary,
      fontWeight: "bold",
    },
    xpText: {
      ...typography.body,
      color: currentTheme.colors.textSecondary,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h3,
      color: currentTheme.colors.text,
      marginBottom: spacing.md,
    },
    actionCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12,
      marginBottom: spacing.sm,
      ...commonStyles.shadow,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
    },
    actionIcon: {
      marginRight: spacing.md,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      ...typography.body,
      fontWeight: "600",
      color: currentTheme.colors.text,
      marginBottom: 2,
    },
    actionDescription: {
      ...typography.bodySmall,
      color: currentTheme.colors.textSecondary,
    },
    dangerButton: {
      backgroundColor: currentTheme.colors.error + "10",
    },
    dangerText: {
      color: currentTheme.colors.error,
    },
  })

  const ActionButton = ({ icon, title, description, onPress, danger = false }: any) => (
    <View style={[styles.actionCard, danger && styles.dangerButton]}>
      <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <Ionicons
          name={icon}
          size={24}
          color={danger ? currentTheme.colors.error : currentTheme.colors.primary}
          style={styles.actionIcon}
        />
        <View style={styles.actionContent}>
          <Text style={[styles.actionTitle, danger && styles.dangerText]}>{title}</Text>
          <Text style={styles.actionDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={currentTheme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⚙️ Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.avatar}>{progress.avatar}</Text>
          <Text style={styles.levelText}>Level {progress.level}</Text>
          <Text style={styles.xpText}>{progress.totalXP} XP</Text>
        </View>

        {/* Customization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customization</Text>
          <ThemeSelector />
          <AvatarSelector />
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <ActionButton
            icon="download"
            title="Export Data"
            description="Download your tasks and progress as a backup file"
            onPress={handleExportData}
          />

          <ActionButton
            icon="cloud-upload"
            title="Import Data"
            description="Restore your data from a backup file"
            onPress={handleImportData}
          />

          <ActionButton
            icon="trash"
            title="Clear All Data"
            description="Permanently delete all tasks and progress"
            onPress={handleClearData}
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
