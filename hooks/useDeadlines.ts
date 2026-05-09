import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { calculateDeadlines } from '../lib/deadlines';

export function useDeadlines() {
  const profile = useAppStore((s) => s.profile);
  return useMemo(
    () => calculateDeadlines(profile.arrivalDate, profile.immigrationStatus),
    [profile.arrivalDate, profile.immigrationStatus]
  );
}
