import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Quran() {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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

  function playSurah(surah) {
    const paddedNumber = String(surah.number).padStart(3, '0');
    const uri = `https://ia800608.us.archive.org/31/items/alfirdwsiy1433_gmail_46799767979696767967469644696496799201706/${paddedNumber}.mp3`;
    setCurrentSurah(surah);
    if (audioRef.current) {
      audioRef.current.src = uri;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  function togglePlayPause() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quran</h1>

      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

      {currentSurah ? (
        <div style={styles.nowPlaying}>
          <p>Playing: {currentSurah.englishName}</p>
          <button style={styles.playPauseButton} onClick={togglePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      ) : null}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.list}>
          {surahs.map((item) => (
            <div key={item.number} style={styles.row} onClick={() => playSurah(item)}>
              {item.number}. {item.englishName}
            </div>
          ))}
        </div>
      )}

      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>Back to Home</button>
    </div>
  );
}

const styles = {
  container: { padding: 24, paddingTop: 80, maxWidth: 500, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  nowPlaying: { backgroundColor: '#e8f5e9', borderRadius: 8, padding: 12, marginBottom: 16, textAlign: 'center' },
  playPauseButton: { backgroundColor: '#2e7d32', color: '#ffffff', padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer' },
  list: { maxHeight: 500, overflowY: 'auto' },
  row: { borderBottom: '1px solid #eeeeee', padding: 12, cursor: 'pointer' },
  backButton: { marginTop: 16, background: 'none', border: 'none', color: '#2e7d32', fontWeight: '600', cursor: 'pointer' },
};