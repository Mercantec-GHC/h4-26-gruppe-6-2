import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AppStackParamList } from '../Navigation/AppNavigator'



type Props = NativeStackScreenProps<AppStackParamList, 'Home'>

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { setIsLoggedIn } = route.params

  const tilføjAktivitet = () => {
    navigation.navigate('Activity')
  }

  const logout = () => {
    setIsLoggedIn(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Din tid i dag</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Log ud</Text>
        </TouchableOpacity>
      </View>

      {/* Middle Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>Time Well Wasted</Text>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.tilføjAktivitet}
          onPress={tilføjAktivitet}
        >
          <Text style={styles.buttonText}>+ Tilføj Aktivitet</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Vi lover ikke at gøre dig perfekt - bare lidt mere bevidst
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },

  logoutText: {
    fontSize: 16,
    color: '#4DAFFF',
    fontWeight: '600',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  subtitle: {
    fontSize: 18,
    color: '#666',
  },

  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },

  tilføjAktivitet: {
    paddingVertical: 15,
    width: '100%',
    backgroundColor: '#4DAFFF',
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  footerText: {
    marginTop: 30,
    fontSize: 16,
    color: '#585858',
    textAlign: 'center',
  },
})
