import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function Tracker() {
  const navigate = useNavigate();
  const [prayers, setPrayers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTracker();
  }, []);

  async function loadTracker() {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch('https://spiritual-corner.onrender.com/tracker/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || 'Could not load tracker');
        return;
      }
      setPrayers(data.prayers);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function togglePrayer(prayer) {
    const newValue = !prayers[prayer];
    setPrayers({ ...prayers, [prayer]: newValue });
    try {
      const token = localStorage.getItem('token');
      await fetch('https://spiritual-corner.onrender.com/tracker/today', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prayer, completed: newValue }),
      });
    } catch {
      setError('Could not save. Try again.');
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Today's Prayers</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : prayers ? (
        PRAYER_NAMES.map((name) => (
          <div
         key={name}
         style={{ ...styles.row, ...(prayers[name] ? styles.rowDone : {}) }}
         onClick={() => togglePrayer(name)}
>
         <span style={styles.checkbox}>{prayers[name] ? '✅' : '⬜'}</span>
         <span>{name}</span>
          </div>
        ))
      ) : null}
      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>Back to Home</button>
    </div>
  );
}

const styles = {
  container: { padding: 24, paddingTop: 80, maxWidth: 500, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  error: { color: '#cc0000', textAlign: 'center' },
  row: { display: 'flex', alignItems: 'center', border: '1px solid #dddddd', borderRadius: 8, padding: 14, marginBottom: 10, cursor: 'pointer', fontSize: 18 },
  checkbox: { display: 'inline-block', width: 28, textAlign: 'center', marginRight: 8 },
  rowDone: { backgroundColor: '#e8f5e9', borderColor: '#2e7d32' },
  backButton: { marginTop: 20, background: 'none', border: 'none', color: '#2e7d32', fontWeight: '600', cursor: 'pointer' },
};