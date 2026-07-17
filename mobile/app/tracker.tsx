import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

type Prayers = {
  Fajr: boolean;
  Dhuhr: boolean;
  Asr: boolean;
  Maghrib: boolean;
  Isha: boolean;
};

export default function TrackerScreen() {
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
        setError('Please log in first');
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prayer, completed: newValue }),
      });
    } catch {
      setError('Could not save. Try again.');
    }
  }

  const prayerNames: (keyof Prayers)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Prayers</Text>
      {loading ? (
        <ActivityIndicator color="#2e7d32" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : prayers ? (
        prayerNames.map((name) => (
          <Pressable
            key={name}
            style={[styles.row, prayers[name] && styles.rowDone]}
            onPress={() => togglePrayer(name)}>
            <Text style={styles.rowText}>{prayers[name] ? '✅' : '⬜'} {name}</Text>
          </Pressable>
        ))
      ) : null}
      <Pressable style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80, backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 16 },
  error: { color: '#cc0000', textAlign: 'center' },
  row: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  rowDone: { backgroundColor: '#e8f5e9', borderColor: '#2e7d32' },
  rowText: { fontSize: 18, color: '#000000' },
  backButton: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#2e7d32', fontWeight: '600' },
});