import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginWelcomeScreen from '../Screens/login/loginWelcomeScreen'
import LoginScreen from '../Screens/login/loginScreen'
import CreateUserScreen from '../Screens/login/createUserScreen'

export type LoginStackParamList = {
  Welcome: undefined
  Login: { setIsLoggedIn: (value: boolean) => void }
  CreateUser: { setIsLoggedIn: (value: boolean) => void }
}

const Stack = createNativeStackNavigator<LoginStackParamList>()

interface LoginNavigatorProps {
  setIsLoggedIn: (value: boolean) => void
}

export const LoginNavigator: React.FC<LoginNavigatorProps> = ({ setIsLoggedIn }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Welcome"
        component={LoginWelcomeScreen}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        initialParams={{ setIsLoggedIn }}
      />
      <Stack.Screen
        name="CreateUser"
        component={CreateUserScreen}
        initialParams={{ setIsLoggedIn }}
      />
    </Stack.Navigator>
  )
}
