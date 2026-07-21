import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../context/ThemeContext';

export default function NewEntryScreen() {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing fields', 'Please enter both title and content.');
      return;
    }
    if (isLocked && pin.trim().length < 4) {
      Alert.alert('Invalid PIN', 'PIN must be at least 4 digits.');
      return;
    }
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      Alert.alert('Session expired', 'Please log in again.');
      router.replace('/login');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('https://spiritual-corner.onrender.com/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          isLocked,
          pin: isLocked ? pin.trim() : undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        Alert.alert('Save failed', data?.error || 'Could not save journal entry.');
        return;
      }
      Alert.alert('Saved', 'Journal entry created successfully.');
      router.replace('/journal');
    } catch {
      Alert.alert('Network error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>New Entry</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Title"
        placeholderTextColor={colors.border}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border }]}
        placeholder="Write your thoughts..."
        placeholderTextColor={colors.border}
        multiline
        value={content}
        onChangeText={setContent}
      />
      <Pressable
        style={[styles.toggleButton, isLocked ? styles.toggleOn : styles.toggleOff]}
        onPress={() => setIsLocked((prev) => !prev)}>
        <Text style={styles.toggleText}>{isLocked ? '🔒 Locked Entry: ON' : '🔓 Locked Entry: OFF'}</Text>
      </Pressable>
      {isLocked ? (
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder="Set PIN (min 4 digits)"
          placeholderTextColor={colors.border}
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          secureTextEntry
        />
      ) : null}
      <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Entry'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  toggleButton: { padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  toggleOn: { backgroundColor: '#6a1b9a' },
  toggleOff: { backgroundColor: '#888888' },
  toggleText: { color: '#ffffff', fontWeight: 'bold' },
  button: { backgroundColor: '#005f8c', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  buttonDisabled: { backgroundColor: '#9e9e9e' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});