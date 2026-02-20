import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  FlatList,
} from 'react-native'
import Background from '../Components/Background'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { HomeStackParamList } from '../Navigation/AppNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createActivityTask, getTodayActivities } from '../api'
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
 
  return (
    <Background>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Text style={styles.headerText}>Din tid i dag</Text>

        {/* Scrollable Activities List */}
        <FlatList
          data={todayActivities}
          keyExtractor={(item) => item.activityId.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const app = findApp(item.activityName || '')
            return (
              <ActivityItem
                activityName={item.activityName}
                whenStarted={item.whenStarted}
                whenEnded={item.whenEnded}
                app={app ?? undefined} // convert null -> undefined
                formatDuration={formatDuration}
                />
            )
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Ingen aktiviteter i dag</Text>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Add Activity Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.addButtonText}>+ Tilføj Aktivitet</Text>
        </TouchableOpacity>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Vi lover ikke at gøre dig perfekt - bare lidt mere bevidst.
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
    shadowColor: '#4DAFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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