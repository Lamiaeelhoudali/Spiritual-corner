import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tasbeeh() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tasbeeh Counter</h1>
      <p style={styles.count}>{count}</p>
      <button style={styles.button} onClick={() => setCount((c) => c + 1)}>
        Tap to Count
      </button>
      <button style={styles.resetButton} onClick={() => setCount(0)}>Reset</button>
      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>Back to Home</button>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, minHeight: '100vh' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  count: { fontSize: 72, fontWeight: 'bold', marginBottom: 40 },
  button: { backgroundColor: '#2e7d32', color: '#ffffff', padding: '24px 48px', borderRadius: 100, border: 'none', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' },
  resetButton: { marginTop: 20, background: 'none', border: 'none', color: '#999999', fontWeight: '600', cursor: 'pointer' },
  backButton: { marginTop: 30, background: 'none', border: 'none', color: '#2e7d32', fontWeight: '600', cursor: 'pointer' },
};