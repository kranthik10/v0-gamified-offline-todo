"use client"

import type React from "react"

import { useState } from "react"
import { RefreshControl, ScrollView } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { useHaptics } from "../hooks/useHaptics"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const { currentTheme } = useTheme()
  const { lightImpact } = useHaptics()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    lightImpact()
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={currentTheme.colors.primary}
          colors={[currentTheme.colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  )
}
