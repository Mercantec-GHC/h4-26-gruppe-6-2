import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import Background from '../components/Background';
import { getWeeklyUsage, WeeklyAppUsage } from '../services/graphService';
import { APPS } from '../data/apps';
import { useFocusEffect } from '@react-navigation/native';

const formatTimeFull = (ms: number) => {
  if (!ms || isNaN(ms)) return "0t 0m 0s";

  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}t ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const GraphScreen = () => {
  const [weeklyApps, setWeeklyApps] = useState<WeeklyAppUsage[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const data = await getWeeklyUsage();
        setWeeklyApps(data);
      };
      loadData();
    }, [])
  );

  const totalMs = weeklyApps.reduce((sum, app) => sum + app.totalMs, 0);

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Sidste 7 dage</Text>

        <View style={styles.totalBox}>
          <Text style={styles.totalTime}>{formatTimeFull(totalMs)}</Text>
          <Text style={styles.subText}>Total tid</Text>
        </View>

        <FlatList
          data={weeklyApps}
          keyExtractor={(item) => item.name}
          renderItem={({ item, index }) => {
            const appData = APPS.find(a => a.name === item.name);
            return (
              <View
                style={[
                  styles.card,
                  index === 0 && styles.highlightCard
                ]}
              >
                <View style={styles.row}>
                  {appData && (
                    <Image source={appData.icon} style={styles.icon} />
                  )}
                  <Text style={styles.appName}>{item.name}</Text>
                  <Text style={styles.timeText}>
                    {formatTimeFull(item.totalMs)}
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Ingen aktiviteter registreret</Text>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </Background>
  );
};

export default GraphScreen;

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
    fontSize: 22,
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
  highlightCard: {
    backgroundColor: '#32D74B',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timeText: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
