import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../Screens/homeScreen'
import ActivityScreen from '../Screens/activityScreen'
import ProfileScreen from '../Screens/profileScreen'

export type AppStackParamList = {
  Home: { setIsLoggedIn: (value: boolean) => void }
  Activity: {
    activityId?: number
    activityName?: string
    activityDescription?: string
  }
  Profile: undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>()

interface AppNavigatorProps {
  setIsLoggedIn: (value: boolean) => void
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ setIsLoggedIn }) => {
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
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Stack.Navigator>
  )
}
