import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {
  const [name, setName] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      SecureStore.getItemAsync('name').then(setName);
    }, [])
  );

  async function handleLogout() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('name');
    setName(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spiritual Corner</Text>
      {name ? (
        <>
          <Text style={styles.welcome}>Welcome back, {name}</Text>

          <Pressable style={styles.button} onPress={() => router.push('/journal')}>
            <Text style={styles.buttonText}>My Journal</Text>
          </Pressable>

          <Pressable style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </Pressable>
        </>
      ) : (
        <Pressable style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 24 },
  welcome: { fontSize: 18, color: '#000000', marginBottom: 16 },
  button: { backgroundColor: '#2e7d32', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  logoutButton: { marginTop: 12, backgroundColor: '#555555' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
