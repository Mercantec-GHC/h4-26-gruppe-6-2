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
import { colors } from "../Screens/profileScreen"
import { searchApps, findApp } from '../services/appMatcher'
import { AppItem } from '../Data/apps'
import ActivityItem from '../Components/ActivityItem'

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
  const [todayActivities, setTodayActivities] = useState<ActivityTask[]>([])

  useEffect(() => {
    loadTodayActivities()
  }, [])

  const loadTodayActivities = async () => {
    const token = await AsyncStorage.getItem('auth_token')
    if (!token) return
    const items = await getTodayActivities(token)
    setTodayActivities(items)
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

  const viewProfile = () => {
    navigation.navigate('Profile')
  }

  return (
  <Background>
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: currentColors.card }]}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>Opret Aktivitet</Text>
            
            <TextInput
              style={[styles.modalInput, { color: currentColors.text, borderColor: currentColors.text }]}
              placeholder="Navn på aktivitet"
              placeholderTextColor={currentColors.buttonText}
              value={activityName}
              onChangeText={setActivityName}
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextArea, { color: currentColors.text, borderColor: currentColors.text }]}
              placeholder="Beskrivelse (valgfrit)"
              placeholderTextColor={currentColors.buttonText}
              value={activityDescription}
              onChangeText={setActivityDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalCancelButton, { backgroundColor: currentColors.card }]} 
                onPress={cancelModal} >
                <Text style={[styles.modalButtonText, { color: currentColors.text }]}>Annuller</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalCreateButton, { backgroundColor: currentColors.card }]} 
              onPress={opretAktivitet} disabled={loading} >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={[styles.modalButtonText, { color: currentColors.text }]}>Opret</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: currentColors.text }]}>Din tid i dag</Text>

        <TouchableOpacity onPress={logout}>
          <Text style={[styles.logoutText, { color: '#4DAFFF' }]}>Log ud</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={viewProfile}>
          <Text style={[styles.profileText, { color: '#4DAFFF' }]}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Middle Content */}
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: currentColors.text }]}>Time Well Wasted</Text>

        <View style={styles.listContainer}>
          {isLoadingActivities ? (
            <ActivityIndicator color="#4DAFFF" />
          ) : activitiesError ? (
            <Text style={[styles.errorText, { color: currentColors.deleteText }]}>{activitiesError}</Text>
          ) : todayActivities.length === 0 ? (
            <Text style={[styles.emptyText, { color: currentColors.text }]}>Ingen aktiviteter i dag</Text>
          ) : (
            todayActivities.map((activity) => (
              <View key={activity.activityId} style={[ styles.activityItem, { backgroundColor: currentColors.card, borderColor: currentColors.text } ]} >
                <View style={[styles.activityIconWrap, { backgroundColor: currentColors.card, borderColor: currentColors.text }]}>
                  <Text style={[styles.activityIcon, { color: currentColors.text }]}>
                    {getActivityIcon(activity.activityName)}
                  </Text>
                </View>

                <View style={styles.activityTextWrap}>
                  <Text style={[styles.activityName, { color: currentColors.text }]}>
                    {activity.activityName || 'Uden navn'}
                  </Text>
                  <Text style={[styles.activityTime, { color: currentColors.text }]}>
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
        <TouchableOpacity style={[styles.tilføjAktivitet, { backgroundColor: '#4DAFFF' }]} onPress={tilføjAktivitet} disabled={loading} >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>+ Tilføj Aktivitet</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: currentColors.text }]}>
          Vi lover ikke at gøre dig perfekt - bare lidt mere bevidst
        </Text>

        {/* Modal */}
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Vælg App</Text>

              <TextInput
                style={styles.modalInput}
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
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
    </Background>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
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
  color: "#4DAFFF",
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
