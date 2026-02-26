import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useAppTheme } from "../Hooks/ThemeProvider";
import { AppStackParamList } from '../Navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { theme, toggleTheme } = useAppTheme();
  const currentColors = colors[theme];
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Image
        source={require('../assets/images/LogoTime.png')}
        style={styles.avatar}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home", { setIsLoggedIn: () => {} })}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>

      <Text style={[styles.username, { color: currentColors.text }]}>Username</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Notifikationer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={toggleTheme}>
          <Text style={styles.buttonText}>Dark / Light mode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Rediger profiloplysninger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Slet profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const colors = {
  light: {
    background: "#ffffff",
    text: "#000000",
    card: "#f2f2f2",
    buttonText: "#333333",
    deleteButton: "#ffdddd",
    deleteText: "#dd0000",
  },
  dark: {
    background: "#000000",
    text: "#ffffff",
    card: "#222222",
    buttonText: "#ffffff",
    deleteButton: "#662222",
    deleteText: "#ff6666",
  }
};


export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },

  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  buttonContainer: {
    width: '80%',
    gap: 15,
  },

  button: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    color: '#333',
  },

  deleteButton: {
    backgroundColor: '#ffdddd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  deleteButtonText: {
    fontSize: 16,
    color: '#dd0000',
    fontWeight: 'bold',
  },
});
