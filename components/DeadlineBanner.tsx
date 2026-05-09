import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { Deadline } from '../lib/deadlines';

interface Props {
  deadline: Deadline;
}

export function DeadlineBanner({ deadline }: Props) {
  const router = useRouter();
  const isOverdue = deadline.urgency === 'overdue';

  return (
    <TouchableOpacity
      style={[styles.banner, isOverdue ? styles.bannerOverdue : styles.bannerUrgent]}
      onPress={() => router.push(`/steps/${deadline.stepId}` as never)}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{isOverdue ? '🚨' : '⏰'}</Text>
      <View style={styles.body}>
        <Text style={[styles.title, isOverdue && styles.titleOverdue]}>
          {isOverdue ? 'Deadline missed' : 'Deadline approaching'}
        </Text>
        <Text style={styles.message}>
          {deadline.label} —{' '}
          {isOverdue
            ? `${Math.abs(deadline.daysRemaining)} days overdue`
            : `${deadline.daysRemaining} days left`}
        </Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  bannerUrgent: { backgroundColor: '#fdf3e3', borderWidth: 1, borderColor: 'rgba(200,146,42,0.3)' },
  bannerOverdue: { backgroundColor: '#fbeee9', borderWidth: 1, borderColor: 'rgba(181,74,44,0.3)' },
  icon: { fontSize: 20 },
  body: { flex: 1 },
  title: { fontSize: 12, fontWeight: '600', color: '#c8922a', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  titleOverdue: { color: '#b54a2c' },
  message: { fontSize: 13, color: '#4a4a45', lineHeight: 18 },
  arrow: { fontSize: 16, color: '#8a8a80' },
});
