import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';
import WeekCalendar from '../components/WeekCalendar';

const DEEDS = [
  { key: 'helpedSomeone', label: 'Helped Someone' },
  { key: 'gaveCharity', label: 'Gave Charity' },
  { key: 'kindWord', label: 'A Kind Word' },
  { key: 'helpedFamily', label: 'Helped Family' },
  { key: 'smiled', label: 'Smiled' },
  { key: 'spokeNoIll', label: 'Spoke No Ill' },
  { key: 'withheldJudgment', label: 'Withheld Judgment' },
  { key: 'gentleWithMyself', label: 'Gentle With Myself' },
  { key: 'keptMyPeace', label: 'Kept My Peace' },
];

export default function GoodDeedsScreen() {
  const { colors } = useTheme();
  const [deeds, setDeeds] = useState<Record<string, boolean>>({});
  const [week, setWeek] = useState<any[]>([]);

 useFocusEffect(
  useCallback(() => {
    async function init() {
      await loadToday();
      await loadWeek();
    }
    init();
  }, [])
);

  async function loadToday() {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        router.replace('/login?redirect=/good-deeds' as any);
        return;
      }
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDeeds(data.deeds || {});
    } catch {
      setDeeds({});
    }
  }

  async function loadWeek() {
    try {
      const token = await SecureStore.getItemAsync('token');
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/week', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWeek(Array.isArray(data) ? data : []);
    } catch {
      setWeek([]);
    }
  }

  async function toggleLeaf(key: string) {
    const newValue = !deeds[key];
    setDeeds({ ...deeds, [key]: newValue });
    try {
      const token = await SecureStore.getItemAsync('token');
      await fetch('https://spiritual-corner.onrender.com/gooddeeds/today', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deed: key, completed: newValue }),
      });
    } catch {
      // stays optimistically updated locally even if save fails
    }
  }

  const calendarDays = week.map((entry) => ({
    date: entry.date,
    completed: Object.values(entry.deeds).filter(Boolean).length,
    total: DEEDS.length,
  }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>Good Deeds</Text>
        <BackButton label="← Back" />
      </View>

      <View style={styles.tree}>
        {DEEDS.map((d) => (
          <Pressable
            key={d.key}
            style={[styles.leaf, deeds[d.key] && styles.leafDone]}
            onPress={() => toggleLeaf(d.key)}
          >
            <Text style={styles.leafText}>{deeds[d.key] ? '🌿' : '🍂'}</Text>
            <Text style={styles.leafLabel}>{d.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.subtitle, { color: colors.text }]}>This Week</Text>
      {calendarDays.length > 0 ? (
        <WeekCalendar days={calendarDays} />
      ) : (
        <Text style={{ color: colors.text }}>No history yet</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  tree: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  leaf: { width: 95, height: 95, borderRadius: 12, backgroundColor: '#e8dcc8', justifyContent: 'center', alignItems: 'center', padding: 6 },
  leafDone: { backgroundColor: '#c8e6c9', borderWidth: 2, borderColor: '#005f8c' },
  leafText: { fontSize: 22 },
  leafLabel: { fontSize: 10, textAlign: 'center', marginTop: 2, color: '#000000', fontWeight: '600' },
});