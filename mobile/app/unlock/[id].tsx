import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../context/ThemeContext';

export default function UnlockEntryScreen() {
  const { colors } = useTheme();
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [content, setContent] = useState('');

  async function handleUnlock() {
    setError('');
    setContent('');
    if (!id) {
      setError('Entry id is missing');
      return;
    }
    if (!pin.trim()) {
      setError('Please enter your PIN');
      return;
    }
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        setError('Please log in first');
        router.replace('/login');
        return;
      }
      const response = await fetch(`https://spiritual-corner.onrender.com/journal/${id}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pin: pin.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || 'Unlock failed');
        return;
      }
      setContent(data?.content || 'Unlocked successfully.');
    } catch {
      setError('Could not connect to server');
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title || 'Unlock Entry'}</Text>

      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Enter PIN"
        placeholderTextColor={colors.border}
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="number-pad"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {content ? <Text style={[styles.content, { color: colors.text, backgroundColor: colors.card }]}>{content}</Text> : null}

      <Pressable style={styles.button} onPress={handleUnlock}>
        <Text style={styles.buttonText}>Unlock</Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => router.push('/journal')}>
        <Text style={styles.backText}>Back to Journal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  error: { color: '#cc0000', marginBottom: 10, textAlign: 'center' },
  content: { borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
  backButton: { marginTop: 12, alignItems: 'center' },
  backText: { color: '#2e7d32', fontWeight: '600' },
});