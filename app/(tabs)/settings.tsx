import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, Switch, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useProgressStore } from '../../store/useProgressStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { applyRTL } from '../../lib/i18n';
import i18n from '../../lib/i18n';
import type { Locale } from '../../types/Profile';

const LANGUAGES: { code: Locale; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'fil', label: 'Filipino', native: 'Filipino' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'ti', label: 'Tigrinya', native: 'ትግርኛ' },
  { code: 'uk', label: 'Ukrainian', native: 'Українська' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { locale, setLocale, profile, setProfile, onboardingDone } = useAppStore();
  const { resetProgress } = useProgressStore();
  const { notifPrefs, setNotifPref } = useSettingsStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.firstName);

  function changeLanguage(code: Locale) {
    setLocale(code);
    applyRTL(code);
    i18n.changeLanguage(code);
  }

  function handleResetProgress() {
    Alert.alert(
      'Reset progress?',
      'This will clear all your checklist progress. Your profile and settings will be kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetProgress(),
        },
      ]
    );
  }

  function saveName() {
    setProfile({ firstName: nameInput });
    setEditingName(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Name</Text>
              {editingName ? (
                <View style={styles.nameEdit}>
                  <TextInput
                    style={styles.nameInput}
                    value={nameInput}
                    onChangeText={setNameInput}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={saveName}
                  />
                  <TouchableOpacity onPress={saveName}>
                    <Text style={styles.saveBtn}>Save</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setEditingName(true)}>
                  <Text style={styles.rowValue}>
                    {profile.firstName || 'Not set'} <Text style={styles.editHint}>Edit</Text>
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={[styles.row, styles.rowBorder]}>
              <Text style={styles.rowLabel}>Arrival date</Text>
              <Text style={styles.rowValue}>{profile.arrivalDate ?? 'Not set'}</Text>
            </View>

            <View style={[styles.row, styles.rowBorder]}>
              <Text style={styles.rowLabel}>Immigration status</Text>
              <Text style={styles.rowValue}>{profile.immigrationStatus?.replace('_', ' ') ?? 'Not set'}</Text>
            </View>

            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Has children</Text>
              </View>
              <Switch
                value={profile.hasChildren}
                onValueChange={(v) => setProfile({ hasChildren: v })}
                trackColor={{ false: '#ddd', true: '#2d6652' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.card}>
            {LANGUAGES.map((lang, i) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langRow, i > 0 && styles.rowBorder]}
                onPress={() => changeLanguage(lang.code)}
                activeOpacity={0.7}
              >
                <View>
                  <Text style={styles.rowLabel}>{lang.native}</Text>
                  <Text style={styles.rowHint}>{lang.label}</Text>
                </View>
                {locale === lang.code && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>AHCIP deadline reminder</Text>
                <Text style={styles.rowHint}>30-day warning before your deadline</Text>
              </View>
              <Switch
                value={notifPrefs['ahcip'] ?? true}
                onValueChange={(v) => setNotifPref('ahcip', v)}
                trackColor={{ false: '#ddd', true: '#2d6652' }}
                thumbColor="#fff"
              />
            </View>
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Licence exchange reminder</Text>
                <Text style={styles.rowHint}>Before the 90-day window closes</Text>
              </View>
              <Switch
                value={notifPrefs['licence'] ?? true}
                onValueChange={(v) => setNotifPref('licence', v)}
                trackColor={{ false: '#ddd', true: '#2d6652' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Danger zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={handleResetProgress} activeOpacity={0.7}>
              <Text style={styles.dangerText}>Reset checklist progress</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Version</Text>
              <Text style={styles.rowValue}>1.0.0 (Phase 1 MVP)</Text>
            </View>
            <View style={[styles.row, styles.rowBorder]}>
              <Text style={styles.rowLabel}>Made in Edmonton</Text>
              <Text style={styles.rowValue}>🍁</Text>
            </View>
          </View>
          <Text style={styles.disclaimer}>
            This app provides general information only, not legal advice. Always verify details with a qualified settlement agency or government website.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f2eb' },
  header: { backgroundColor: '#1d4434', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  body: { padding: 16, gap: 24 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#8a8a80', textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 4 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(26,26,24,0.1)', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, gap: 8 },
  rowBorder: { borderTopWidth: 1, borderTopColor: 'rgba(26,26,24,0.06)' },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 15, fontWeight: '500', color: '#1a1a18' },
  rowValue: { fontSize: 14, color: '#4a4a45' },
  rowHint: { fontSize: 12, color: '#8a8a80' },
  editHint: { color: '#2d6652', fontSize: 12 },
  nameEdit: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  nameInput: {
    borderWidth: 1, borderColor: '#1d4434', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, fontSize: 14, minWidth: 120,
  },
  saveBtn: { color: '#1d4434', fontWeight: '600', fontSize: 14 },
  langRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  checkIcon: { color: '#1d4434', fontSize: 16, fontWeight: '700' },
  chevron: { fontSize: 18, color: '#8a8a80' },
  dangerText: { fontSize: 15, color: '#b54a2c', fontWeight: '500' },
  disclaimer: { fontSize: 12, color: '#8a8a80', textAlign: 'center', lineHeight: 18, paddingHorizontal: 4 },
});
