import { StyleSheet, Text, View } from 'react-native'
import Background from '../Components/Background'
import React from 'react'

const GraphScreen = () => {
  return (
    <Background>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>GraphScreen</Text>
      </View>
    </Background>
  )
}

export default GraphScreen

const styles = StyleSheet.create({})