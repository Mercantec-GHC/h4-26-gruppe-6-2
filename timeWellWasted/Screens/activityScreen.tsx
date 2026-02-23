import React, { useEffect, useState, useRef } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  SafeAreaView,
  Modal,
  Animated
} from 'react-native'
// Helper: degrees per second for a full rotation (60 seconds)
const SECOND_HAND_DEGREES = 360 / 60;
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { updateActivityTask } from '../api'
import { AppStackParamList } from '../Navigation/AppNavigator'

const getCurrentUserId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_userId')
}

// Remove top-level await and STORAGE_KEY initialization

type ActivityScreenRouteParams = {
  activityId?: number
  activityName?: string
  activityDescription?: string
}

type Props = NativeStackScreenProps<AppStackParamList, 'Activity'>

// Quotes grouped by elapsed time (seconds)
const QUOTES = [
  // 0-2 min
  [
    "A little break never hurt anyone!",
    "Enjoy your time, but don’t forget your goals!",
    "Time is precious—use it wisely!",
    "You’re just getting started…"
  ],
  // 2-5 min
  [
    "Still wasting time? Maybe it’s time to get moving!",
    "Remember, you can’t get this time back.",
    "The clock is ticking…",
    "How much longer will you let this go on?"
  ],
  // 5-10 min
  [
    "You could have done something productive by now!",
    "Tick tock… your time is slipping away.",
    "Is this really worth it?",
    "You’re getting really good at wasting time!"
  ],
  // 10+ min
  [
    "Stop! You’re a professional time waster now.",
    "You could have learned a new skill by now!",
    "This is getting out of hand…",
    "You’re setting a new record for wasted time!"
  ]
];

function getQuoteByElapsed(seconds: number, prevQuote: string): string {
  let idx = 0;
  if (seconds >= 600) idx = 3;
  else if (seconds >= 300) idx = 2;
  else if (seconds >= 120) idx = 1;
  // Pick a random quote from the group, but not the same as previous
  const group = QUOTES[idx];
  let quote = group[Math.floor(Math.random() * group.length)];
  while (quote === prevQuote && group.length > 1) {
    quote = group[Math.floor(Math.random() * group.length)];
  }
  return quote;
}

