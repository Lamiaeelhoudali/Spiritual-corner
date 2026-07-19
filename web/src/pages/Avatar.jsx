import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AVATARS = ['🕌', '🌙', '⭐', '📿', '🤲', '🕋'];

export default function Avatar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('🕌');

  useEffect(() => {
    const saved = localStorage.getItem('avatar');
    if (saved) setSelected(saved);
  }, []);

  function selectAvatar(avatar) {
    setSelected(avatar);
    localStorage.setItem('avatar', avatar);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose Your Avatar</h1>
      <p style={styles.currentAvatar}>{selected}</p>
      <div style={styles.grid}>
        {AVATARS.map((avatar) => (
          <button
            key={avatar}
            style={{ ...styles.avatarButton, ...(selected === avatar ? styles.selected : {}) }}
            onClick={() => selectAvatar(avatar)}
          >
            {avatar}
          </button>
        ))}
      </div>
      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>Back to Home</button>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  currentAvatar: { fontSize: 80, marginBottom: 30 },
  grid: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 30, maxWidth: 300 },
  avatarButton: { width: 70, height: 70, borderRadius: '50%', border: '2px solid #dddddd', fontSize: 32, backgroundColor: '#ffffff', cursor: 'pointer' },
  selected: { borderColor: '#2e7d32', borderWidth: 3 },
  backButton: { marginTop: 20, background: 'none', border: 'none', color: '#2e7d32', fontWeight: '600', cursor: 'pointer' },
};