import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from 'react-native'

const GraphScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/images/Backgrund1.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        
        {/* Title */}
        <Text style={styles.title}>sidste 7 dage</Text>

        {/* Total Time Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTime}>13 t 22 m</Text>
          <Text style={styles.totalSub}>DAMN!</Text>
        </View>

        {/* App List */}
        <View style={styles.listContainer}>
          <AppRow name="TikTok" time="7t 14m" progress={80} />
          <AppRow name="YouTube" time="4t 14m" progress={60} />
          <AppRow name="Netflix" time="3t 14m" progress={45} />
          <AppRow name="Instagram" time="1t 14m" progress={25} />
        </View>

      </View>
    </ImageBackground>
  )
}

export default GraphScreen

/* ---------------- COMPONENT ---------------- */

const AppRow = ({
  name,
  time,
  progress,
}: {
  name: string
  time: string
  progress: number
}) => {
  return (
    <View style={styles.appCard}>
      <View style={styles.appHeader}>
        <Text style={styles.appName}>{name}</Text>
        <Text style={styles.appTime}>{time}</Text>
      </View>

      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  totalBox: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  totalTime: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  totalSub: {
    fontSize: 14,
    marginTop: 5,
  },
  listContainer: {
    width: '90%',
  },
  appCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
  },
  appTime: {
    fontSize: 14,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: '#4CD964',
  },
})
