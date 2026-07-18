import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

type Surah = {
  number: number;
  englishName: string;
  name: string;
};

export default function QuranScreen() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);

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

  function playSurah(surah: Surah) {
    const paddedNumber = String(surah.number).padStart(3, '0');
    const uri = `https://ia800608.us.archive.org/31/items/alfirdwsiy1433_gmail_46799767979696767967469644696496799201706/${paddedNumber}.mp3`;
    setCurrentUri(uri);
    setCurrentSurah(surah);
  }

  useEffect(() => {
    if (currentUri) {
      player.play();
    }
  }, [player]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quran</Text>

      {currentSurah ? (
        <View style={styles.nowPlaying}>
          <Text style={styles.nowPlayingText}>Playing: {currentSurah.englishName}</Text>
    
          <Pressable
            style={styles.playPauseButton}
            onPress={() => (status.playing ? player.pause() : player.play())}>
            <Text style={styles.playPauseText}>{status.playing ? '⏸ Pause' : '▶ Play'}</Text>
          </Pressable>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator color="#2e7d32" />
      ) : (
        <FlatList
          data={surahs}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => playSurah(item)}>
              <Text style={styles.rowText}>{item.number}. {item.englishName}</Text>
            </Pressable>
          )}
        />
      )}

      <Pressable style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80, backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 16 },
  nowPlaying: { backgroundColor: '#e8f5e9', borderRadius: 8, padding: 12, marginBottom: 16, alignItems: 'center' },
  nowPlayingText: { fontSize: 16, color: '#000000', marginBottom: 8 },
  playPauseButton: { backgroundColor: '#2e7d32', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  playPauseText: { color: '#ffffff', fontWeight: 'bold' },
  row: { borderBottomWidth: 1, borderBottomColor: '#eeeeee', paddingVertical: 12 },
  rowText: { fontSize: 16, color: '#000000' },
  backButton: { marginTop: 16, alignItems: 'center' },
  backText: { color: '#2e7d32', fontWeight: '600' },
});