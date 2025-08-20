"use client"

import { useState, useEffect, useRef } from "react"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>("")
  const [notification, setNotification] = useState<Notifications.Notification | null>(null)
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token)
    })

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response)
    })

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  const scheduleTaskReminder = async (taskTitle: string, minutes = 60) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Reminder 📝",
        body: `Don't forget: ${taskTitle}`,
        data: { type: "task_reminder" },
      },
      trigger: { seconds: minutes * 60 },
    })
  }

  const scheduleStreakReminder = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Keep Your Streak! 🔥",
        body: "Complete a task today to maintain your streak!",
        data: { type: "streak_reminder" },
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      },
    })
  }

  const sendAchievementNotification = async (achievementTitle: string, points: number) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Achievement Unlocked! 🏆",
        body: `${achievementTitle} - ${points} XP earned!`,
        data: { type: "achievement" },
      },
      trigger: null,
    })
  }

  const sendLevelUpNotification = async (newLevel: number) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Level Up! 🚀",
        body: `Congratulations! You've reached level ${newLevel}!`,
        data: { type: "level_up" },
      },
      trigger: null,
    })
  }

  return {
    expoPushToken,
    notification,
    scheduleTaskReminder,
    scheduleStreakReminder,
    sendAchievementNotification,
    sendLevelUpNotification,
  }
}

async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!")
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
  } else {
    alert("Must use physical device for Push Notifications")
  }

  return token
}
