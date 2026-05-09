import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Linking, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useProgressStore } from '../../store/useProgressStore';
import { useAppStore } from '../../store/useAppStore';
import { useSteps } from '../../hooks/useOfflineContent';

export default function StepDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: steps = [] } = useSteps();
  const step = steps.find((s) => s.id === id);

  const profile = useAppStore((s) => s.profile);
  const { stepProgress, itemsChecked, setStepStatus, toggleItem } = useProgressStore();
  const [whyExpanded, setWhyExpanded] = useState(false);

  if (!step) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Step not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const status = stepProgress[step.id] ?? 'not_started';
  const checkedItems = itemsChecked[step.id] ?? {};
  const allActionsChecked = step.actions.every((a) => checkedItems[a.id]);

  const personaNote = step.personaNotes.find(
    (n) => n.status === profile.immigrationStatus
  );

  function handleMarkComplete() {
    if (status === 'done') {
      setStepStatus(step!.id, 'not_started');
    } else {
      setStepStatus(step!.id, 'done');
      router.back();
    }
  }

  function handleItemToggle(itemId: string) {
    toggleItem(step!.id, itemId);
    // Auto-set in_progress when first item checked
    if (status === 'not_started') {
      setStepStatus(step!.id, 'in_progress');
    }
  }

  function openLink(url: string) {
    Linking.openURL(url).catch(() =>
      Alert.alert('Cannot open link', 'Please check your internet connection.')
    );
  }

  const doneCount = step.actions.filter((a) => checkedItems[a.id]).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← My checklist</Text>
        </TouchableOpacity>
        <View style={styles.headerMeta}>
          <View style={styles.stepNumBadge}>
            <Text style={styles.stepNumText}>Step {step.stepNumber}</Text>
          </View>
          {step.offlineAvailable && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineText}>⬇ Offline</Text>
            </View>
          )}
        </View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.timing}>{step.timing}</Text>

        {/* Mini progress */}
        <View style={styles.miniProgress}>
          <View style={[styles.miniProgressFill, { width: `${(doneCount / step.actions.length) * 100}%` }]} />
        </View>
        <Text style={styles.miniProgressText}>{doneCount}/{step.actions.length} actions done</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {/* Persona note */}
        {personaNote && (
          <View style={styles.personaNote}>
            <Text style={styles.personaNoteIcon}>💡</Text>
            <Text style={styles.personaNoteText}>{personaNote.note}</Text>
          </View>
        )}

        {/* Why this matters */}
        <TouchableOpacity
          style={styles.whySection}
          onPress={() => setWhyExpanded(!whyExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.whyHeader}>
            <Text style={styles.whyTitle}>Why this matters</Text>
            <Text style={styles.whyChevron}>{whyExpanded ? '▲' : '▼'}</Text>
          </View>
          {whyExpanded && (
            <Text style={styles.whyBody}>{step.whyItMatters}</Text>
          )}
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          {step.actions.map((action, i) => {
            const checked = checkedItems[action.id] ?? false;
            return (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionItem, checked && styles.actionItemDone]}
                onPress={() => handleItemToggle(action.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionCheck, checked && styles.actionCheckDone]}>
                  {checked && <Text style={styles.actionCheckMark}>✓</Text>}
                </View>
                <View style={styles.actionBody}>
                  <Text style={styles.actionNum}>{i + 1}</Text>
                  <Text style={[styles.actionText, checked && styles.actionTextDone]}>
                    {action.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Documents */}
        {step.documents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents to gather</Text>
            {step.documents.map((doc) => (
              <View key={doc.id} style={styles.docItem}>
                <Text style={styles.docIcon}>📄</Text>
                <View style={styles.docBody}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docWhy}>{doc.whyNeeded}</Text>
                  <Text style={styles.docWhere}>Where to get: {doc.whereToGet}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Resources */}
        {step.resources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources</Text>
            {step.resources.map((r) => (
              <TouchableOpacity
                key={r.url}
                style={styles.resourceItem}
                onPress={() => openLink(r.url)}
                activeOpacity={0.7}
              >
                <Text style={styles.resourceLabel}>{r.label}</Text>
                <Text style={styles.resourceArrow}>↗</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This is general information, not legal advice. Verify details with a settlement agency or government website.
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrapper}>
        <TouchableOpacity
          style={[styles.cta, status === 'done' && styles.ctaDone]}
          onPress={handleMarkComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>
            {status === 'done' ? '✓ Marked complete — tap to undo' : 'Mark step complete →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f2eb' },
  header: { backgroundColor: '#1d4434', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  backBtn: { marginBottom: 12 },
  backText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  headerMeta: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  stepNumBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  stepNumText: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '500' },
  offlineBadge: {
    backgroundColor: 'rgba(200,146,42,0.25)', borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  offlineText: { color: '#fdf3e3', fontSize: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 4 },
  timing: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 14 },
  miniProgress: { height: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  miniProgressFill: { height: '100%', backgroundColor: '#7ecb9d', borderRadius: 2 },
  miniProgressText: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  body: { padding: 16, gap: 12 },
  personaNote: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: '#e8f2ec', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(29,68,52,0.2)',
  },
  personaNoteIcon: { fontSize: 18 },
  personaNoteText: { flex: 1, fontSize: 13, color: '#1d4434', lineHeight: 20 },
  whySection: {
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(26,26,24,0.1)', padding: 14,
  },
  whyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  whyTitle: { fontSize: 14, fontWeight: '600', color: '#4a4a45' },
  whyChevron: { fontSize: 12, color: '#8a8a80' },
  whyBody: { marginTop: 10, fontSize: 14, color: '#4a4a45', lineHeight: 22 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#8a8a80', textTransform: 'uppercase', letterSpacing: 0.8 },
  actionItem: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(26,26,24,0.1)',
  },
  actionItemDone: { backgroundColor: '#e8f2ec', borderColor: 'rgba(29,68,52,0.2)' },
  actionCheck: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: 'rgba(26,26,24,0.2)',
    alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0,
  },
  actionCheckDone: { backgroundColor: '#1d4434', borderColor: '#1d4434' },
  actionCheckMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  actionBody: { flex: 1, flexDirection: 'row', gap: 6 },
  actionNum: { fontSize: 13, fontWeight: '600', color: '#2d6652', width: 16, flexShrink: 0 },
  actionText: { flex: 1, fontSize: 14, color: '#1a1a18', lineHeight: 22 },
  actionTextDone: { color: '#4a4a45', textDecorationLine: 'line-through' },
  docItem: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(26,26,24,0.1)',
  },
  docIcon: { fontSize: 18, marginTop: 2 },
  docBody: { flex: 1, gap: 2 },
  docName: { fontSize: 14, fontWeight: '600', color: '#1a1a18' },
  docWhy: { fontSize: 12, color: '#4a4a45' },
  docWhere: { fontSize: 12, color: '#2d6652' },
  resourceItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(26,26,24,0.1)',
  },
  resourceLabel: { flex: 1, fontSize: 14, color: '#2a5c8a' },
  resourceArrow: { fontSize: 16, color: '#2a5c8a' },
  disclaimer: { paddingVertical: 8 },
  disclaimerText: { fontSize: 12, color: '#8a8a80', textAlign: 'center', lineHeight: 18 },
  ctaWrapper: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8, backgroundColor: '#f5f2eb' },
  cta: { backgroundColor: '#1d4434', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  ctaDone: { backgroundColor: '#2d6652' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16, color: '#4a4a45' },
  backLink: { color: '#1d4434', fontSize: 15, fontWeight: '500' },
});
