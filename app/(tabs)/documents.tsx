import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useProgressStore } from '../../store/useProgressStore';
import { DocumentItem } from '../../components/DocumentItem';
import { useSteps } from '../../hooks/useOfflineContent';

export default function DocumentsScreen() {
  const { data: steps = [] } = useSteps();
  const { docsGathered, toggleDoc } = useProgressStore();

  // Collect all unique documents across all steps
  const allDocs = steps.flatMap((step) =>
    step.documents.map((doc) => ({ ...doc, stepTitle: step.title }))
  );

  const uniqueDocs = allDocs.filter(
    (doc, idx, arr) => arr.findIndex((d) => d.id === doc.id) === idx
  );

  const gatheredCount = uniqueDocs.filter((d) => docsGathered[d.id]).length;

  // Group by category
  const groups: Record<string, typeof uniqueDocs> = {
    'Identity & Status': uniqueDocs.filter((d) =>
      ['passport', 'permit', 'immigration', 'pr', 'status'].some((k) => d.id.includes(k))
    ),
    'Address & Housing': uniqueDocs.filter((d) =>
      ['address', 'lease', 'inspection'].some((k) => d.id.includes(k))
    ),
    'Employment & Credentials': uniqueDocs.filter((d) =>
      ['credentials', 'transcripts', 'licence', 'sin', 't4', 'dates'].some((k) => d.id.includes(k))
    ),
    'Other Documents': uniqueDocs.filter((d) =>
      !['passport', 'permit', 'immigration', 'pr', 'status', 'address', 'lease', 'inspection',
        'credentials', 'transcripts', 'licence', 'sin', 't4', 'dates'].some((k) => d.id.includes(k))
    ),
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Document Checklist</Text>
        <Text style={styles.subtitle}>Track everything you need</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: uniqueDocs.length > 0 ? `${(gatheredCount / uniqueDocs.length) * 100}%` : '0%' },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{gatheredCount}/{uniqueDocs.length} gathered</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {Object.entries(groups).map(([groupName, docs]) =>
          docs.length === 0 ? null : (
            <View key={groupName} style={styles.group}>
              <Text style={styles.groupTitle}>{groupName}</Text>
              {docs.map((doc) => (
                <DocumentItem
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  whyNeeded={doc.whyNeeded}
                  whereToGet={doc.whereToGet}
                  gathered={docsGathered[doc.id] ?? false}
                  onToggle={() => toggleDoc(doc.id)}
                />
              ))}
            </View>
          )
        )}

        <View style={styles.tip}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Make 10 photocopies of each identity document. Store originals safely and carry copies to appointments.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f2eb' },
  header: { backgroundColor: '#1d4434', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 6 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  progressBar: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7ecb9d', borderRadius: 3 },
  progressText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '500' },
  body: { padding: 16, gap: 20 },
  group: { gap: 10 },
  groupTitle: { fontSize: 13, fontWeight: '600', color: '#8a8a80', textTransform: 'uppercase', letterSpacing: 0.8 },
  tip: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: '#e8f2ec', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(29,68,52,0.2)',
  },
  tipIcon: { fontSize: 18 },
  tipText: { flex: 1, fontSize: 13, color: '#1d4434', lineHeight: 20 },
});
