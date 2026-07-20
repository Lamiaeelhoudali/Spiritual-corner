import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { useTheme } from '../context/ThemeContext';

type Surah = {
  number: number;
  englishName: string;
  name: string;
};

type Ayah = {
  number: number;
  arabic: string;
};

export default function QuranScreen() {
  const { colors } = useTheme();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingText, setLoadingText] = useState(false);

  const player = useAudioPlayer(currentUri);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  useEffect(() => {
    loadSurahs();
  }, []);

  async function loadSurahs() {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();
      setSurahs(data.data);
    } catch {
      // list stays empty on failure
    } finally {
      setLoading(false);
    }
  }

  async function playSurah(surah: Surah) {
    const paddedNumber = String(surah.number).padStart(3, '0');
    const uri = `https://ia800608.us.archive.org/31/items/alfirdwsiy1433_gmail_46799767979696767967469644696496799201706/${paddedNumber}.mp3`;
    setCurrentUri(uri);
    setCurrentSurah(surah);
    setAyahs([]);
    setLoadingText(true);
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/quran-uthmani`);
      const data = await response.json();
      const merged = data.data.ayahs.map((a: any) => ({
        number: a.numberInSurah,
        arabic: a.text,
      }));
      setAyahs(merged);
    } catch {
      setAyahs([]);
    } finally {
      setLoadingText(false);
    }
  }

  useEffect(() => {
    if (currentUri) {
      player.play();
    }
  }, [player]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Quran</Text>

      {currentSurah ? (
        <View style={[styles.nowPlaying, { backgroundColor: colors.card }]}>
          <Text style={[styles.nowPlayingText, { color: colors.text }]}>Playing: {currentSurah.englishName}</Text>
          <Pressable
            style={styles.playPauseButton}
            onPress={() => (status.playing ? player.pause() : player.play())}>
            <Text style={styles.playPauseText}>{status.playing ? 'Pause' : 'Play'}</Text>
          </Pressable>
        </View>
      ) : null}

      {loadingText ? (
        <ActivityIndicator color="#2e7d32" style={{ marginBottom: 16 }} />
      ) : ayahs.length > 0 ? (
        <ScrollView style={styles.ayahList}>
          {ayahs.map((ayah) => (
            <View key={ayah.number} style={styles.ayahCard}>
              <Text style={styles.ayahArabic}>{ayah.number}. {ayah.arabic}</Text>
            </View>
          ))}
        </ScrollView>
      ) : null}

      {loading ? (
        <ActivityIndicator color="#2e7d32" />
      ) : (
        <FlatList
          data={surahs}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <Pressable style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => playSurah(item)}>
              <Text style={[styles.rowText, { color: colors.text }]}>{item.number}. {item.englishName}</Text>
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
  nowPlaying: { borderRadius: 8, padding: 12, marginBottom: 16, alignItems: 'center' },
  nowPlayingText: { fontSize: 16, marginBottom: 8 },
  playPauseButton: { backgroundColor: '#2e7d32', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  playPauseText: { color: '#ffffff', fontWeight: 'bold' },
  ayahList: { maxHeight: 250, marginBottom: 16 },
  ayahCard: { marginBottom: 10, padding: 12, borderRadius: 8, backgroundColor: '#f5f5f5' },
  ayahArabic: { fontSize: 20, textAlign: 'right', color: '#000000' },
  row: { borderBottomWidth: 1, paddingVertical: 12 },
  rowText: { fontSize: 16 },
  backButton: { marginTop: 16, alignItems: 'center' },
  backText: { color: '#2e7d32', fontWeight: '600' },
});