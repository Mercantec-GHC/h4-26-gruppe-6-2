import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Background from '../components/Background'
import React from 'react'

const ProfileScreen = () => {
  return (
    <Background>
      <View style={styles.container}>

      
      <Image 
        source={require('../assets/images/LogoTime.png')}
        style={styles.avatar}
      />

      
      <Text style={styles.username}>UserName</Text>

      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Notifikationer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Dark / Light mode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Rediger profiloplysninger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Slet profil</Text>
        </TouchableOpacity>
      </View>
      </View>
    </Background>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    // backgroundColor: '#fff',
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },

  username: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
  },

  buttonContainer: {
    width: '80%',
    gap: 15,
  },

  button: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  buttonText: {
    fontSize: 16,
    color: '#333',
  },

  deleteButton: {
    backgroundColor: '#ffdddd',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  deleteButtonText: {
    fontSize: 16,
    color: '#d00',
    fontWeight: '600',
  },
})
