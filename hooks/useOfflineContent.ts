import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STEPS_FALLBACK } from '../constants/steps';
import { SERVICES_FALLBACK } from '../constants/services';
import { fetchStepsFromSanity, fetchServicesFromSanity } from '../lib/sanity';
import type { Step } from '../types/Step';
import type { Service } from '../types/Service';

const CACHE_KEY_STEPS = '@wa:contentCache';
const CACHE_KEY_SERVICES = '@wa:serviceCache';
const STALE_MS = 1000 * 60 * 60; // 1 hour

async function loadWithFallback<T>(
  cacheKey: string,
  fetcher: () => Promise<T[]>,
  fallback: T[]
): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw) as { data: T[]; ts: number };
      // Refresh in background if stale
      if (Date.now() - parsed.ts > STALE_MS) {
        fetcher()
          .then((fresh) =>
            AsyncStorage.setItem(cacheKey, JSON.stringify({ data: fresh, ts: Date.now() }))
          )
          .catch(() => {});
      }
      return parsed.data;
    }
  } catch {}

  try {
    const fresh = await fetcher();
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ data: fresh, ts: Date.now() }));
    return fresh;
  } catch {}

  return fallback;
}

async function fetchStepsRemote(): Promise<Step[]> {
  return fetchStepsFromSanity();
}

async function fetchServicesRemote(): Promise<Service[]> {
  return fetchServicesFromSanity();
}

export function useSteps() {
  return useQuery({
    queryKey: ['steps'],
    queryFn: () => loadWithFallback<Step>(CACHE_KEY_STEPS, fetchStepsRemote, STEPS_FALLBACK),
    staleTime: STALE_MS,
  });
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => loadWithFallback<Service>(CACHE_KEY_SERVICES, fetchServicesRemote, SERVICES_FALLBACK),
    staleTime: STALE_MS,
  });
}
