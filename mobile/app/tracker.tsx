import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../context/ThemeContext';

type Prayers = {
  Fajr: boolean;
  Dhuhr: boolean;
  Asr: boolean;
  Maghrib: boolean;
  Isha: boolean;
};

export default function TrackerScreen() {
  const { colors } = useTheme();
  const [prayers, setPrayers] = useState<Prayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadTracker();
    }, [])
  );

  async function loadTracker() {
    setLoading(true);
    setError('');
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        router.replace('/login?redirect=/tracker');
        return;
      }
      const response = await fetch('https://spiritual-corner.onrender.com/tracker/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || 'Could not load tracker');
        return;
      }
      setPrayers(data.prayers);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function togglePrayer(prayer: keyof Prayers) {
    if (!prayers) return;
    const newValue = !prayers[prayer];
    setPrayers({ ...prayers, [prayer]: newValue });
    try {
      const token = await SecureStore.getItemAsync('token');
      await fetch('https://spiritual-corner.onrender.com/tracker/today', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prayer, completed: newValue }),
      });
    } catch {
      setError('Could not save. Try again.');
    }
  }

  const prayerNames: (keyof Prayers)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Today's Prayers</Text>
      {loading ? (
        <ActivityIndicator color="#2e7d32" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : prayers ? (
        prayerNames.map((name) => (
          <Pressable
            key={name}
            style={[styles.row, { borderColor: colors.border }, prayers[name] && styles.rowDone]}
            onPress={() => togglePrayer(name)}>
            <Text style={[styles.rowText, { color: prayers[name] ? '#000000' : colors.text }]}>
              {prayers[name] ? '✅' : '⬜'} {name}
            </Text>
          </Pressable>
        ))
      ) : null}
        <Pressable style={styles.backButton} onPress={() => router.push('/dashboard')}>
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  error: { color: '#cc0000', textAlign: 'center' },
  row: { borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 10 },
  rowDone: { backgroundColor: '#e8f5e9', borderColor: '#2e7d32' },
  rowText: { fontSize: 18 },
  backButton: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#2e7d32', fontWeight: '600' },
});