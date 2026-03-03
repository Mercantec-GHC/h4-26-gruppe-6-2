import { register } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../api';

export const registerService = async (
  email: string,
  name: string,
  password: string,
  confirmPassword: string,
  setIsLoggedIn: (loggedIn: boolean) => void,
  setLoading: (loading: boolean) => void,
  alert: (msg: string) => void
) => {
  // Validation
  if (!email || !password || !confirmPassword || !name) {
    alert('Udfyld alle felter');
    return;
  }
  if (password !== confirmPassword) {
    alert('Adgangskoderne stemmer ikke overens');
    return;
  }
  setLoading(true);
  try {
    await register({
      email: email,
      username: name,
      password: password,
    });
    alert('Konto oprettet!');
    const data = await login(email, password);
    if (data && data.token) {
      console.log("TOKEN RECEIVED:", data.token); // DEV PURPOSE, LEAVE OUT OF PRODUCTION
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('auth_userId', String(data.user?.id));
      setIsLoggedIn(true);
    }
  } catch (error) {
    alert('Kunne ikke oprette konto. Kontroller din forbindelse og prøv igen.');
  } finally {
    setLoading(false);
  }
};
