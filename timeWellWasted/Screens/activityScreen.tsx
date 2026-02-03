import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  SafeAreaView,
} from 'react-native'

const ActivityScreen = () => {
  function showAlert(arg0: string): void {
    alert(arg0)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Timer / Image at the Top */}
      <View style={styles.timerContainer}>
        <Image
          source={require('../assets/images/imageTimer.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.timeText}>00:00:00</Text>
      </View>

      {/* Middle Controls */}
      <View style={styles.controls}>
        <Text style={styles.controlsHeader}>Tiktok</Text>
        <Text style={styles.controlsText}>Alle elsker da lidt brainrot</Text>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonPause}
          onPress={() => showAlert('Timer Paused')}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStop}
          onPress={() => showAlert('Timer Stopped')}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ActivityScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },

  timerContainer: {
    alignItems: 'center',
    marginTop: 20, // pushes it down slightly from top
  },

  image: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },

  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },

  controls: {
    marginTop: 40,
    alignItems: 'center',
  },

  controlsHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  controlsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 50,
  },

  buttonPause: {
    paddingVertical: 15,
    width: '40%',
    backgroundColor: '#4DAFFF',
    borderRadius: 20,
    alignItems: 'center',
    margin: 5,
  },

  buttonStop: {
    paddingVertical: 15,
    width: '40%',
    backgroundColor: '#FF5D5D',
    borderRadius: 20,
    alignItems: 'center',
    margin: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
