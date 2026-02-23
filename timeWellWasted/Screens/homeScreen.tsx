import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createActivityTask, getTodayActivities } from '../api'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
//  import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
//  import { faTiktok, faYoutube, faInstagram, faFacebook, faSnapchat, faSpotify } from '@fortawesome/free-brands-svg-icons'
// import { faClock } from '@fortawesome/free-regular-svg-icons'
// import { faLaptopCode } from '@fortawesome/free-solid-svg-icons'
// import { faSteam } from '@fortawesome/free-brands-svg-icons/faSteam'
// import { faDev } from '@fortawesome/free-brands-svg-icons/faDev'
// import { faNeos } from '@fortawesome/free-brands-svg-icons/faNeos'
import { AppStackParamList } from '../Navigation/AppNavigator'




    type Props = NativeStackScreenProps<AppStackParamList, 'Home'>
 
const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { setIsLoggedIn } = route.params
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activityName, setActivityName] = useState('')
  const [activityDescription, setActivityDescription] = useState('')
  const [todayActivities, setTodayActivities] = useState<ActivityTask[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
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
 
  const cancelModal = () => {
    setShowModal(false)
    setActivityName('')
    setActivityDescription('')
  }
 
  const opretAktivitet = async () => {
    if (!activityName.trim()) {
      alert('Skriv et navn på aktiviteten')
      return
    }
 
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('auth_token')
     
      if (!token) {
        alert('Ikke logget ind')
        setLoading(false)
        return
      }
 
      const now = new Date()
     
      const created = await createActivityTask(
        activityName,
        activityDescription,
        now.toISOString(),
        now.toISOString(),
        token
      )
 
      // Save latest activityId and info to AsyncStorage for ActivityScreen
      await AsyncStorage.setItem('latest_activity', JSON.stringify({
        activityId: created.activityId,
        activityName,
        activityDescription
      }))
 
      setShowModal(false)
      setActivityName('')
      setActivityDescription('')
      alert('Aktivitet oprettet!')
      navigation.navigate('Activity', {
        activityId: created.activityId,
        activityName,
        activityDescription
      })
      loadTodayActivities()
    } catch (error) {
      console.error('Fejl ved oprettelse af aktivitet:', error)
      alert('Kunne ikke oprette aktivitet')
    } finally {
      setLoading(false)
    }
  }
 
  const viewProfile = () => {
    navigation.navigate('Profile')
  }
 
  const logout = () => {
    setIsLoggedIn(false)
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Opret Aktivitet</Text>
           
            <TextInput
              style={styles.modalInput}
              placeholder="Navn på aktivitet"
              placeholderTextColor="#999"
              value={activityName}
              onChangeText={setActivityName}
            />
 
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Beskrivelse (valgfrit)"
              placeholderTextColor="#999"
              value={activityDescription}
              onChangeText={setActivityDescription}
              multiline
              numberOfLines={3}
            />
 
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={cancelModal}
              >
                <Text style={styles.modalButtonText}>Annuller</Text>
              </TouchableOpacity>
 
              <TouchableOpacity
                style={[styles.modalCreateButton, loading && styles.buttonDisabled]}
                onPress={opretAktivitet}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalButtonText}>Opret</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
 
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Din tid i dag</Text>
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
          <View style={styles.activitiesBox}>
            <ScrollView contentContainerStyle={styles.activitiesScrollContent} showsVerticalScrollIndicator={false}>
              {isLoadingActivities ? (
                <ActivityIndicator color="#4DAFFF" />
              ) : activitiesError ? (
                <Text style={styles.errorText}>{activitiesError}</Text>
              ) : todayActivities.length === 0 ? (
                <Text style={styles.emptyText}>Ingen aktiviteter i dag</Text>
              ) : (
                todayActivities.map((activity, idx) => (
                  <View key={activity.activityId} style={[styles.activityItem, idx === 0 && {marginTop: 8}]}> 
                      <View style={styles.activityIconWrap}>
                        <Text style={styles.activityIcon}>
                          {/* {getActivityIcon(activity.activityName)} */}
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
            </ScrollView>
          </View>
        </View>


      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.tilføjAktivitet, loading && styles.buttonDisabled]}
          onPress={tilføjAktivitet}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>+ Tilføj Aktivitet</Text>
          )}
        </TouchableOpacity>
 
        <Text style={styles.footerText}>
          Vi lover ikke at gøre dig perfekt - bare lidt mere bevidst
        </Text>
      </View>
    </SafeAreaView>
  )
}
 
export default HomeScreen
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
 
// const getActivityIcon = (name?: string | null) => {
//   const value = (name || '').toLowerCase()

//   if (value.includes('tiktok'))
//     return <FontAwesomeIcon icon={faTiktok} size={24} color="#050505" />
//   if (value.includes('youtube') || value.includes('yt'))
//     return <FontAwesomeIcon icon={faYoutube} size={24} color="#FF0000" />
//   if (value.includes('instagram') || value.includes('insta'))
//     return <FontAwesomeIcon icon={faInstagram} size={24} color="#C13584" />
//   if (value.includes('facebook') || value.includes('fb'))
//     return <FontAwesomeIcon icon={faFacebook} size={24} color="#1877F3" />
//   if (value.includes('snap'))
//     return <FontAwesomeIcon icon={faSnapchat} size={24} color="#FFFC00" />
//   if (value.includes('spotify') || value.includes('music'))
//     return <FontAwesomeIcon icon={faSpotify} size={24} color="#1DB954" />
//   if (value.includes('netflix') || value.includes('movie') || value.includes('show'))  
//     return <FontAwesomeIcon icon={faNeos} size={24} color="#E50914" />
//   // Gaming icon
//   if (value.includes('gaming') || value.includes('game'))
//     return <FontAwesomeIcon icon={faSteam} size={24} color="#031647" />
//   // Programming icon
//   if (value.includes('programming') || value.includes('code') || value.includes('coding'))
//     return <FontAwesomeIcon icon={faDev} size={24} color="#000000" />

//   return <FontAwesomeIcon icon={faClock} size={24} color="#4DAFFF" />
// }
 
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
    paddingTop: 16,
    backgroundColor: '#F2F6FA',
  },
    activitiesBox: {
      height: 340,
      width: '92%',
      backgroundColor: '#fff',
      borderRadius: 22,
      borderWidth: 0,
      padding: 14,
      marginBottom: 18,
      alignSelf: 'center',
      shadowColor: '#4DAFFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
      overflow: 'hidden',
    },
    activitiesScrollContent: {
      paddingHorizontal: 0,
      paddingBottom: 16,
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
    backgroundColor: '#EAF4FF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 0,
    marginBottom: 10,
    shadowColor: '#4DAFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
 
  activityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D6EFFF',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#4DAFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
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
 
  tilføjAktivitet: {
    paddingVertical: 17,
    width: '100%',
    backgroundColor: '#4DAFFF',
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#4DAFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 3,
  },
 
  buttonDisabled: {
    opacity: 0.6,
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
 
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    alignItems: 'center',
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
    height: 80,
    textAlignVertical: 'top',
  },
 
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
 
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
 
  modalCreateButton: {
    flex: 1,
    backgroundColor: '#4DAFFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
 
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})