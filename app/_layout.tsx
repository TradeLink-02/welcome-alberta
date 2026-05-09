import '../global.css';
import '../lib/i18n';

import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import { useNotifications } from '../hooks/useNotifications';
import { applyRTL } from '../lib/i18n';
import i18n from '../lib/i18n';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 60 },
  },
});

function AppProviders() {
  const router = useRouter();
  const segments = useSegments();
  const onboardingDone = useAppStore((s) => s.onboardingDone);
  const locale = useAppStore((s) => s.locale);

  // Wire up notifications
  useNotifications();

  useEffect(() => {
    // Apply saved language + RTL on every launch
    applyRTL(locale);
    i18n.changeLanguage(locale);
    SplashScreen.hideAsync();

    const inOnboarding =
      segments[0] === 'lang-select' ||
      segments[0] === 'status-select' ||
      segments[0] === 'profile-setup';

    if (!onboardingDone && !inOnboarding) {
      router.replace('/lang-select');
    }
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="lang-select" />
      <Stack.Screen name="status-select" />
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="steps/[id]"
        options={{ presentation: 'card', animation: 'slide_from_bottom' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders />
    </QueryClientProvider>
  );
}
