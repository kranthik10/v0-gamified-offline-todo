"use client"

import type React from "react"

import { View } from "react-native"
import Svg, { Circle } from "react-native-svg"
import { useTheme } from "../context/ThemeContext"

interface ProgressRingProps {
  progress: number // 0-100
  size: number
  strokeWidth: number
  children?: React.ReactNode
}

export function ProgressRing({ progress, size, strokeWidth, children }: ProgressRingProps) {
  const { currentTheme } = useTheme()

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={currentTheme.colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={currentTheme.colors.primary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {children && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </View>
      )}
    </View>
  )
}
