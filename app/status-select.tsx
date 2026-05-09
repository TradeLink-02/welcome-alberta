import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  SafeAreaView, Modal, Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { ImmigrationStatus } from '../types/Profile';

const STATUSES: { key: ImmigrationStatus; emoji: string; label: string; desc: string }[] = [
  { key: 'pr', emoji: '🍁', label: 'Permanent Resident', desc: 'You hold a PR card or have been approved for permanent residence.' },
  { key: 'work_permit', emoji: '💼', label: 'Work Permit', desc: 'You have a valid Canadian work permit (LMIA, PGWP, or other).' },
  { key: 'study_permit', emoji: '🎓', label: 'Study Permit', desc: 'You are studying in Canada on a student visa.' },
  { key: 'refugee', emoji: '🏠', label: 'Convention Refugee / GAR', desc: 'You are a government-assisted or privately sponsored refugee, or a Convention Refugee.' },
  { key: 'cuaet', emoji: '🇺🇦', label: 'Ukrainian Evacuee (CUAET)', desc: 'You arrived under the Canada-Ukraine Authorization for Emergency Travel.' },
  { key: 'refugee_claimant', emoji: '📋', label: 'Refugee Claimant', desc: 'You have submitted a refugee claim and are waiting for a decision.' },
  { key: 'other', emoji: '🌐', label: 'Other', desc: 'Visitor visa, family sponsorship in progress, or another status.' },
];

export default function StatusSelectScreen() {
  const router = useRouter();
  const setImmigrationStatus = useAppStore((s) => s.setImmigrationStatus);
  const [selected, setSelected] = useState<ImmigrationStatus | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  function handleContinue() {
    if (!selected) return;
    setImmigrationStatus(selected);
    router.replace('/profile-setup');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>What best describes{'\n'}your situation?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {STATUSES.map((s) => {
          const active = selected === s.key;
          return (
            <TouchableOpacity
              key={s.key}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => setSelected(s.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{s.emoji}</Text>
              <View style={styles.cardBody}>
                <Text style={[styles.cardLabel, active && styles.cardLabelActive]}>{s.label}</Text>
                <Text style={styles.cardDesc}>{s.desc}</Text>
              </View>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.notSureBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.notSureText}>Not sure which applies to you?</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.cta, !selected && styles.ctaDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Continue →</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Not sure about your status?</Text>
            <Text style={styles.modalBody}>
              {'Contact a settlement agency — they are free and can help:\n\n• EMCN: 780-424-7709\n• Catholic Social Services: 780-420-1466\n• EISA: 780-474-8445'}
            </Text>
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f2eb' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: '#1d4434' },
  backBtn: { marginBottom: 12 },
  backText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', lineHeight: 32 },
  list: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 10 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 2,
    borderColor: 'rgba(26,26,24,0.1)', padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  cardActive: { borderColor: '#1d4434', backgroundColor: '#e8f2ec' },
  emoji: { fontSize: 22, width: 32, textAlign: 'center' },
  cardBody: { flex: 1 },
  cardLabel: { fontSize: 15, fontWeight: '600', color: '#1a1a18', marginBottom: 2 },
  cardLabelActive: { color: '#1d4434' },
  cardDesc: { fontSize: 12, color: '#8a8a80', lineHeight: 16 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: 'rgba(26,26,24,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: '#1d4434' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1d4434' },
  notSureBtn: { paddingVertical: 12, alignItems: 'center' },
  notSureText: { color: '#2d6652', fontSize: 13, textDecorationLine: 'underline' },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 },
  cta: { backgroundColor: '#1d4434', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  ctaDisabled: { backgroundColor: 'rgba(29,68,52,0.35)' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a18', marginBottom: 12 },
  modalBody: { fontSize: 14, color: '#4a4a45', lineHeight: 22, marginBottom: 20 },
  modalClose: { backgroundColor: '#1d4434', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  modalCloseText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
