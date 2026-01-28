import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { RootNavigator } from './Navigation/RootNavigator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <RootNavigator isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <StatusBar style="auto" />
    </>
  );
}
