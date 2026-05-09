import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import type { Service, ServiceCategory } from '../types/Service';

const CATEGORY_COLORS: Record<ServiceCategory, { bg: string; text: string }> = {
  settlement: { bg: '#e8f2ec', text: '#1d4434' },
  health: { bg: '#e8f0f7', text: '#2a5c8a' },
  legal: { bg: '#fbeee9', text: '#b54a2c' },
  housing: { bg: '#fdf3e3', text: '#c8922a' },
  food: { bg: '#f0f0f8', text: '#5a4aaa' },
  employment: { bg: '#e8f2ec', text: '#2d6652' },
  language: { bg: '#e8f0f7', text: '#2a5c8a' },
  other: { bg: '#f5f2eb', text: '#4a4a45' },
};

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  settlement: 'Settlement',
  health: 'Health',
  legal: 'Legal',
  housing: 'Housing',
  food: 'Food',
  employment: 'Employment',
  language: 'Language',
  other: 'Other',
};

interface Props {
  service: Service;
  saved?: boolean;
  onSaveToggle?: () => void;
}

export function ServiceCard({ service, saved, onSaveToggle }: Props) {
  const colors = CATEGORY_COLORS[service.category];

  function call() {
    Linking.openURL(`tel:${service.phone.replace(/\D/g, '')}`);
  }

  function directions() {
    const addr = encodeURIComponent(service.address);
    Linking.openURL(`https://maps.apple.com/?q=${addr}`).catch(() =>
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${addr}`)
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.categoryText, { color: colors.text }]}>
            {CATEGORY_LABELS[service.category]}
          </Text>
        </View>
        {onSaveToggle && (
          <TouchableOpacity onPress={onSaveToggle} style={styles.saveBtn}>
            <Text style={styles.saveIcon}>{saved ? '★' : '☆'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.name}>{service.name}</Text>
      <Text style={styles.description} numberOfLines={3}>{service.description}</Text>

      <View style={styles.details}>
        <Text style={styles.detailRow}>📍 {service.address}</Text>
        <Text style={styles.detailRow}>📞 {service.phone}</Text>
        {service.languagesServed.length > 0 && (
          <Text style={styles.detailRow}>🗣 {service.languagesServed.join(' · ')}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={call} activeOpacity={0.7}>
          <Text style={styles.actionBtnText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={directions} activeOpacity={0.7}>
          <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>📍 Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(26,26,24,0.1)',
    padding: 16, gap: 10,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 },
  categoryText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  saveBtn: { padding: 4 },
  saveIcon: { fontSize: 20, color: '#c8922a' },
  name: { fontSize: 16, fontWeight: '700', color: '#1a1a18', lineHeight: 22 },
  description: { fontSize: 13, color: '#4a4a45', lineHeight: 20 },
  details: { gap: 4 },
  detailRow: { fontSize: 13, color: '#4a4a45' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: {
    flex: 1, backgroundColor: '#1d4434', borderRadius: 10,
    paddingVertical: 10, alignItems: 'center',
  },
  actionBtnSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1d4434' },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  actionBtnTextSecondary: { color: '#1d4434' },
});
