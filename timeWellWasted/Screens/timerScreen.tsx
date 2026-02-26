import { StyleSheet, Text, View } from 'react-native'
import Background from '../components/Background'
import React from 'react'

const timerScreen = () => {
  return (
    <Background>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>timerScreen</Text>
      </View>
    </Background>
  )
}

export default timerScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
})