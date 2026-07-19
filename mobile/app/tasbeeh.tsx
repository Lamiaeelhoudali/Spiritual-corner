import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function TasbeehScreen() {
  const { colors } = useTheme();
  const [count, setCount] = useState(0);

  function increment() {
    setCount((prev) => prev + 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Tasbeeh Counter</Text>
      <Text style={[styles.count, { color: colors.text }]}>{count}</Text>
      <Pressable style={styles.button} onPress={increment}>
        <Text style={styles.buttonText}>Tap to Count</Text>
      </Pressable>
      <Pressable style={styles.resetButton} onPress={reset}>
        <Text style={styles.resetText}>Reset</Text>
      </Pressable>
      <Pressable style={styles.backButton} onPress={() => router.push('/dashboard')}>
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  count: { fontSize: 72, fontWeight: 'bold', marginBottom: 40 },
  button: { backgroundColor: '#2e7d32', paddingVertical: 24, paddingHorizontal: 48, borderRadius: 100 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
  resetButton: { marginTop: 20, padding: 10 },
  resetText: { color: '#999999', fontWeight: '600' },
  backButton: { marginTop: 30, alignItems: 'center' },
  backText: { color: '#2e7d32', fontWeight: '600' },
});