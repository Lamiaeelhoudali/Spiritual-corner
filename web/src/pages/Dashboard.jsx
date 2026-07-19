import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [name, setName] = useState(null);
  const [timings, setTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [prayerError, setPrayerError] = useState('');
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setName(localStorage.getItem('name'));
    loadPrayerTimes();
  }, []);

  function loadPrayerTimes() {
    setLoadingPrayers(true);
    setPrayerError('');
    if (!navigator.geolocation) {
      setPrayerError('Location not supported by this browser');
      setLoadingPrayers(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const today = new Date();
          const dateStr = String(today.getDate()).padStart(2, '0') + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + today.getFullYear();
          const response = await fetch(
            `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}`
          );
          const data = await response.json();
          if (data.code !== 200) {
            setPrayerError('Could not load prayer times');
            return;
          }
          setTimings(data.data.timings);
          const hijri = data.data.date.hijri;
          setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
        } catch {
          setPrayerError('Could not load prayer times');
        } finally {
          setLoadingPrayers(false);
        }
      },
      () => {
        setPrayerError('Location permission denied');
        setLoadingPrayers(false);
      }
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.prayerBox}>
        {loadingPrayers ? (
          <p>Loading...</p>
        ) : prayerError ? (
          <p style={styles.error}>{prayerError}</p>
        ) : timings ? (
          <>
            {hijriDate ? <p style={styles.hijriText}>{hijriDate}</p> : null}
            <p>Fajr (الفجر): {timings.Fajr}</p>
            <p>Dhuhr (الظهر): {timings.Dhuhr}</p>
            <p>Asr (العصر): {timings.Asr}</p>
            <p>Maghrib (المغرب): {timings.Maghrib}</p>
            <p>Isha (العشاء): {timings.Isha}</p>
          </>
        ) : null}
      </div>

      <button style={styles.button} onClick={() => navigate('/qibla')}>Qibla</button>
      <button style={styles.button} onClick={() => navigate('/quran')}>Quran</button>
      <button style={styles.button} onClick={() => navigate('/journal')}>My Journal</button>
      <button style={styles.button} onClick={() => navigate('/tracker')}>Prayer Tracker</button>
      <button style={styles.button} onClick={() => navigate('/avatar')}>Avatar</button>

      {name ? <p style={styles.welcome}>Welcome back, {name}</p> : null}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, minHeight: '100vh', backgroundColor: '#ffffff' },
  prayerBox: { marginBottom: 24, padding: 16, borderRadius: 12, backgroundColor: '#f5f5f5', textAlign: 'center' },
  hijriText: { color: '#2e7d32', fontWeight: '600' },
  error: { color: '#cc0000' },
  welcome: { fontSize: 18, marginTop: 16 },
  button: { backgroundColor: '#2e7d32', color: '#ffffff', padding: '12px 32px', borderRadius: 8, border: 'none', fontWeight: 'bold', fontSize: 16, marginBottom: 8, cursor: 'pointer', width: 250 },
};
