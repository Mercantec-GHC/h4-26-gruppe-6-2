import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { RootNavigator } from './Navigation/RootNavigator';
import { ThemeProvider } from "./Hooks/ThemeProvider";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider>
      <RootNavigator 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
      />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
