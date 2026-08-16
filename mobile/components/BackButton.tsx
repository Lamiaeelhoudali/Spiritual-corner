import { Pressable, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

type BackButtonProps = {
  to?: string;
  label?: string;
};

export default function BackButton({ to = '/dashboard', label = 'Back to Home' }: BackButtonProps) {
  return (
    <Pressable style={styles.backButton} onPress={() => router.push(to as any)}>
      <Text style={styles.backText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: { marginTop: 16, alignItems: 'center' },
  backText: { color: '#005f8c', fontWeight: '600' },
});