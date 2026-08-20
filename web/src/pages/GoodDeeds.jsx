import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WeekCalendar from '../components/WeekCalendar';

const DEEDS = [
  { key: 'helpedSomeone', label: 'Helped Someone' },
  { key: 'gaveCharity', label: 'Gave Charity' },
  { key: 'kindWord', label: 'A Kind Word' },
  { key: 'helpedFamily', label: 'Helped Family' },
  { key: 'smiled', label: 'Smiled' },
  { key: 'spokeNoIll', label: 'Spoke No Ill' },
  { key: 'withheldJudgment', label: 'Withheld Judgment' },
  { key: 'gentleWithMyself', label: 'Gentle With Myself' },
  { key: 'keptMyPeace', label: 'Kept My Peace' },
];

export default function GoodDeeds() {
  const navigate = useNavigate();
  const [deeds, setDeeds] = useState({});
  const [week, setWeek] = useState([]);

  useEffect(() => {
  async function init() {
    await loadToday();
    await loadWeek();
  }
  init();
}, []);

  async function loadToday() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDeeds(data.deeds || {});
    } catch {
      setDeeds({});
    }
  }

  async function loadWeek() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/week', {
        headers: { Authorization: `Bearer ${token}` },
      });
     const data = await res.json();
    console.log('Week API response:', data);
    setWeek(Array.isArray(data) ? data : []);
    } catch {
      setWeek([]);
    }
  }

  async function toggleLeaf(key) {
    const newValue = !deeds[key];
    setDeeds({ ...deeds, [key]: newValue });
    try {
      const token = localStorage.getItem('token');
      await fetch('https://spiritual-corner.onrender.com/gooddeeds/today', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deed: key, completed: newValue }),
      });
    } catch {
      // stays optimistically updated locally
    }
  }

  const calendarDays = week.map((entry) => ({
    date: entry.date,
    completed: Object.values(entry.deeds).filter(Boolean).length,
    total: DEEDS.length,
  }));

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Good Deeds</h1>
        <button style={styles.backButton} onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      <div style={styles.tree}>
        {DEEDS.map((d) => (
          <div
            key={d.key}
            style={{ ...styles.leaf, ...(deeds[d.key] ? styles.leafDone : {}) }}
            onClick={() => toggleLeaf(d.key)}
          >
            <p style={styles.leafText}>{deeds[d.key] ? '🌿' : '🍂'}</p>
            <p style={styles.leafLabel}>{d.label}</p>
          </div>
        ))}
      </div>

      <h2 style={styles.subtitle}>This Week</h2>
      {calendarDays.length > 0 ? (
        <WeekCalendar days={calendarDays} />
      ) : (
        <p>No history yet</p>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24, paddingTop: 60, maxWidth: 600, margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', margin: 0 },
  backButton: { background: 'none', border: 'none', color: '#005f8c', fontWeight: '600', cursor: 'pointer', fontSize: 16 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  tree: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  leaf: { width: 95, height: 95, borderRadius: 12, backgroundColor: '#e8dcc8', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 6, cursor: 'pointer', border: 'none' },
  leafDone: { backgroundColor: '#c8e6c9', border: '2px solid #005f8c' },
  leafText: { fontSize: 22, margin: 0 },
  leafLabel: { fontSize: 10, textAlign: 'center', marginTop: 2, color: '#000000', fontWeight: '600' },
};