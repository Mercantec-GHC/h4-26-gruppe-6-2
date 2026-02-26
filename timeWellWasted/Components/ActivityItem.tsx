import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { AppItem } from '../data/apps'

type Props = {
  activityName?: string | null
  whenStarted: string
  whenEnded: string
  app?: AppItem
  formatDuration: (start: string, end: string) => string
}

const ActivityItem: React.FC<Props> = ({ activityName, whenStarted, whenEnded, app, formatDuration }) => {
  return (
    <View style={styles.activityItem}>
      {app && (
        <View style={styles.activityIconWrap}>
          <Image source={app.icon} style={styles.activityIconImage} />
        </View>
      )}
      <View style={styles.activityTextWrap}>
        <Text style={styles.activityName}>{activityName}</Text>
        <Text style={styles.activityTime}>{formatDuration(whenStarted, whenEnded)}</Text>
      </View>
    </View>
  )
}

export default ActivityItem

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CFE7FB',
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
    backgroundColor: '#B6D3ED',
    borderWidth: 2,
    borderColor: '#8DB7DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIconImage: { width: 32, height: 32, resizeMode: 'contain' },
  activityTextWrap: { flex: 1 },
  activityName: { fontSize: 16, fontWeight: '600', color: '#333' },
  activityTime: { marginTop: 4, fontSize: 14, color: '#666' },
})
