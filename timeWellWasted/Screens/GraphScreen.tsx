import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AppStackParamList } from '../Navigation/AppNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLast7DaysActivities } from '../api'
import { useEffect, useState } from 'react'



type Props = NativeStackScreenProps<AppStackParamList, 'Graph'>

const GraphScreen: React.FC<Props> = ({ navigation, route }) => {
  const { setIsLoggedIn } = route.params
  const [last7DaysActivities, setLast7DaysActivities] = useState<ActivityTask[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [activitiesError, setActivitiesError] = useState<string | null>(null)

  const loadLast7DaysActivities = async () => {
    setIsLoadingActivities(true)
    setActivitiesError(null)
    try {
      const token = await AsyncStorage.getItem('auth_token')
      if (!token) {
        setActivitiesError('Ikke logget ind')
        setLast7DaysActivities([])
        return
      }

      const items = await getLast7DaysActivities(token)
      setLast7DaysActivities(items)
    } catch (error) {
      console.error('Fejl ved hentning af aktiviteter:', error)
      setActivitiesError('Kunne ikke hente aktiviteter')
    } finally {
      setIsLoadingActivities(false)
    }
  }

  useEffect(() => {
    loadLast7DaysActivities()
  }, [])

  const viewProfile = () => {
    navigation.navigate('Profile')
  }

  const logout = () => {
    setIsLoggedIn(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Sidste 7 dage</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Log ud</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={viewProfile}>
          <Text style={styles.profileText}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Middle Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>Time Well Wasted</Text>
        <View style={styles.listContainer}>
          {isLoadingActivities ? (
            <ActivityIndicator color="#4DAFFF" />
          ) : activitiesError ? (
            <Text style={styles.errorText}>{activitiesError}</Text>
          ) : last7DaysActivities.length === 0 ? (
            <Text style={styles.emptyText}>Ingen aktiviteter de sidste 7 dage</Text>
          ) : (
            last7DaysActivities.map((activity) => (
              <View key={activity.activityId} style={styles.activityItem}>
                <View style={styles.activityIconWrap}>
                  <Text style={styles.activityIcon}>
                    {getActivityIcon(activity.activityName)}
                  </Text>
                </View>
                <View style={styles.activityTextWrap}>
                  <Text style={styles.activityName}>{activity.activityName || 'Uden navn'}</Text>
                  <Text style={styles.activityTime}>
                    {formatDuration(activity.whenStarted, activity.whenEnded)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <Text style={styles.footerText}>
          Vi lover ikke at gøre dig perfekt - bare lidt mere bevidst
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default GraphScreen
type ActivityTask = {
  activityId: number
  activityName?: string | null
  whenStarted: string
  whenEnded: string
}

const formatDuration = (startIso: string, endIso: string) => {
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return 'Ukendt varighed'
  }

  const totalSeconds = Math.max(0, Math.floor((end - start) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}t ${minutes}m`
  }

  if (minutes > 0) {
    return `${minutes}m`
  }

  return `${seconds}s`
}

const getActivityIcon = (name?: string | null) => {
  const value = (name || '').toLowerCase()

  if (value.includes('tiktok')) return '🎵'
  if (value.includes('youtube') || value.includes('yt')) return '📺'
  if (value.includes('instagram') || value.includes('insta')) return '📸'
  if (value.includes('facebook') || value.includes('fb')) return '👍'
  if (value.includes('snap')) return '👻'
  if (value.includes('netflix')) return '🍿'
  if (value.includes('spotify') || value.includes('music')) return '🎧'

  return '🕒'
}

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

  profileText: {
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
    marginBottom: 16,
  },

  listContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CFE7FB',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#8DB7DD',
    marginBottom: 10,
  },

  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B6D3ED',
    borderWidth: 2,
    borderColor: '#8DB7DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  activityIcon: {
    fontSize: 20,
  },

  activityTextWrap: {
    flex: 1,
  },

  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  activityTime: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },

  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  errorText: {
    fontSize: 14,
    color: '#D64545',
    textAlign: 'center',
  },

  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },

  footerText: {
    marginTop: 30,
    fontSize: 16,
    color: '#585858',
    textAlign: 'center',
  },
})
