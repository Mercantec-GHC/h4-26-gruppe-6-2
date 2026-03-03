import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useAppTheme } from "../Hooks/ThemeProvider";
import { HomeStackParamList, BottomTabParamList } from '../Navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation, useRoute } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUserService } from '../services/deleteUserService';
import { Modal } from 'react-native';


const ProfileScreen = () => {
  const route = useRoute();
  const { setIsLoggedIn } = route.params as { setIsLoggedIn: (v: boolean) => void };
  const { theme, toggleTheme } = useAppTheme();
  const currentColors = colors[theme];
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const BottomNavigation = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const [username, setUsername] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        console.log("No token found");
        return;
      }
      const response = await deleteUserService(token);
      await AsyncStorage.removeItem("auth_token");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  useEffect(() => {
    const loadUsername = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return;

      try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded token:", decoded); // DEV PURPOSE, LEAVE OUT OF PRODUCTION
        setUsername(decoded.username);
      } catch (err) {
        console.log("Failed to decode token:", err); // DEV PURPOSE, LEAVE OUT OF PRODUCTION
      }
    };
    loadUsername();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Image
        source={require('../assets/images/LogoTime.png')}
        style={styles.avatar}
      />

      <Text style={[styles.username, { color: currentColors.text }]}>
        {username ?? "Loading..."}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: currentColors.buttonBackground }]}>
          <Text style={styles.buttonText}>Notifikationer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: currentColors.buttonBackground }]}
          onPress={toggleTheme}>
          <Text style={styles.buttonText}>Dark / Light mode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: currentColors.buttonBackground }]}
          onPress={() => BottomNavigation.navigate("HomeTab", { screen: "UpdateUser", params: { setIsLoggedIn } })}>
          <Text style={styles.buttonText}>Rediger profiloplysninger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.deleteButton, { backgroundColor: currentColors.deleteButton }]}
          onPress={() => setShowDeleteModal(true)}>
          <Text style={[styles.deleteButtonText, { color: currentColors.deleteText }]}>Slet profil</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal visible={showDeleteModal} transparent animationType="fade" >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: currentColors.card }]}>
              <Text style={[styles.modalTitle, { color: currentColors.text }]}>Er du sikker?</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, { backgroundColor: currentColors.buttonBackground }]}
                  onPress={() => setShowDeleteModal(false)}>
                  <Text style={styles.buttonText}>Annuller</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.deleteButton, { backgroundColor: currentColors.deleteButton }]}
                  onPress={() => {
                    setShowDeleteModal(false);
                    deleteAccount();
                  }}>
                  <Text style={[styles.deleteButtonText, { color: currentColors.deleteText }]}>Slet profil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export const colors = {
  light: {
    background: "#ffffff",
    text: "#000000",
    card: "#f2f2f2",
    buttonBackground: "#cfcfcf",
    buttonText: "#333333",
    deleteButton: "#e91717",
    deleteText: "#000000",
  },
  dark: {
    background: "#181818",
    text: "#ffffff",
    card: "#222222",
    buttonBackground: "#e4e0e0",
    buttonText: "#ffffff",
    deleteButton: "#e91717",
    deleteText: "#ffffff",
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

  modalContent: {
    borderRadius: 15,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10
  },
});