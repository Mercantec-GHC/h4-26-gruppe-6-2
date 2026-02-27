import AsyncStorage from '@react-native-async-storage/async-storage';

export type WeeklyAppUsage = {
  name: string;
  totalMs: number;
};

type SavedActivity = {
  activityId: number;
  activityName: string;
  description: string;
  whenStarted: string;
  whenEnded: string;
};

export const getWeeklyUsage = async (): Promise<WeeklyAppUsage[]> => {
  try {
    // Consistently use 'activities' as in activityService.ts
    const raw = await AsyncStorage.getItem('activities');

    if (!raw) {
      console.log("No activities found in storage");
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      console.log("Storage 'activities' is not an array:", parsed);
      return [];
    }

    const savedActivities: SavedActivity[] = parsed;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Grouping by activity name and summing up duration
    // We use a Map to handle potential duplicates (if multiple updates were saved for same ID)
    // Actually, let's just take the latest version of each activityId if they exist
    const uniqueActivities: Record<number, SavedActivity> = {};
    savedActivities.forEach(act => {
      uniqueActivities[act.activityId] = act;
    });

    const usageMap: Record<string, number> = {};

    Object.values(uniqueActivities).forEach(activity => {
      if (!activity.whenStarted || !activity.whenEnded) return;

      const start = new Date(activity.whenStarted);
      const end = new Date(activity.whenEnded);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

      if (end >= weekAgo) {
        const duration = end.getTime() - start.getTime();
        if (duration > 0) {
          const name = activity.activityName || 'Ukendt';
          if (!usageMap[name]) {
            usageMap[name] = 0;
          }
          usageMap[name] += duration;
        }
      }
    });

    const result: WeeklyAppUsage[] = Object.keys(usageMap).map(name => ({
      name,
      totalMs: usageMap[name],
    }));

    // Sort by most used
    result.sort((a, b) => b.totalMs - a.totalMs);

    return result;

  } catch (error) {
    console.error("Failed to calculate weekly usage", error);
    return [];
  }
};
