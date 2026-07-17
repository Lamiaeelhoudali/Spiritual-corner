import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

type Entry = {
  id: string;
  title: string;
  content: string;
  isLocked: boolean;
};

export default function JournalScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  async function loadEntries() {
    setLoading(true);
    setError('');
    try {
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        setError('Please log in first.');
        setEntries([]);
        return;
      }

      const response = await fetch('https://spiritual-corner.onrender.com/journal', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        setError(data?.error || 'Could not load journal entries.');
        setEntries([]);
        return;
      }

      setEntries(Array.isArray(data) ? data : []);
    } catch {
      setError('Network error. Please try again.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Journal</Text>
      <Pressable style={styles.addButton} onPress={() => router.push('/new-entry')}>
        <Text style={styles.addButtonText}>+ New Entry</Text>
      </Pressable>
      {loading ? (
        <Text style={styles.empty}>Loading...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : entries.length === 0 ? (
        <Text style={styles.empty}>No entries yet</Text>
      ) : (
        <FlatList
         data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.entry}
              onPress={() => {
                if (item.isLocked) router.push(`/unlock/${item.id}?title=${encodeURIComponent(item.title)}`);
              }}>
              <Text style={styles.entryTitle}>{item.title}</Text>
              <Text style={styles.entryContent}>
                {item.isLocked ? '🔒 Locked (tap to unlock)' : item.content}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 24, paddingTop: 80 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 16 },
  addButton: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  addButtonText: { color: '#ffffff', fontWeight: 'bold' },
  empty: { color: '#666666', textAlign: 'center', marginTop: 40 },
  error: { color: '#cc0000', textAlign: 'center', marginTop: 40 },
  entry: { borderWidth: 1, borderColor: '#dddddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  entryTitle: { fontWeight: 'bold', fontSize: 16, color: '#000000', marginBottom: 4 },
  entryContent: { color: '#333333' },
});