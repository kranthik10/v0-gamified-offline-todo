import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

import TasksScreen from "./src/screens/TasksScreen"
import StatsScreen from "./src/screens/StatsScreen"
import AchievementsScreen from "./src/screens/AchievementsScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import { GameProvider } from "./src/context/GameContext"
import { ThemeProvider } from "./src/context/ThemeContext"

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GameProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName: keyof typeof Ionicons.glyphMap

                  if (route.name === "Tasks") {
                    iconName = focused ? "list" : "list-outline"
                  } else if (route.name === "Stats") {
                    iconName = focused ? "bar-chart" : "bar-chart-outline"
                  } else if (route.name === "Achievements") {
                    iconName = focused ? "trophy" : "trophy-outline"
                  } else if (route.name === "Settings") {
                    iconName = focused ? "settings" : "settings-outline"
                  } else {
                    iconName = "help-outline"
                  }

                  return <Ionicons name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: "#be123c",
                tabBarInactiveTintColor: "gray",
                headerStyle: {
                  backgroundColor: "#be123c",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              })}
            >
              <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: "GameDo" }} />
              <Tab.Screen name="Stats" component={StatsScreen} options={{ title: "Statistics" }} />
              <Tab.Screen name="Achievements" component={AchievementsScreen} options={{ title: "Achievements" }} />
              <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
            </Tab.Navigator>
          </NavigationContainer>
        </GameProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
