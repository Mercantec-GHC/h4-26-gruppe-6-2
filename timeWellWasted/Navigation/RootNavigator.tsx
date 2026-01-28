import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginNavigator } from './LoginNavigator'
import HomeScreen from '../Screens/homeScreen'

const Stack = createNativeStackNavigator()

interface RootNavigatorProps {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
}

export const RootNavigator: React.FC<RootNavigatorProps> = ({
  isLoggedIn,
  setIsLoggedIn,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen
            name="LoginStack"
            children={() => <LoginNavigator setIsLoggedIn={setIsLoggedIn} />}
          />
        ) : (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            initialParams={{ setIsLoggedIn }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