const ActivityScreen: React.FC<Props> = ({ navigation, route }) => {
  const [userId, setUserId] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [activityId, setActivityId] = useState<number | null>(route.params?.activityId ?? null)
  const [activityName, setActivityName] = useState<string>(route.params?.activityName || "")
  const [activityDescription, setActivityDescription] = useState<string>(route.params?.activityDescription || "")
  const [showModal, setShowModal] = useState(false)
  const [quote, setQuote] = useState("");
  const [lastQuoteUpdate, setLastQuoteUpdate] = useState(Date.now());

  // Update quote on mount and as time passes
  useEffect(() => {
    setQuote(getQuoteByElapsed(Math.floor(elapsed / 1000), quote));
    setLastQuoteUpdate(Date.now());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Change quote every 30 seconds or when time group changes
    const seconds = Math.floor(elapsed / 1000);
    let groupIdx = 0;
    if (seconds >= 600) groupIdx = 3;
    else if (seconds >= 300) groupIdx = 2;
    else if (seconds >= 120) groupIdx = 1;
    // Change quote if group changes or 30s passed
    if (
      Date.now() - lastQuoteUpdate > 30000 ||
      (quote && !QUOTES[groupIdx].includes(quote))
    ) {
      setQuote(getQuoteByElapsed(seconds, quote));
      setLastQuoteUpdate(Date.now());
    }
    // eslint-disable-next-line
  }, [elapsed]);

  // Animation for clock hand
  const secondHandAnim = useRef(new Animated.Value(0)).current;

  // Animate the hand every second
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        // Animate to the new angle
        Animated.timing(secondHandAnim, {
          toValue: ((Math.floor((elapsed + 1000) / 1000)) % 60),
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, elapsed]);

  // Sync hand immediately on elapsed change
  useEffect(() => {
    secondHandAnim.setValue((Math.floor(elapsed / 1000)) % 60);
  }, [elapsed]);

  // If no params, try to get latest activity from AsyncStorage ('latest_activity')
  useEffect(() => {
    if (activityName && activityDescription && activityId) return;
    const loadLatest = async () => {
      try {
        const latestJson = await AsyncStorage.getItem('latest_activity');
        if (latestJson) {
          const latest = JSON.parse(latestJson);
          setActivityName(latest.activityName || "");
          setActivityDescription(latest.activityDescription || "");
          if (latest.activityId) setActivityId(latest.activityId);
        }
      } catch {}
    };
    loadLatest();
  }, []);

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
    if (!userId) return;
    setIsRunning(false);
    setIsPaused(true);
    setStartTime(null);
    setShowModal(true);
        // Do NOT reset elapsed, just stop counting

    // Update activity in DB if possible
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token && activityId && activityName) {
        const whenStarted = startTime ? new Date(startTime).toISOString() : new Date(Date.now() - elapsed).toISOString();
        const whenEnded = new Date(startTime ? startTime + elapsed : Date.now()).toISOString();
        await updateActivityTask(
          activityId,
          {
            activityId,
            activityName,
            description: activityDescription,
            whenStarted,
            whenEnded,
          },
          token
        );
      }
    } catch (e) {
      // Optionally show error
    }
    await AsyncStorage.removeItem(`timer_${userId}`);
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

    // Remove ActivityName and ActivityDescription components


  return ( 
    <SafeAreaView style={styles.container}>

      <View style={styles.timerContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../assets/images/imageTimer.png')}
            style={styles.image}
            resizeMode="contain"
          />
          {/* Animated clock hand */}
          {/*
            To rotate around the base (center of the clock),
            1. Move the hand so its base is at the center of the clock (translate to center)
            2. Rotate
            3. Move the hand back so the base stays at the center
          */}
          <Animated.View
            style={[
              styles.clockHand,
              {
                left: '50%',
                top: '23%',
                transform: [
                  { translateX: -8/ 2 }, // center hand horizontally (hand width = 8)
                { translateY: -16 / 2080}, // center circle vertically (circle height = 16)
                  {
                    rotate: secondHandAnim.interpolate({
                      inputRange: [0, 60],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.handBody} />
            <View style={styles.handBodyInvisible} />
           

 
          </Animated.View>
          <Text style={styles.timeTextOverlay}>{formatTime(elapsed)}</Text>
          
        </View>
      </View>

      <View style={styles.controls}>
       <Text style={styles.controlsText}>Aktivitet:</Text>
        <Text style={styles.controlsHeader}>{activityName || "Ingen aktivitet valgt"}</Text>
       
        <Text style={styles.controlsHeader}>{activityDescription || "Ingen beskrivelse"}</Text>
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

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Activity stopped</Text>
           <TouchableOpacity onPress={() => { setShowModal(false); navigation.navigate('Home'); }} style={{ padding: 10, backgroundColor: '#4DAFFF', borderRadius: 5, marginBottom: 10 }}>
              <Text style={{ color: 'white' }}>Go to Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowModal(false)} style={{ padding: 10, backgroundColor: '#4DAFFF', borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>

            </View>
        </View>

      </Modal>
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
    motivationQuote: {
            marginTop: 30,
            fontSize: 18,
            color: '#FFA500',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadowColor: '#fff8dc',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
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
      transform: [{ translateX: -79 }, { translateY: -36 }], // center text vertically
      fontSize: 32,
      fontWeight: 'bold',
      color: '#333',
      paddingHorizontal: 15,
      paddingVertical: -20,
      textAlign: 'center',
      zIndex: 2,
      elevation: 2,
    },
    clockHand: {
      position: 'absolute',
      width: 8,
      height: 170,
      justifyContent: 'flex-start',
      alignItems: 'center',
      zIndex: 1,
      elevation: 1,
    },
    handCircle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#FFD700', // gold
      position: 'absolute',
      top: 0,
      left: -4,
      borderWidth: 2,
      borderColor: '#fff8dc', // off-white border for a softer look
      shadowColor: '#FFA500', // orange shadow for glow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.7,
      shadowRadius: 6,
      elevation: 6,
      zIndex: 2,
    },
    handBody: {
      width: 4,
      height: 88,
      backgroundColor: '#FFD700', // gold
      borderRadius: 2,
      marginTop: 4, // start just below the circle
      borderWidth: 1.5,
      borderColor: '#b8860b', // dark gold border
      shadowColor: '#b8860b',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 4,
    },
    handBodyInvisible: {
      width: 4,
      height: 88,
      backgroundColor: 'transparent',
      marginTop: 0,
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