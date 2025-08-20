"use client"

import { useState, useEffect, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)

  // Load value from AsyncStorage on mount
  useEffect(() => {
    loadStoredValue()
  }, [key])

  const loadStoredValue = async () => {
    try {
      setLoading(true)
      const item = await AsyncStorage.getItem(key)
      if (item !== null) {
        const parsedValue = JSON.parse(item)
        setStoredValue(parsedValue)
      }
    } catch (error) {
      console.error(`Error reading AsyncStorage key "${key}":`, error)
    } finally {
      setLoading(false)
    }
  }

  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting AsyncStorage key "${key}":`, error)
      }
    },
    [key, storedValue],
  )

  const removeValue = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing AsyncStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return {
    value: storedValue,
    setValue,
    removeValue,
    loading,
  } as const
}
