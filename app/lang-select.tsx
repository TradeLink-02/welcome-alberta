import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Locale } from '../types/Profile';
import { applyRTL } from '../lib/i18n';
import i18n from '../lib/i18n';

const LANGUAGES: { code: Locale; native: string; english: string; flag: string }[] = [
  { code: 'en', native: 'English', english: 'English', flag: '🇨🇦' },
  { code: 'ar', native: 'العربية', english: 'Arabic', flag: '🌙' },
  { code: 'fil', native: 'Filipino', english: 'Filipino', flag: '🇵🇭' },
  { code: 'fr', native: 'Français', english: 'French', flag: '🇫🇷' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', flag: '🇮🇳' },
  { code: 'es', native: 'Español', english: 'Spanish', flag: '🇪🇸' },
  { code: 'ti', native: 'ትግርኛ', english: 'Tigrinya', flag: '🌍' },
  { code: 'uk', native: 'Українська', english: 'Ukrainian', flag: '🇺🇦' },
];

export default function LangSelectScreen() {
  const router = useRouter();
  const setLocale = useAppStore((s) => s.setLocale);
  const [selected, setSelected] = useState<Locale | null>(null);

  function handleContinue() {
    if (!selected) return;
    setLocale(selected);
    applyRTL(selected);
    i18n.changeLanguage(selected);
    router.replace('/status-select');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>Welcome Alberta</Text>
        </View>
        <Text style={styles.title}>Choose your language</Text>
        <Text style={styles.subtitle}>Choisissez votre langue · اختر لغتك · Piliin ang iyong wika</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {LANGUAGES.map((lang) => {
          const active = selected === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langCard, active && styles.langCardActive]}
              onPress={() => setSelected(lang.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={[styles.nativeName, active && styles.nativeNameActive]}>
                {lang.native}
              </Text>
              <Text style={[styles.englishName, active && styles.englishNameActive]}>
                {lang.english}
              </Text>
              {active && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerNote}>You can change this later in Settings</Text>
        <TouchableOpacity
          style={[styles.cta, !selected && styles.ctaDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f2eb' },
  header: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 20, backgroundColor: '#1d4434' },
  logoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  logoText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '500', letterSpacing: 1 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 13 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 10,
    justifyContent: 'space-between',
  },
  langCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(26,26,24,0.1)',
    alignItems: 'center',
    position: 'relative',
  },
  langCardActive: { borderColor: '#1d4434', backgroundColor: '#e8f2ec' },
  flag: { fontSize: 28, marginBottom: 8 },
  nativeName: { fontSize: 16, fontWeight: '600', color: '#1a1a18', marginBottom: 2 },
  nativeNameActive: { color: '#1d4434' },
  englishName: { fontSize: 12, color: '#8a8a80' },
  englishNameActive: { color: '#2d6652' },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1d4434',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12 },
  footerNote: { textAlign: 'center', fontSize: 12, color: '#8a8a80', marginBottom: 12 },
  cta: {
    backgroundColor: '#1d4434',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaDisabled: { backgroundColor: 'rgba(29,68,52,0.35)' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
