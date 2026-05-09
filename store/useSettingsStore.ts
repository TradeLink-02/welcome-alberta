import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NotifPrefs = Record<string, boolean>;

interface SettingsState {
  notifPrefs: NotifPrefs;
  contentCache: string | null;
  contentCacheTimestamp: number | null;

  setNotifPref: (deadlineId: string, enabled: boolean) => void;
  setContentCache: (json: string) => void;
  clearContentCache: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifPrefs: {},
      contentCache: null,
      contentCacheTimestamp: null,

      setNotifPref: (deadlineId, enabled) =>
        set((state) => ({
          notifPrefs: { ...state.notifPrefs, [deadlineId]: enabled },
        })),

      setContentCache: (json) =>
        set({ contentCache: json, contentCacheTimestamp: Date.now() }),

      clearContentCache: () =>
        set({ contentCache: null, contentCacheTimestamp: null }),
    }),
    {
      name: '@wa:settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
