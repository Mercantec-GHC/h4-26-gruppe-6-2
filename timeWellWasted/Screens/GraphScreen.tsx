import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Background from '../components/Background'

const AppItem = ({
  name,
  time,
  progress,
}: {
  name: string
  time: string
  progress: number
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.appName}>{name}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  )
}

const GraphScreen = () => {
  return (
    <Background>
    <View style={styles.container}>
      <Text style={styles.title}>sidste 7 dage</Text>

      {/* Total Time Box */}
      <View style={styles.totalBox}>
        <Text style={styles.totalTime}>13 t 22 m</Text>
        <Text style={styles.subText}>DAMN!</Text>
      </View>

      {/* App Usage List */}
      <AppItem name="TikTok" time="7t 14m" progress={85} />
      <AppItem name="YouTube" time="4t 14m" progress={55} />
      <AppItem name="Netflix" time="3t 14m" progress={40} />
      <AppItem name="Instagram" time="1t 14m" progress={20} />
    </View>
    </Background>
  )
}

export default GraphScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },

  totalBox: {
    backgroundColor: '#BBD7F0',
    borderRadius: 25,
    paddingVertical: 20,
    marginBottom: 30,
    alignItems: 'center',
  },

  totalTime: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#BBD7F0',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  appName: {
    fontSize: 16,
    fontWeight: '600',
  },

  timeText: {
    fontSize: 14,
    color: '#333',
  },

  progressBackground: {
    height: 8,
    backgroundColor: '#DCEAF8',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#32D74B',
    borderRadius: 10,
  },
})