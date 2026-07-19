import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewEntry() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Please enter both title and content.');
      return;
    }
    if (isLocked && pin.trim().length < 4) {
      setError('PIN must be at least 4 digits.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://spiritual-corner.onrender.com/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          isLocked,
          pin: isLocked ? pin.trim() : undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || 'Could not save journal entry.');
        return;
      }
      navigate('/journal');
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>New Entry</h1>
      <form onSubmit={handleSave} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <label style={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={isLocked}
            onChange={(e) => setIsLocked(e.target.checked)}
          />
          {' '}Lock this entry
        </label>
        {isLocked ? (
          <input
            style={styles.input}
            type="password"
            placeholder="Set PIN (min 4 digits)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        ) : null}
        {error ? <p style={styles.error}>{error}</p> : null}
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: 24, paddingTop: 80, maxWidth: 500, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column' },
  input: { border: '1px solid #dddddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  textarea: { border: '1px solid #dddddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16, minHeight: 120 },
  toggleLabel: { marginBottom: 12 },
  error: { color: '#cc0000', textAlign: 'center' },
  button: { backgroundColor: '#2e7d32', color: '#ffffff', padding: 14, borderRadius: 8, border: 'none', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' },
};
