"use client"

import { useEffect, useRef } from "react"
import { View, Animated, StyleSheet } from "react-native"
import { useTheme } from "../context/ThemeContext"

interface LoadingSpinnerProps {
  size?: number
  color?: string
}

export function LoadingSpinner({ size = 40, color }: LoadingSpinnerProps) {
  const { currentTheme } = useTheme()
  const spinValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0)
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => spin())
    }
    spin()
  }, [spinValue])

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 3,
      borderColor: color || currentTheme.colors.primary + "30",
      borderTopColor: color || currentTheme.colors.primary,
    },
  })

  return (
    <Animated.View style={[styles.container, { transform: [{ rotate }] }]}>
      <View />
    </Animated.View>
  )
}
