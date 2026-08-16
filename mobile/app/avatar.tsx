import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import BackButton from '../components/BackButton';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../context/ThemeContext';

const AVATARS = ['🕌', '🌙', '⭐', '📿', '🤲', '🕋'];

export default function AvatarScreen() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState('🕌');

  useEffect(() => {
    SecureStore.getItemAsync('avatar').then((saved) => {
      if (saved) setSelected(saved);
    });
  }, []);

  async function selectAvatar(avatar: string) {
    setSelected(avatar);
    await SecureStore.setItemAsync('avatar', avatar);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Choose Your Avatar</Text>
      <Text style={styles.currentAvatar}>{selected}</Text>
      <View style={styles.grid}>
        {AVATARS.map((avatar) => (
          <Pressable
            key={avatar}
            style={[styles.avatarButton, { borderColor: colors.border }, selected === avatar && styles.selected]}
            onPress={() => selectAvatar(avatar)}
          >
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </Pressable>
        ))}
      </View>
       <Pressable style={styles.backButton} onPress={() => router.push('/dashboard')}>
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, paddingTop: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 16 },
  currentAvatar: { fontSize: 80, marginBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 30 },
  avatarButton: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  selected: { borderColor: '#005f8c', borderWidth: 3 },
  avatarEmoji: { fontSize: 32 },
  backButton: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#005f8c', fontWeight: '600' },
});