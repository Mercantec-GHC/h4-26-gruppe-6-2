import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import HomeScreen from '../Screens/homeScreen'
import ActivityScreen from '../Screens/activityScreen'
import GraphScreen from '../Screens/GraphScreen'
import ProfileScreen from '../Screens/profileScreen'

/**
 * Stack Types
 */
export type HomeStackParamList = {
  Home: { setIsLoggedIn: (value: boolean) => void }
  Activity: {
    activityId?: number
    activityName?: string
    activityDescription?: string
  }
}

/**
 * Bottom Tabs Types
 */
export type BottomTabParamList = {
  HomeTab: undefined
  Graph: undefined
  Profile: undefined
}

const Stack = createNativeStackNavigator<HomeStackParamList>()
const Tab = createBottomTabNavigator<BottomTabParamList>()

interface AppNavigatorProps {
  setIsLoggedIn: (value: boolean) => void
}

/**
 * Home Stack (Home → Activity)
 */
const HomeStack: React.FC<{ setIsLoggedIn: (value: boolean) => void }> = ({
  setIsLoggedIn,
}) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ setIsLoggedIn }}
      />
      <Stack.Screen
        name="Activity"
        component={ActivityScreen}
      />
    </Stack.Navigator>
  )
}

/**
 * Icon Mapping
 */
const tabIcons = {
  HomeTab: {
    active: 'home',
    inactive: 'home-outline',
  },
  Graph: {
    active: 'bar-chart',
    inactive: 'bar-chart-outline',
  },
  Profile: {
    active: 'person',
    inactive: 'person-outline',
  },
} as const

/**
 * Main App Navigator
 */
export const AppNavigator: React.FC<AppNavigatorProps> = ({
  setIsLoggedIn,
}) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          const icons = tabIcons[route.name]

          return (
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={size}
              color={color}
            />
          )
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        options={{ title: 'Home' }}
      >
        {() => <HomeStack setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>

      <Tab.Screen
        name="Graph"
        component={GraphScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  )
}
