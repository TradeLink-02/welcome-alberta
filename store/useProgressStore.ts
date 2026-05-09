import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StepStatus } from '../types/Step';

type ItemsChecked = Record<string, Record<string, boolean>>;
type DocsGathered = Record<string, boolean>;
type StepProgress = Record<string, StepStatus>;

interface ProgressState {
  stepProgress: StepProgress;
  itemsChecked: ItemsChecked;
  docsGathered: DocsGathered;
  savedServices: string[];

  setStepStatus: (stepId: string, status: StepStatus) => void;
  toggleItem: (stepId: string, itemId: string) => void;
  toggleDoc: (docId: string) => void;
  toggleSavedService: (serviceId: string) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      stepProgress: {},
      itemsChecked: {},
      docsGathered: {},
      savedServices: [],

      setStepStatus: (stepId, status) =>
        set((state) => ({
          stepProgress: { ...state.stepProgress, [stepId]: status },
        })),

      toggleItem: (stepId, itemId) =>
        set((state) => {
          const stepItems = state.itemsChecked[stepId] ?? {};
          const current = stepItems[itemId] ?? false;
          return {
            itemsChecked: {
              ...state.itemsChecked,
              [stepId]: { ...stepItems, [itemId]: !current },
            },
          };
        }),

      toggleDoc: (docId) =>
        set((state) => ({
          docsGathered: {
            ...state.docsGathered,
            [docId]: !state.docsGathered[docId],
          },
        })),

      toggleSavedService: (serviceId) =>
        set((state) => {
          const saved = state.savedServices;
          return {
            savedServices: saved.includes(serviceId)
              ? saved.filter((id) => id !== serviceId)
              : [...saved, serviceId],
          };
        }),

      resetProgress: () =>
        set({ stepProgress: {}, itemsChecked: {}, docsGathered: {} }),
    }),
    {
      name: '@wa:progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
