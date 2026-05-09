import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Switch, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { setProfile, setOnboardingDone } = useAppStore();
  const [firstName, setFirstName] = useState('');
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [isEmployed, setIsEmployed] = useState(false);

  function handleContinue() {
    setProfile({
      firstName,
      arrivalDate: arrivalDate ? arrivalDate.toISOString().split('T')[0] : null,
      hasChildren,
      isEmployed,
    });
    setOnboardingDone(true);
    router.replace('/(tabs)/home');
  }

  function handleSkip() {
    setOnboardingDone(true);
    router.replace('/(tabs)/home');
  }

  const formattedDate = arrivalDate
    ? arrivalDate.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Tell us a little{'\n'}about yourself</Text>
          <Text style={styles.subtitle}>
            This personalises your checklist. Everything stays on your device — no account needed.
          </Text>
        </View>

        <View style={styles.form}>
          {/* First name */}
          <View style={styles.field}>
            <Text style={styles.label}>First name <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="e.g. Amara"
              placeholderTextColor="#8a8a80"
              returnKeyType="done"
            />
          </View>

          {/* Arrival date */}
          <View style={styles.field}>
            <Text style={styles.label}>When did you arrive in Canada?</Text>
            <Text style={styles.hint}>Used to calculate your AHCIP deadline</Text>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setShowPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={formattedDate ? styles.dateText : styles.datePlaceholder}>
                {formattedDate ?? 'Select arrival date'}
              </Text>
              <Text style={styles.dateIcon}>📅</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={arrivalDate ?? new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                maximumDate={new Date()}
                onChange={(_, date) => {
                  setShowPicker(Platform.OS === 'ios');
                  if (date) setArrivalDate(date);
                }}
              />
            )}
          </View>

          {/* Has children */}
          <View style={styles.toggleField}>
            <View style={styles.toggleText}>
              <Text style={styles.label}>Do you have children?</Text>
              <Text style={styles.hint}>Surfaces school registration step</Text>
            </View>
            <Switch
              value={hasChildren}
              onValueChange={setHasChildren}
              trackColor={{ false: '#ddd', true: '#2d6652' }}
              thumbColor="#fff"
            />
          </View>

          {/* Employed */}
          <View style={styles.toggleField}>
            <View style={styles.toggleText}>
              <Text style={styles.label}>Are you employed or have a job offer?</Text>
              <Text style={styles.hint}>Prioritises credential recognition step</Text>
            </View>
            <Switch
              value={isEmployed}
              onValueChange={setIsEmployed}
              trackColor={{ false: '#ddd', true: '#2d6652' }}
              thumbColor="#fff"
            />
          </View>

          {/* Info box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              🔒 Your data is stored only on this device. No account, no cloud upload in Phase 1.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cta} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.ctaText}>Start my checklist →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f2eb' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, backgroundColor: '#1d4434' },
  backBtn: { marginBottom: 12 },
  backText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', lineHeight: 32, marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20 },
  form: { padding: 24, gap: 20 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a18' },
  optional: { fontWeight: '400', color: '#8a8a80' },
  hint: { fontSize: 12, color: '#8a8a80' },
  input: {
    backgroundColor: '#fff', borderRadius: 10, padding: 14,
    fontSize: 15, color: '#1a1a18',
    borderWidth: 1, borderColor: 'rgba(26,26,24,0.12)',
  },
  datePicker: {
    backgroundColor: '#fff', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: 'rgba(26,26,24,0.12)',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  dateText: { fontSize: 15, color: '#1a1a18' },
  datePlaceholder: { fontSize: 15, color: '#8a8a80' },
  dateIcon: { fontSize: 18 },
  toggleField: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(26,26,24,0.12)', gap: 12,
  },
  toggleText: { flex: 1, gap: 2 },
  infoBox: {
    backgroundColor: '#e8f2ec', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: 'rgba(29,68,52,0.15)',
  },
  infoText: { fontSize: 13, color: '#1d4434', lineHeight: 20 },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8, gap: 10 },
  cta: { backgroundColor: '#1d4434', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { color: '#8a8a80', fontSize: 14 },
});
