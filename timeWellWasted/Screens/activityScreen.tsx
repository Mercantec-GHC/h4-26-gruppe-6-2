import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  SafeAreaView,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const getCurrentUserId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_userId')
}

// Remove top-level await and STORAGE_KEY initialization

const ActivityScreen = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Restore timer on app start, only when userId is set
  useEffect(() => {
    const load = async () => {
      const id = await getCurrentUserId()
      console.log('Loaded userId from AsyncStorage:', id)
      if (!id) return
      setUserId(id)
    }
    load()
  }, [])

  // Load timer for userId when it changes
  useEffect(() => {
    if (!userId) return
    const loadTimer = async () => {
      const saved = await AsyncStorage.getItem(`timer_${userId}`)
      if (!saved) return
      const { start, isRunning, elapsed: savedElapsed, isPaused: savedPaused } = JSON.parse(saved)
      if (isRunning) {
        setStartTime(start)
        setIsRunning(true)
        setIsPaused(false)
        setElapsed(Date.now() - start)
      } else if (savedPaused) {
        setStartTime(null)
        setIsRunning(false)
        setIsPaused(true)
        setElapsed(savedElapsed || 0)
      } else {
        setStartTime(null)
        setIsRunning(false)
        setIsPaused(false)
        setElapsed(0)
      }
    }
    loadTimer()
  }, [userId])

  // UI ticking (foreground only)
  useEffect(() => {
    if (!isRunning || !startTime || isPaused) return
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, startTime, isPaused])


  const startTimer = async () => {
    if (!userId) return
    const start = Date.now()
    await AsyncStorage.setItem(
      `timer_${userId}`,
      JSON.stringify({ start, isRunning: true, isPaused: false, elapsed: 0 })
    )
    setStartTime(start)
    setIsRunning(true)
    setIsPaused(false)
    setElapsed(0)
  }

  const pauseTimer = async () => {
    if (!userId || !isRunning || isPaused) return
    await AsyncStorage.setItem(
      `timer_${userId}`,
      JSON.stringify({
        start: null,
        isRunning: false,
        isPaused: true,
        elapsed
      })
    )
    setIsRunning(false)
    setIsPaused(true)
    setStartTime(null)
  }

  const resumeTimer = async () => {
    if (!userId || !isPaused) return
    const start = Date.now() - elapsed
    await AsyncStorage.setItem(
      `timer_${userId}`,
      JSON.stringify({
        start,
        isRunning: true,
        isPaused: false,
        elapsed: 0
      })
    )
    setStartTime(start)
    setIsRunning(true)
    setIsPaused(false)
  }

  const stopTimer = async () => {
    if (!userId) return
    await AsyncStorage.removeItem(`timer_${userId}`)
    setIsRunning(false)
    setIsPaused(false)
    setStartTime(null)
    setElapsed(0)
  }


  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../assets/images/imageTimer.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.timeTextOverlay}>{formatTime(elapsed)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Text style={styles.controlsHeader}>Tiktok</Text>
        <Text style={styles.controlsText}>Alle elsker da lidt brainrot</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonPause}
          onPress={startTimer}
          disabled={isRunning || isPaused}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonPause}
          onPress={isPaused ? resumeTimer : pauseTimer}
          disabled={(!isRunning && !isPaused) || (isRunning && isPaused)}
        >
          <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStop}
          onPress={stopTimer}
          disabled={!isRunning && !isPaused}
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
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
  },

  imageWrapper: {
    width: 350,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: -30,
  },

  image: {
    width: 350,
    height: 350,
  },

  timeTextOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -79 }, { translateY: -36 }],
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  
    paddingHorizontal: 15,
    paddingVertical: -20,
    textAlign: 'center',
  },

  controls: {
    marginTop: 5,
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
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
    marginBottom: 25,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
