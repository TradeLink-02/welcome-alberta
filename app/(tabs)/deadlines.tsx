import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDeadlines } from '../../hooks/useDeadlines';
import { useAppStore } from '../../store/useAppStore';
import { format } from 'date-fns';

const URGENCY_STYLE = {
  overdue: { border: '#b54a2c', bg: '#fbeee9', badge: '#b54a2c', badgeBg: '#fbeee9', icon: '🚨' },
  urgent: { border: '#c8922a', bg: '#fdf3e3', badge: '#c8922a', badgeBg: '#fdf3e3', icon: '⏰' },
  upcoming: { border: 'rgba(29,68,52,0.3)', bg: '#e8f2ec', badge: '#1d4434', badgeBg: '#e8f2ec', icon: '📅' },
};

export default function DeadlinesScreen() {
  const router = useRouter();
  const deadlines = useDeadlines();
  const profile = useAppStore((s) => s.profile);

  if (!profile.arrivalDate) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Deadlines</Text>
          <Text style={styles.subtitle}>Critical dates from your arrival</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No arrival date set</Text>
          <Text style={styles.emptyText}>
            Add your arrival date in Settings to see your personalised deadline calendar.
          </Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push('/(tabs)/settings' as never)}
          >
            <Text style={styles.settingsBtnText}>Go to Settings →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deadlines</Text>
        <Text style={styles.subtitle}>
          Based on arrival: {format(new Date(profile.arrivalDate), 'MMMM d, yyyy')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {deadlines.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>No upcoming deadlines</Text>
            <Text style={styles.emptyText}>You're all clear! Keep checking your checklist.</Text>
          </View>
        ) : (
          deadlines.map((deadline) => {
            const style = URGENCY_STYLE[deadline.urgency];
            return (
              <TouchableOpacity
                key={deadline.id}
                style={[styles.card, { borderColor: style.border, backgroundColor: style.bg }]}
                onPress={() => router.push(`/steps/${deadline.stepId}` as never)}
                activeOpacity={0.7}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.deadlineIcon}>{style.icon}</Text>
                  <View style={[styles.urgencyBadge, { backgroundColor: style.badgeBg }]}>
                    <Text style={[styles.urgencyText, { color: style.badge }]}>
                      {deadline.urgency === 'overdue'
                        ? 'Overdue'
                        : deadline.urgency === 'urgent'
                        ? 'Due soon'
                        : 'Upcoming'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.deadlineLabel}>{deadline.label}</Text>
                <Text style={styles.deadlineDue}>
                  Due: {format(deadline.dueDate, 'MMMM d, yyyy')}
                </Text>

                <View style={styles.daysRow}>
                  <Text style={[styles.daysCount, { color: style.badge }]}>
                    {deadline.daysRemaining < 0
                      ? `${Math.abs(deadline.daysRemaining)} days overdue`
                      : deadline.daysRemaining === 0
                      ? 'Due today!'
                      : `${deadline.daysRemaining} days remaining`}
                  </Text>
                  <Text style={styles.viewStep}>View step →</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.info}>
          <Text style={styles.infoText}>
            💡 Deadlines are calculated from your arrival date. If you missed a deadline, contact a settlement agency immediately — some extensions are possible.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f2eb' },
  header: { backgroundColor: '#1d4434', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 4 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  list: { padding: 16, gap: 12 },
  card: {
    borderRadius: 14, borderWidth: 1.5, borderLeftWidth: 4,
    padding: 16, gap: 8,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deadlineIcon: { fontSize: 20 },
  urgencyBadge: { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 },
  urgencyText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  deadlineLabel: { fontSize: 16, fontWeight: '600', color: '#1a1a18' },
  deadlineDue: { fontSize: 13, color: '#4a4a45' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  daysCount: { fontSize: 14, fontWeight: '700' },
  viewStep: { fontSize: 13, color: '#2a5c8a' },
  empty: { paddingTop: 60, alignItems: 'center', gap: 12, paddingHorizontal: 24 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a18' },
  emptyText: { fontSize: 14, color: '#4a4a45', textAlign: 'center', lineHeight: 22 },
  settingsBtn: { backgroundColor: '#1d4434', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12 },
  settingsBtnText: { color: '#fff', fontWeight: '600' },
  info: { backgroundColor: '#e8f2ec', borderRadius: 12, padding: 14 },
  infoText: { fontSize: 13, color: '#1d4434', lineHeight: 20 },
});
