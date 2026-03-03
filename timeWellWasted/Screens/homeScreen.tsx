import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import Background from '../Components/Background'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { HomeStackParamList } from '../Navigation/AppNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createActivityTask, getTodayActivities } from '../api'
import { useAppTheme } from '../Hooks/ThemeProvider'
import { searchApps, findApp } from '../services/appMatcher'
import { AppItem } from '../Data/apps'

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>

type ActivityTask = {
  activityId: number
  activityName?: string | null
  whenStarted: string
  whenEnded: string
}

const formatDuration = (startIso: string, endIso: string) => {
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()

  if (Number.isNaN(start) || Number.isNaN(end)) return 'Ukendt varighed'

  const totalSeconds = Math.max(0, Math.floor((end - start) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `${hours}t ${minutes}m`
  if (minutes > 0) return `${minutes}m`
  return `${seconds}s`
}

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { setIsLoggedIn } = route.params
  const { theme } = useAppTheme()
  const currentColors = colors[theme]
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activityName, setActivityName] = useState('')
  const [activityDescription, setActivityDescription] = useState('')
  const [suggestions, setSuggestions] = useState<AppItem[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [todayActivities, setTodayActivities] = useState<ActivityTask[]>([])
  const [activitiesError, setActivitiesError] = useState<string | null>(null)

  const loadTodayActivities = async () => {
    setIsLoadingActivities(true)
    setActivitiesError(null)
    try {
      const token = await AsyncStorage.getItem('auth_token')
      if (!token) {
        setActivitiesError('Ikke logget ind')
        setTodayActivities([])
        return
      }

      const items = await getTodayActivities(token)
      setTodayActivities(items)
    } catch (error) {
      console.error('Fejl ved hentning af aktiviteter:', error)
      setActivitiesError('Kunne ikke hente aktiviteter')
    } finally {
      setIsLoadingActivities(false)
    }
  }

  useEffect(() => {
    loadTodayActivities()
  }, [])

  const tilføjAktivitet = () => {
    setShowModal(true)
  }

  const createActivity = async () => {
    const matched = findApp(activityName)
    if (!matched) {
      alert('Vælg en app fra listen')
      return
    }

    const token = await AsyncStorage.getItem('auth_token')
    if (!token) return

    const now = new Date()

    const created = await createActivityTask(
      matched.name,
      activityDescription,
      now.toISOString(),
      now.toISOString(),
      token
    )

    await AsyncStorage.setItem(
      'latest_activity',
      JSON.stringify({
        activityId: created.activityId,
        activityName: matched.name,
        activityDescription,
      })
    )

    setShowModal(false)
    setActivityName('')
    setActivityDescription('')
    setSuggestions([])

    navigation.navigate('Activity', {
      activityId: created.activityId,
      activityName: matched.name,
      activityDescription,
    })

    loadTodayActivities()
  }

  const cancelModal = () => {
    setShowModal(false)
    setActivityName('')
    setActivityDescription('')
    setSuggestions([])
  }

  const opretAktivitet = () => {
    setShowModal(true)
  }

  const logout = () => {
    setIsLoggedIn(false)
    AsyncStorage.removeItem("auth_token");
  }

  return (
    <Background>
      <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: currentColors.text }]}>Din tid i dag</Text>

          <TouchableOpacity onPress={logout}>
            <Text style={[styles.logoutText, { color: '#4DAFFF' }]}>Log ud</Text>
          </TouchableOpacity>
        </View>

        {/* Middle Content */}
        <View style={[styles.container, { backgroundColor: currentColors.listBackground }]}>
          <Text style={[styles.headerText, { color: currentColors.text }]}>Time Well Wasted</Text>

          <View style={styles.listContainer}>
            {isLoadingActivities ? (
              <ActivityIndicator color="#4DAFFF" />
            ) : activitiesError ? (
              <Text style={[styles.profileText, { color: currentColors.error }]}>{activitiesError}</Text>
            ) : todayActivities.length === 0 ? (
              <Text style={[styles.emptyText, { color: currentColors.text }]}>Ingen aktiviteter i dag</Text>
            ) : (
              todayActivities.map((activity) => (
                <View key={activity.activityId} style={[styles.activityItem, { backgroundColor: currentColors.card, borderColor: currentColors.text }]} >
                  <View style={[styles.activityIconWrap, { backgroundColor: currentColors.card, borderColor: currentColors.text }]}>
                    <Text style={[styles.activityIcon, { color: currentColors.text }]}>
                      {getActivityIcon(activity.activityName)}
                    </Text>
                  </View>

                  <View style={styles.activityTextWrap}>
                    <Text style={[styles.profileText, { color: currentColors.text }]}>
                      {activity.activityName || 'Uden navn'}
                    </Text>
                    <Text style={[styles.profileText, { color: currentColors.text }]}>
                      {formatDuration(activity.whenStarted, activity.whenEnded)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Bottom Section */}
        <View style={[styles.bottomContainer, { backgroundColor: currentColors.listBackground }]}>
          <TouchableOpacity style={[styles.tilføjAktivitet, { backgroundColor: '#4DAFFF' }]}
            onPress={tilføjAktivitet} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={[styles.profileText, { color: currentColors.text }]}>+ Tilføj Aktivitet</Text>
            )}
          </TouchableOpacity>

          <Text style={[styles.footerText, { color: currentColors.text }]}>
            Vi lover ikke at gøre dig perfekt - bare lidt mere bevidst
          </Text>

          {/* Modal */}
          <Modal visible={showModal} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: currentColors.card }]}>
                <Text style={[styles.modalTitle, { color: currentColors.text }]}>Vælg App</Text>

                <TextInput
                  style={[styles.modalInput, { color: currentColors.text }]}
                  placeholder="Søg app..."
                  value={activityName}
                  onChangeText={(text) => {
                    setActivityName(text)
                    setSuggestions(searchApps(text))
                  }}
                />

                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        setActivityName(item.name)
                        setSuggestions([])
                      }}
                    >
                      <Image source={item.icon} style={styles.icon} />
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity
                  style={styles.createButton}
                  onPress={createActivity}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.createButton, { backgroundColor: "#e91717" }]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Annuller</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </Background>
  )
}

