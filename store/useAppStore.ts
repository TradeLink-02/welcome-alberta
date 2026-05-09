import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Locale, Profile, ImmigrationStatus } from '../types/Profile';

interface AppState {
  locale: Locale;
  onboardingDone: boolean;
  profile: Profile;
  setLocale: (locale: Locale) => void;
  setOnboardingDone: (done: boolean) => void;
  setProfile: (profile: Partial<Profile>) => void;
  setImmigrationStatus: (status: ImmigrationStatus) => void;
}

const defaultProfile: Profile = {
  firstName: '',
  arrivalDate: null,
  immigrationStatus: null,
  hasChildren: false,
  isEmployed: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: 'en',
      onboardingDone: false,
      profile: defaultProfile,

      setLocale: (locale) => set({ locale }),
      setOnboardingDone: (done) => set({ onboardingDone: done }),
      setProfile: (partial) =>
        set((state) => ({ profile: { ...state.profile, ...partial } })),
      setImmigrationStatus: (status) =>
        set((state) => ({
          profile: { ...state.profile, immigrationStatus: status },
        })),
    }),
    {
      name: '@wa:app',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
