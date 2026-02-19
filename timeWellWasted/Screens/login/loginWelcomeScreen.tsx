import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type LoginStackParamList = {
  Welcome: undefined
  Login: undefined
  CreateUser: undefined
}

type WelcomeScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  'Welcome'
>

const LoginWelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  return (
    <ImageBackground
      source={require('../../assets/images/Backgrund1.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Overlay for readability */}
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/LogoTime.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          Få styr på din tid - og grin lidt undervejs
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('CreateUser')}
        >
          <Text style={styles.secondaryButtonText}>Create User</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>
          Vi lover ikke at gøre dig perfekt - bare lidt mere bevidst
        </Text>
      </View>
    </ImageBackground>
  )
}

export default LoginWelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  logoContainer: {
    marginBottom: 40,
  },

  logo: {
    width: 580,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },

  subtitle: {
    fontSize: 16,
    color: '#f1f1f1',
    textAlign: 'center',
    marginBottom: 50,
  },

  button: {
    backgroundColor: '#FFC14D',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },

  secondaryButton: {
    backgroundColor: '#4DAFFF',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },

  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
})