export default HomeScreen

export const colors = {
  light: {
    background: "#ffffff",
    text: "#000000",
    card: "#f2f2f2",
    subtitle: "#666666",
    listBackground: "#f9f9f9",
    error: "#cc0000",
    activityItem: "#ffffff",
    activityIconWrap: "#e6e6e6",
    activityIcon: "#333333",
    activityName: "#000000",
    activityTime: "#666666",
    bottomContainer: "#ffffff",
    button: "#007AFF",
    buttonText: "#ffffff",
  },
  dark: {
    background: "#181818",
    text: "#ffffff",
    card: "#222222",
    subtitle: "#aaaaaa",
    listBackground: "#181818",
    error: "#ff6666",
    activityItem: "#1a1a1a",
    activityIconWrap: "#333333",
    activityIcon: "#ffffff",
    activityName: "#ffffff",
    activityTime: "#aaaaaa",
    bottomContainer: "#111111",
    button: "#339CFF",
    buttonText: "#ffffff",
  }
};

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
  container: { flex: 1 },

  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderWidth: 2,
    borderColor: '#8DB7DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  activityIcon: {
    fontSize: 20,
  },

  listContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },

  activityTextWrap: {
    flex: 1,
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

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },

  logoutText: {
    fontSize: 16,
    color: "#4DAFFF",
    fontWeight: "600",
  },

  profileText: {
    fontSize: 16,
    fontWeight: "600",
  },


  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },

  addButton: {
    marginHorizontal: 20,
    backgroundColor: '#4DAFFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  footerText: {
    textAlign: 'center',
    color: '#585858',
    fontSize: 14,
    marginVertical: 20,
    paddingHorizontal: 20,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },

  modalCancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  modalCreateButton: {
    flex: 1,
    backgroundColor: "#4DAFFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  modalContent: {
    borderRadius: 15,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },

  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },

  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  icon: { width: 32, height: 32, marginRight: 10 },

  createButton: {
    marginTop: 20,
    backgroundColor: '#4DAFFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
})
