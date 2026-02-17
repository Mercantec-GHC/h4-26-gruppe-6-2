import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import HomeScreen from '../Screens/homeScreen'
import GraphScreen from '../Screens/GraphScreen'
import ProfileScreen from '../Screens/profileScreen'
import ActivityScreen from '../Screens/activityScreen'

export type AppTabParamList = {
  Home: { setIsLoggedIn: (value: boolean) => void }
  Graph: undefined
  Activity: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<AppTabParamList>()

interface AppNavigatorProps {
  setIsLoggedIn: (value: boolean) => void
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  setIsLoggedIn,
}) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: any

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Graph') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline'
          } else if (route.name === 'Activity') {
            iconName = focused ? 'list' : 'list-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }

          return <Ionicons name={iconName} size={28} color={color} />
        },
        tabBarActiveTintColor: '#4DAFFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ setIsLoggedIn }}
      />

      <Tab.Screen name="Graph" component={GraphScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
