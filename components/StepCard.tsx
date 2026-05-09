import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { Step, StepStatus } from '../types/Step';

interface Props {
  step: Step;
  status: StepStatus;
}

const STATUS_CONFIG = {
  not_started: { label: 'Not started', bg: '#f5f2eb', border: 'rgba(26,26,24,0.12)', text: '#8a8a80', dot: '#ddd' },
  in_progress: { label: 'In progress', bg: '#fdf3e3', border: 'rgba(200,146,42,0.25)', text: '#c8922a', dot: '#c8922a' },
  done: { label: 'Done', bg: '#e8f2ec', border: 'rgba(29,68,52,0.2)', text: '#1d4434', dot: '#1d4434' },
};

export function StepCard({ step, status }: Props) {
  const router = useRouter();
  const config = STATUS_CONFIG[status];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: config.bg, borderColor: config.border }]}
      onPress={() => router.push(`/steps/${step.id}` as never)}
      activeOpacity={0.7}
    >
      <View style={[styles.numBadge, status === 'done' && styles.numBadgeDone]}>
        {status === 'done' ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : (
          <Text style={[styles.num, status === 'in_progress' && styles.numActive]}>
            {step.stepNumber}
          </Text>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.timing}>{step.timing}</Text>
        <Text style={styles.title} numberOfLines={1}>{step.title}</Text>
        <View style={styles.badges}>
          <View style={[styles.statusBadge, { borderColor: config.border }]}>
            <View style={[styles.statusDot, { backgroundColor: config.dot }]} />
            <Text style={[styles.statusText, { color: config.text }]}>{config.label}</Text>
          </View>
          {step.offlineAvailable && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineText}>⬇ Offline</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
  },
  numBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#1d4434',
    alignItems: 'center', justifyContent: 'center',
  },
  numBadgeDone: { backgroundColor: '#2d6652' },
  num: { color: '#fff', fontSize: 14, fontWeight: '700' },
  numActive: { color: '#fff' },
  checkmark: { color: '#fff', fontSize: 16, fontWeight: '700' },
  body: { flex: 1, gap: 3 },
  timing: { fontSize: 11, color: '#8a8a80', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '500' },
  title: { fontSize: 15, fontWeight: '600', color: '#1a1a18' },
  badges: { flexDirection: 'row', gap: 6, marginTop: 2, flexWrap: 'wrap' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2,
    backgroundColor: '#fff',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '500' },
  offlineBadge: {
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2,
    backgroundColor: '#fdf3e3', borderWidth: 1, borderColor: 'rgba(200,146,42,0.2)',
  },
  offlineText: { fontSize: 11, color: '#c8922a' },
  chevron: { fontSize: 22, color: '#8a8a80', marginRight: 2 },
});
