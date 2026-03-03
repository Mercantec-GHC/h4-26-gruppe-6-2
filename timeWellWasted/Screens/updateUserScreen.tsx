// import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React from 'react';
import { useAppTheme } from "../Hooks/ThemeProvider";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserService } from '../services/updateUserService';
import { HomeStackParamList } from '../Navigation/AppNavigator';


const UpdateUserScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { setIsLoggedIn } = route.params as { setIsLoggedIn: (v: boolean) => void };
    const { theme } = useAppTheme();
    const currentColors = colors[theme];

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [passwordHash, setPasswordHash] = useState("");

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem("auth_token");
            if (!token) {
                Alert.alert("Fejl", "Ingen token fundet.");
                return;
            }

            const updatedUser = {
                username: username || undefined,
                email: email || undefined,
                passwordHash: passwordHash || undefined,
            };

            await updateUserService(token, updatedUser);

            Alert.alert("Succes", "Profil opdateret!");
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Fejl", error.message || "Noget gik galt.");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, { backgroundColor: currentColors.buttonBackground }]}>
                <Text style={[styles.text, { color: currentColors.text }]}>← Tilbage</Text>
            </TouchableOpacity>
            <Image
                source={require('../assets/images/LogoTime.png')}
                style={styles.avatar}
            />
            <View style={styles.form}>
                <TextInput placeholder="Nyt brugernavn" placeholderTextColor="#888" value={username} onChangeText={setUsername}
                    style={[styles.input, { backgroundColor: currentColors.card, color: currentColors.text }]} />

                <TextInput placeholder="Ny email" placeholderTextColor="#888" value={email} onChangeText={setEmail}
                    style={[styles.input, { backgroundColor: currentColors.card, color: currentColors.text }]} />

                <TextInput placeholder="Nyt password" placeholderTextColor="#888" secureTextEntry value={passwordHash} onChangeText={setPasswordHash}
                    style={[styles.input, { backgroundColor: currentColors.card, color: currentColors.text }]} />

                <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: currentColors.buttonBackground }]}>
                    <Text style={[styles.text, { color: currentColors.buttonText }]}>Gem ændringer</Text>
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


export default UpdateUserScreen;

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

    input: { 
        padding: 15, 
        borderRadius: 10, 
        fontSize: 16, 
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

    form: {
        width: "80%",
        gap: 15,
        marginTop: 20,
    },

    text: {
        fontSize: 16,
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


























