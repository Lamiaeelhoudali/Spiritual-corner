import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../context/ThemeContext';

type Entry = {
  id: string;
  title: string;
  content: string;
  isLocked: boolean;
};

export default function JournalScreen() {
  const { colors } = useTheme();
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
        router.replace('/login?redirect=/journal');
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

  async function handleLogout() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('name');
    router.replace('/dashboard');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Journal</Text>
      <Pressable style={styles.addButton} onPress={() => router.push('/new-entry')}>
        <Text style={styles.addButtonText}>+ New Entry</Text>
      </Pressable>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.addButtonText}>Log Out</Text>
      </Pressable>
      {loading ? (
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 40 }}>Loading...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : entries.length === 0 ? (
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 40 }}>No entries yet</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.entry, { borderColor: colors.border }]}
              onPress={() => {
                if (item.isLocked) router.push(`/unlock/${item.id}?title=${encodeURIComponent(item.title)}`);
              }}>
              <Text style={[styles.entryTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={{ color: colors.text }}>
                {item.isLocked ? '🔒 Locked (tap to unlock)' : item.content}
              </Text>
            </Pressable>
          )}
        />
      )}
      <Pressable style={styles.backButton} onPress={() => router.push('/dashboard')}>
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  addButton: { backgroundColor: '#005f8c', padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  addButtonText: { color: '#ffffff', fontWeight: 'bold' },
  error: { color: '#cc0000', textAlign: 'center', marginTop: 40 },
  entry: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  entryTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  backButton: { marginTop: 16, alignItems: 'center' },
  backText: { color: '#005f8c', fontWeight: '600' },
  logoutButton: { backgroundColor: '#999999', padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
});