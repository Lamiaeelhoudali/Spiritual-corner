import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { homeBackgroundImage } from '../../context/ThemeContext';

export default function HomeScreen() {
  return (
    <ImageBackground source={homeBackgroundImage} style={styles.container} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.titleEnglish}>Spiritual Corner</Text>
        <Text style={styles.titleArabic}>الركن الروحي</Text>

        <Pressable style={styles.button} onPress={() => router.push('/dashboard')}>
          <Text style={styles.buttonText}>Enter</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.35)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 24,
  paddingTop: 60,
  paddingBottom: 60,
},
  titleEnglish: { fontSize: 30, fontWeight: 'bold', color: '#ffffff', marginBottom: 8, textAlign: 'center' },
  titleArabic: { fontSize: 26, fontWeight: 'bold', color: '#ffffff', marginBottom: 40, textAlign: 'center' },
  button: { backgroundColor: '#2e7d32', paddingVertical: 14, paddingHorizontal: 48, borderRadius: 8, marginTop: 300 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
});