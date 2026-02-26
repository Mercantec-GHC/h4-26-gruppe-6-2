import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  SafeAreaView,
} from 'react-native'
import Background from '../components/Background'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import {
  getCurrentUserId,
  loadLatestActivity,
  loadTimer,
  saveTimer,
  removeTimer,
  updateActivity
} from '../services/activityService'

type ActivityScreenRouteParams = {
  activityId?: number
  activityName?: string
  activityDescription?: string
}

const ActivityScreen = () => {
  const navigation = useNavigation()
  const [userId, setUserId] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const route = useRoute<RouteProp<{ params: ActivityScreenRouteParams }, 'params'>>()
  const [activityId, setActivityId] = useState<number | null>(route.params?.activityId ?? null)
  const [activityName, setActivityName] = useState<string>(route.params?.activityName || "")
  const [activityDescription, setActivityDescription] = useState<string>(route.params?.activityDescription || "")

  // Load latest activity if no params
  useEffect(() => {
    if (activityName && activityDescription && activityId) return
    const loadLatest = async () => {
      const latest = await loadLatestActivity()
      if (latest) {
        setActivityName(latest.activityName || "")
        setActivityDescription(latest.activityDescription || "")
        if (latest.activityId) setActivityId(latest.activityId)
      }
    }
    loadLatest()
  }, [])

  // Load user ID
  useEffect(() => {
    const load = async () => {
      const id = await getCurrentUserId()
      if (!id) return
      setUserId(id)
    }
    load()
  }, [])

  // Load timer for user
  useEffect(() => {
    if (!userId) return
    const loadTimerState = async () => {
      const saved = await loadTimer(userId)
      if (!saved) return
      const { start, isRunning, elapsed: savedElapsed, isPaused: savedPaused } = saved
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
    loadTimerState()
  }, [userId])

  // Timer tick
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
    await saveTimer(userId, { start, isRunning: true, isPaused: false, elapsed: 0 })
    setStartTime(start)
    setIsRunning(true)
    setIsPaused(false)
    setElapsed(0)
  }

  const pauseTimer = async () => {
    if (!userId || !isRunning || isPaused) return
    await saveTimer(userId, {
      start: null,
      isRunning: false,
      isPaused: true,
      elapsed
    })
    setIsRunning(false)
    setIsPaused(true)
    setStartTime(null)
  }

  const resumeTimer = async () => {
    if (!userId || !isPaused) return
    const start = Date.now() - elapsed
    await saveTimer(userId, {
      start,
      isRunning: true,
      isPaused: false,
      elapsed: 0
    })
    setStartTime(start)
    setIsRunning(true)
    setIsPaused(false)
  }

  const stopTimer = async () => {
    if (!userId) return
    try {
      if (activityId && activityName) {
        await updateActivity(activityId, activityName, activityDescription, startTime, elapsed)
      }
    } catch (e) {
      console.error('Failed to update activity:', e)
    }

    await removeTimer(userId)
    setIsRunning(false)
    setIsPaused(false)
    setStartTime(null)
    setElapsed(0)

    navigation.goBack()
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
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.timerContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('../assets/images/imageTimer.png')}
              style={styles.image}
              resizeMode="contain"
            />
            {/* Centered text using flexbox */}
            <View style={styles.timeOverlayWrapper}>
              <Text style={styles.timeTextOverlay}>{formatTime(elapsed)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.controls}>
          <Text style={styles.controlsHeader}>Activity name</Text>
          <Text style={styles.controlsText}>{activityName || "Ingen aktivitet valgt"}</Text>
          <Text style={styles.controlsHeader}>Description</Text>
          <Text style={styles.controlsText}>{activityDescription || "Ingen beskrivelse"}</Text>
        </View>

        <View style={styles.buttonContainer}>
          {!isRunning && !isPaused && (
            <TouchableOpacity
              style={styles.buttonStart}
              onPress={startTimer}
              testID="StartActivityButton"
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}

          {(isRunning || isPaused) && (
            <TouchableOpacity
              style={styles.buttonPause}
              onPress={isPaused ? resumeTimer : pauseTimer}
            >
              <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
            </TouchableOpacity>
          )}

          {(isRunning || isPaused) && (
            <TouchableOpacity
              style={styles.buttonStop}
              onPress={stopTimer}
              testID="StopActivityButton"
            >
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Background>
  )
}

export default ActivityScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  timerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageWrapper: {
    width: 350,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: -30,
  },
  image: { width: 350, height: 350 },
  
  timeOverlayWrapper: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  transform: [{ translateY: -13 }], 
},
  timeTextOverlay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  controls: { marginTop: 5, alignItems: 'center' },
  controlsHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  controlsText: { fontSize: 16, color: '#666', textAlign: 'center' },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonStart: {
    paddingVertical: 15,
    width: '40%',
    backgroundColor: '#4DAFFF',
    borderRadius: 20,
    alignItems: 'center',
    margin: 5,
  },
  buttonPause: {
    paddingVertical: 15,
    width: '40%',
    backgroundColor: '#FFA500',
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
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
})