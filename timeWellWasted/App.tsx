import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { RootNavigator } from './navigation/RootNavigator';
import Background from './components/Background';

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
