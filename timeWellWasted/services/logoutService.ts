import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async () => {
  try {
    // Fjern alle login-relaterede data
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_userId');
    await AsyncStorage.removeItem('latest_activity');

    console.log('Bruger logget ud');
  } catch (error) {
    console.error('Fejl under logout', error);
  }
};
