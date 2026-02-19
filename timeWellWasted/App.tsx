import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { RootNavigator } from './Navigation/RootNavigator';
import Background from './Components/Background';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Background>
      <>
        <RootNavigator isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <StatusBar style="auto" />
      </>
    </Background>
  );
}
