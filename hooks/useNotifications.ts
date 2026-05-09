import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../store/useAppStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useProgressStore } from '../store/useProgressStore';
import { calculateDeadlines } from '../lib/deadlines';
import { addDays, parseISO } from 'date-fns';

const NOTIF_IDS_KEY = '@wa:notifIds';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function cancelAllScheduled() {
  const raw = await AsyncStorage.getItem(NOTIF_IDS_KEY);
  if (!raw) return;
  const ids: string[] = JSON.parse(raw);
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  await AsyncStorage.removeItem(NOTIF_IDS_KEY);
}

async function scheduleDeadlineNotifications(
  arrivalDate: string,
  notifPrefs: Record<string, boolean>
) {
  await cancelAllScheduled();
  const ids: string[] = [];
  const deadlines = calculateDeadlines(arrivalDate, null);

  for (const deadline of deadlines) {
    if (notifPrefs[deadline.id] === false) continue;
    if (deadline.daysRemaining <= 0) continue;

    // 30-day warning
    if (deadline.daysRemaining > 30) {
      const triggerDate = addDays(new Date(), deadline.daysRemaining - 30);
      triggerDate.setHours(9, 0, 0, 0);
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Deadline in 30 days',
          body: deadline.label,
          data: { stepId: deadline.stepId },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
      });
      ids.push(id);
    }

    // 7-day warning
    if (deadline.daysRemaining > 7) {
      const triggerDate7 = addDays(new Date(), deadline.daysRemaining - 7);
      triggerDate7.setHours(9, 0, 0, 0);
      const id7 = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 Deadline in 7 days',
          body: `Don't miss it: ${deadline.label}`,
          data: { stepId: deadline.stepId },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate7 },
      });
      ids.push(id7);
    }
  }

  await AsyncStorage.setItem(NOTIF_IDS_KEY, JSON.stringify(ids));
}

export function useNotifications() {
  const profile = useAppStore((s) => s.profile);
  const notifPrefs = useSettingsStore((s) => s.notifPrefs);
  const stepProgress = useProgressStore((s) => s.stepProgress);
  const scheduled = useRef(false);

  useEffect(() => {
    if (!profile.arrivalDate || scheduled.current) return;
    scheduled.current = true;

    requestNotificationPermission().then((granted) => {
      if (!granted) return;
      scheduleDeadlineNotifications(profile.arrivalDate!, notifPrefs);
    });
  }, [profile.arrivalDate]);

  // Cancel AHCIP notification when step is marked done
  useEffect(() => {
    if (stepProgress['step_2_ahcip'] === 'done') {
      cancelAllScheduled();
    }
  }, [stepProgress['step_2_ahcip']]);
}
