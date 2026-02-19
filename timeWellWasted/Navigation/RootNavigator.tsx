import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { LoginNavigator } from './LoginNavigator'
import { AppNavigator } from './AppNavigator'

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
      {isLoggedIn ? (
        <AppNavigator setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <LoginNavigator setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  )
}
