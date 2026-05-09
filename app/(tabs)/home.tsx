import {
  View, Text, ScrollView, StyleSheet, SafeAreaView, RefreshControl,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { useProgressStore } from '../../store/useProgressStore';
import { useSteps } from '../../hooks/useOfflineContent';
import { useDeadlines } from '../../hooks/useDeadlines';
import { StepCard } from '../../components/StepCard';
import { DeadlineBanner } from '../../components/DeadlineBanner';
import { ProgressRing } from '../../components/ProgressRing';
import type { StepStatus } from '../../types/Step';

export default function HomeScreen() {
  const profile = useAppStore((s) => s.profile);
  const stepProgress = useProgressStore((s) => s.stepProgress);
  const { data: steps = [], isLoading, refetch } = useSteps();
  const deadlines = useDeadlines();

  const doneCount = Object.values(stepProgress).filter((s) => s === 'done').length;
  const urgentDeadlines = deadlines.filter((d) => d.urgency !== 'upcoming').slice(0, 2);

  const greeting = profile.firstName
    ? `Hello, ${profile.firstName}`
    : 'Hello';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Welcome Alberta</Text>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.progressText}>
              {doneCount} of {steps.length} steps complete
            </Text>
          </View>
          <ProgressRing done={doneCount} total={steps.length} size={72} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: steps.length > 0 ? `${(doneCount / steps.length) * 100}%` : '0%' },
            ]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#1d4434" />}
      >
        {/* Deadline banners */}
        {urgentDeadlines.map((d) => (
          <DeadlineBanner key={d.id} deadline={d} />
        ))}

        {/* Steps */}
        {isLoading && steps.length === 0 ? (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>Loading your checklist…</Text>
          </View>
        ) : (
          steps.map((step) => {
            const status: StepStatus = stepProgress[step.id] ?? 'not_started';
            return <StepCard key={step.id} step={step} status={status} />;
          })
        )}

        {/* Completion message */}
        {doneCount === steps.length && steps.length > 0 && (
          <View style={styles.completionCard}>
            <Text style={styles.completionEmoji}>🎉</Text>
            <Text style={styles.completionTitle}>You've completed all 9 steps!</Text>
            <Text style={styles.completionSub}>
              Keep this app for reference and explore the Services and Deadlines tabs.
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This app provides general information, not legal advice. Always verify with a settlement agency.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f2eb' },
  header: { backgroundColor: '#1d4434', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerText: { flex: 1 },
  eyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  progressText: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7ecb9d', borderRadius: 2 },
  list: { padding: 16, gap: 10 },
  loading: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { color: '#8a8a80', fontSize: 14 },
  completionCard: {
    backgroundColor: '#e8f2ec', borderRadius: 16,
    padding: 24, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(29,68,52,0.2)',
  },
  completionEmoji: { fontSize: 40, marginBottom: 12 },
  completionTitle: { fontSize: 18, fontWeight: '700', color: '#1d4434', marginBottom: 8, textAlign: 'center' },
  completionSub: { fontSize: 14, color: '#4a4a45', textAlign: 'center', lineHeight: 20 },
  footer: { paddingTop: 8 },
  footerText: { fontSize: 11, color: '#8a8a80', textAlign: 'center', lineHeight: 16 },
});
