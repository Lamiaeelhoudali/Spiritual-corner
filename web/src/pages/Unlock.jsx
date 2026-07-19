import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function Unlock() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const title = searchParams.get('title');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [content, setContent] = useState('');

  async function handleUnlock(e) {
    e.preventDefault();
    setError('');
    setContent('');

    if (!pin.trim()) {
      setError('Please enter your PIN');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://spiritual-corner.onrender.com/journal/${id}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pin: pin.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || 'Unlock failed');
        return;
      }
      setContent(data?.content || 'Unlocked successfully.');
    } catch {
      setError('Could not connect to server');
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{title || 'Unlock Entry'}</h1>
      <form onSubmit={handleUnlock} style={styles.form}>
        <input
          style={styles.input}
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        {error ? <p style={styles.error}>{error}</p> : null}
        {content ? <p style={styles.content}>{content}</p> : null}
        <button style={styles.button} type="submit">Unlock</button>
      </form>
      <button style={styles.backButton} onClick={() => navigate('/journal')}>Back to Journal</button>
    </div>
  );
}

const styles = {
  container: { padding: 24, paddingTop: 80, maxWidth: 500, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column' },
  input: { border: '1px solid #dddddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  error: { color: '#cc0000', textAlign: 'center' },
  content: { backgroundColor: '#f3f3f3', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2e7d32', color: '#ffffff', padding: 12, borderRadius: 8, border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  backButton: { marginTop: 12, background: 'none', border: 'none', color: '#2e7d32', fontWeight: '600', cursor: 'pointer' },
};