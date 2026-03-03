import { login } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginService = async (email: string, password: string, setIsLoggedIn: (loggedIn: boolean) => void, setError: (error: string) => void) => {
  try {
    const data = await login(email, password);
    if (data && data.token) {
      console.log("TOKEN RECEIVED:", data.token); // DEV PURPOSE, LEAVE OUT OF PRODUCTION
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('auth_userId', String(data.user?.id));
      setIsLoggedIn(true);
    } else {
      setError('Login failed. No token received.');
    }
  } catch (error) {
    setError('Login failed. Check your credentials.');
  }
};