import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function Journal() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch('https://spiritual-corner.onrender.com/journal', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        setError(data?.error || 'Could not load journal entries.');
        return;
      }
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/dashboard');
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Journal</h1>
      <Link to="/new-entry" style={styles.addButton}>+ New Entry</Link>
      <button style={styles.logoutButton} onClick={handleLogout}>Log Out</button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : entries.length === 0 ? (
        <p>No entries yet</p>
      ) : (
        entries.map((entry) => (
          <div
            key={entry.id}
            style={styles.entry}
            onClick={() => {
              if (entry.isLocked) navigate(`/unlock/${entry.id}?title=${encodeURIComponent(entry.title)}`);
            }}
          >
            <p style={styles.entryTitle}>{entry.title}</p>
            <p>{entry.isLocked ? '🔒 Locked (tap to unlock)' : entry.content}</p>
          </div>
        ))
      )}

      <BackButton />
    </div>
  );
}

const styles = {
  container: { padding: 24, paddingTop: 80, maxWidth: 600, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  addButton: { display: 'inline-block', backgroundColor: '#005f8c', color: '#ffffff', padding: 12, borderRadius: 8, marginBottom: 16, textAlign: 'center', textDecoration: 'none', width: '100%', boxSizing: 'border-box' },
  logoutButton: { backgroundColor: '#999999', color: '#ffffff', padding: 12, borderRadius: 8, border: 'none', marginBottom: 16, width: '100%', cursor: 'pointer' },
  error: { color: '#cc0000', textAlign: 'center' },
  entry: { border: '1px solid #dddddd', borderRadius: 8, padding: 12, marginBottom: 12, cursor: 'pointer' },
  entryTitle: { fontWeight: 'bold', marginBottom: 4 },
};