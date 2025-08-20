"use client"

import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useGame } from "../context/GameContext"
import { getAvailableAvatars, AVAILABLE_AVATARS } from "../utils/themes"
import { commonStyles, typography, spacing } from "../utils/styleHelpers"

export function AvatarSelector() {
  const { currentTheme } = useTheme()
  const { progress, updateProgress } = useGame()

  const availableAvatars = getAvailableAvatars(progress.level)

  const styles = StyleSheet.create({
    container: {
      marginVertical: spacing.md,
    },
    title: {
      ...typography.h3,
      color: currentTheme.colors.text,
      marginBottom: spacing.md,
    },
    avatarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    avatarCard: {
      width: 80,
      height: 80,
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "transparent",
      ...commonStyles.shadow,
    },
    selectedAvatar: {
      borderColor: currentTheme.colors.primary,
    },
    lockedAvatar: {
      opacity: 0.5,
    },
    avatarEmoji: {
      fontSize: 32,
    },
    avatarName: {
      ...typography.caption,
      color: currentTheme.colors.text,
      textAlign: "center",
      marginTop: 4,
    },
    lockIcon: {
      position: "absolute",
      top: 4,
      right: 4,
    },
    unlockText: {
      ...typography.caption,
      color: currentTheme.colors.textSecondary,
      textAlign: "center",
      marginTop: 2,
    },
  })

  const isAvatarUnlocked = (avatarId: string) => {
    return availableAvatars.some((avatar) => avatar.id === avatarId)
  }

  const handleAvatarSelect = (avatar: any) => {
    if (isAvatarUnlocked(avatar.id)) {
      updateProgress({ avatar: avatar.emoji })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avatars</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.avatarGrid}>
          {AVAILABLE_AVATARS.map((avatar) => {
            const isUnlocked = isAvatarUnlocked(avatar.id)
            const isSelected = progress.avatar === avatar.emoji

            return (
              <View key={avatar.id} style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={[styles.avatarCard, isSelected && styles.selectedAvatar, !isUnlocked && styles.lockedAvatar]}
                  onPress={() => handleAvatarSelect(avatar)}
                  disabled={!isUnlocked}
                >
                  {!isUnlocked && (
                    <View style={styles.lockIcon}>
                      <Ionicons name="lock-closed" size={12} color={currentTheme.colors.textSecondary} />
                    </View>
                  )}

                  <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                </TouchableOpacity>

                <Text style={styles.avatarName}>{avatar.name}</Text>
                {!isUnlocked && <Text style={styles.unlockText}>Lv. {avatar.unlockLevel}</Text>}
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}
