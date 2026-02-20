import React from 'react'
import { ImageBackground, StyleSheet } from 'react-native'

interface Props {
  children: React.ReactNode
}

const Background: React.FC<Props> = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assets/images/Backgrund1.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  )
}

export default Background

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
})
