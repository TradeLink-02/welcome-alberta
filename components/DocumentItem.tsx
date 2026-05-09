import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  id: string;
  name: string;
  whyNeeded: string;
  whereToGet: string;
  gathered: boolean;
  onToggle: () => void;
}

export function DocumentItem({ name, whyNeeded, whereToGet, gathered, onToggle }: Props) {
  return (
    <TouchableOpacity
      style={[styles.item, gathered && styles.itemGathered]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, gathered && styles.checkboxDone]}>
        {gathered && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <View style={styles.body}>
        <Text style={[styles.name, gathered && styles.nameDone]}>{name}</Text>
        <Text style={styles.why}>{whyNeeded}</Text>
        <Text style={styles.where}>Where to get: {whereToGet}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(26,26,24,0.1)',
  },
  itemGathered: { backgroundColor: '#e8f2ec', borderColor: 'rgba(29,68,52,0.2)' },
  checkbox: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: 'rgba(26,26,24,0.2)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  checkboxDone: { backgroundColor: '#1d4434', borderColor: '#1d4434' },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  body: { flex: 1, gap: 2 },
  name: { fontSize: 14, fontWeight: '600', color: '#1a1a18' },
  nameDone: { textDecorationLine: 'line-through', color: '#4a4a45' },
  why: { fontSize: 12, color: '#4a4a45' },
  where: { fontSize: 12, color: '#2d6652' },
});
