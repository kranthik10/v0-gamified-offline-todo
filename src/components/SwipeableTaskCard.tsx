"use client"

import { useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated, PanGestureHandler, State } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Task } from "../types"
import { useTheme } from "../context/ThemeContext"
import { useHaptics } from "../hooks/useHaptics"

interface SwipeableTaskCardProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function SwipeableTaskCard({ task, onToggleComplete, onEdit, onDelete }: SwipeableTaskCardProps) {
  const { currentTheme } = useTheme()
  const { lightImpact, success } = useHaptics()
  const translateX = useRef(new Animated.Value(0)).current
  const lastOffset = useRef(0)

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

  const onGestureEvent = Animated.event([{ nativeEvent: { translationX: translateX } }], {
    useNativeDriver: false,
  })

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent
      lastOffset.current += translationX

      if (translationX > 100) {
        // Swipe right - complete task
        lightImpact()
        onToggleComplete(task.id)
        if (!task.completed) {
          success()
        }
      } else if (translationX < -100) {
        // Swipe left - delete task
        lightImpact()
        onDelete(task.id)
      }

      // Reset position
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
      }).start()
      lastOffset.current = 0
    }
  }

  const styles = StyleSheet.create({
    container: {
      marginVertical: 6,
    },
    swipeContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    leftAction: {
      backgroundColor: currentTheme.colors.success,
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
    },
    rightAction: {
      backgroundColor: currentTheme.colors.error,
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
    actionText: {
      color: "white",
      fontWeight: "600",
      fontSize: 12,
      marginTop: 4,
    },
    card: {
      backgroundColor: task.completed ? currentTheme.colors.surface + "80" : currentTheme.colors.surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      opacity: task.completed ? 0.7 : 1,
      flex: 1,
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
    editButton: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: currentTheme.colors.background,
      marginLeft: 8,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.swipeContainer}>
        {/* Left Action (Complete) */}
        <View style={styles.leftAction}>
          <Ionicons name="checkmark" size={24} color="white" />
          <Text style={styles.actionText}>Complete</Text>
        </View>

        {/* Main Card */}
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
          <Animated.View style={[styles.card, { transform: [{ translateX }] }]}>
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

              <TouchableOpacity style={styles.editButton} onPress={() => onEdit(task)}>
                <Ionicons name="pencil" size={16} color={currentTheme.colors.text} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>

        {/* Right Action (Delete) */}
        <View style={styles.rightAction}>
          <Ionicons name="trash" size={24} color="white" />
          <Text style={styles.actionText}>Delete</Text>
        </View>
      </View>
    </View>
  )
}
