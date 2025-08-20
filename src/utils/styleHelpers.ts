import { StyleSheet } from "react-native"
import type { Theme } from "./themes"

export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  styleFactory: (theme: Theme) => T,
  theme: Theme,
): T {
  return StyleSheet.create(styleFactory(theme))
}

export function getElevationStyle(elevation: number) {
  return {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: elevation / 2,
    },
    shadowOpacity: 0.1 + elevation * 0.02,
    shadowRadius: elevation,
    elevation: elevation,
  }
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const commonStyles = {
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowLarge: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  centerContent: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  row: {
    flexDirection: "row" as const,
  },
  column: {
    flexDirection: "column" as const,
  },
  flex1: {
    flex: 1,
  },
  roundedSmall: {
    borderRadius: 8,
  },
  roundedMedium: {
    borderRadius: 12,
  },
  roundedLarge: {
    borderRadius: 16,
  },
}

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "bold" as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold" as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}
