import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, RefreshControl,
} from 'react-native';
import { useState } from 'react';
import { useServices } from '../../hooks/useOfflineContent';
import { useProgressStore } from '../../store/useProgressStore';
import { ServiceCard } from '../../components/ServiceCard';
import type { ServiceCategory } from '../../types/Service';

const CATEGORIES: { key: ServiceCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'settlement', label: 'Settlement' },
  { key: 'health', label: 'Health' },
  { key: 'legal', label: 'Legal' },
  { key: 'housing', label: 'Housing' },
  { key: 'food', label: 'Food' },
  { key: 'employment', label: 'Employment' },
  { key: 'language', label: 'Language' },
];

export default function ServicesScreen() {
  const { data: services = [], isLoading, refetch } = useServices();
  const { savedServices, toggleSavedService } = useProgressStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [showSaved, setShowSaved] = useState(false);

  const filtered = services.filter((s) => {
    const matchesSearch =
      search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.languagesServed.some((l) => l.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSaved = !showSaved || savedServices.includes(s.id);
    return matchesSearch && matchesCategory && matchesSaved;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <Text style={styles.subtitle}>Edmonton settlement resources</Text>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or language…"
          placeholderTextColor="#8a8a80"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.chip, activeCategory === cat.key && styles.chipActive]}
            onPress={() => setActiveCategory(cat.key)}
          >
            <Text style={[styles.chipText, activeCategory === cat.key && styles.chipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.chip, showSaved && styles.chipSaved]}
          onPress={() => setShowSaved(!showSaved)}
        >
          <Text style={[styles.chipText, showSaved && styles.chipTextSaved]}>★ Saved</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#1d4434" />}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No services found</Text>
            <Text style={styles.emptyHint}>Try a different search or category</Text>
          </View>
        ) : (
          filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              saved={savedServices.includes(service.id)}
              onSaveToggle={() => toggleSavedService(service.id)}
            />
          ))
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Data last reviewed May 2026. Always call ahead to confirm hours.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f2eb' },
  header: { backgroundColor: '#1d4434', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, gap: 6 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 6 },
  search: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 14,
  },
  chipRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: {
    borderRadius: 100, paddingHorizontal: 14, paddingVertical: 6,
    backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(26,26,24,0.12)',
  },
  chipActive: { backgroundColor: '#1d4434', borderColor: '#1d4434' },
  chipSaved: { backgroundColor: '#fdf3e3', borderColor: 'rgba(200,146,42,0.3)' },
  chipText: { fontSize: 13, color: '#4a4a45', fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  chipTextSaved: { color: '#c8922a' },
  list: { padding: 16, gap: 12 },
  empty: { paddingTop: 40, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#4a4a45' },
  emptyHint: { fontSize: 14, color: '#8a8a80' },
  footer: { paddingTop: 8 },
  footerText: { fontSize: 11, color: '#8a8a80', textAlign: 'center' },
});
