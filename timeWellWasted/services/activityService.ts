import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateActivityTask } from '../api';

export const getCurrentUserId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_userId');
};

export const loadLatestActivity = async () => {
  try {
    const latestJson = await AsyncStorage.getItem('latest_activity');
    if (latestJson) {
      return JSON.parse(latestJson);
    }
  } catch {}
  return null;
};

export const loadTimer = async (userId: string) => {
  const saved = await AsyncStorage.getItem(`timer_${userId}`);
  if (!saved) return null;
  return JSON.parse(saved);
};

export const saveTimer = async (userId: string, timerObj: any) => {
  await AsyncStorage.setItem(
    `timer_${userId}`,
    JSON.stringify(timerObj)
  );
};

export const removeTimer = async (userId: string) => {
  await AsyncStorage.removeItem(`timer_${userId}`);
};

export const updateActivity = async (
  activityId: number,
  activityName: string,
  activityDescription: string,
  startTime: number | null,
  elapsed: number,
) => {
  const token = await AsyncStorage.getItem('auth_token');

  const whenStarted = startTime
    ? new Date(startTime).toISOString()
    : new Date(Date.now() - elapsed).toISOString();

  const whenEnded = new Date(
    startTime ? startTime + elapsed : Date.now()
  ).toISOString();

  // 🔹 Existing backend logic (UNCHANGED)
  if (token && activityId && activityName) {
    await updateActivityTask(
      activityId,
      {
        activityId,
        activityName,
        description: activityDescription,
        whenStarted,
        whenEnded,
      },
      token
    );
  }

  // 🔹 ADDED: Save locally for weekly graph
  try {
    const existing = await AsyncStorage.getItem('activities');
    const activities = existing ? JSON.parse(existing) : [];

    activities.push({
      activityId,
      activityName,
      description: activityDescription,
      whenStarted,
      whenEnded,
    });

    await AsyncStorage.setItem(
      'activities',
      JSON.stringify(activities)
    );
    const check = await AsyncStorage.getItem('activities');
console.log('SAVED ACTIVITIES:', check);
  } catch (error) {
    console.log('Local activity save failed:', error);
  }
};