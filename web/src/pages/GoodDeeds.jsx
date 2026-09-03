import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function GoodDeeds() {
  const navigate = useNavigate();
  const [deeds, setDeeds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    loadToday();
  }, []);

  async function loadToday() {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDeeds(data.deeds || []);
    } catch {
      setDeeds([]);
    }
  }

  async function addDeed() {
    if (!inputValue.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: inputValue.trim() }),
      });
      const data = await res.json();
      setDeeds(data.deeds || []);
      setInputValue('');
      setShowModal(false);
    } catch (err) {
      alert('Error: ' + String(err));
    }
  }

  async function toggleDeed(deedId) {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deedId }),
      });
      const data = await res.json();
      setDeeds(data.deeds || []);
    } catch {
      // no local fallback
    }
  }

  const grownCount = deeds.filter((d) => d.completed).length;

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Good Deeds</h1>
        <BackButton label="← Back" />
      </div>
      <p style={styles.subtitle}>
        Every deed is a step closer to God. Add one, then tap it when it's done.
      </p>

      <div style={styles.canopy}>
        {deeds.map((d) => (
          <div
            key={d._id}
            style={{ ...styles.deedBox, ...(d.completed ? styles.deedBoxGrown : {}) }}
            onClick={() => toggleDeed(d._id)}
          >
            <span style={{ ...styles.deedText, ...(d.completed ? styles.deedTextGrown : {}) }}>
              {d.text}
            </span>
          </div>
        ))}
        <div style={styles.addTile} onClick={() => setShowModal(true)}>
          <span style={styles.addTileText}>+</span>
        </div>
      </div>

      <div style={styles.trunk} />

      <p style={styles.progress}>
        {grownCount} grown · {deeds.length} deeds
      </p>

      {showModal ? (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <p style={styles.modalTitle}>Enter your good deed:</p>
            <input
              style={styles.modalInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. Helped a neighbor"
              autoFocus
              maxLength={60}
              onKeyDown={(e) => e.key === 'Enter' && addDeed()}
            />
            <div style={styles.modalActions}>
              <button style={styles.modalCancel} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button style={styles.modalConfirm} onClick={addDeed}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  container: { padding: 24, paddingTop: 60, maxWidth: 'clamp(340px, 80vw, 700px)', margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', margin: 0 },
  subtitle: { fontSize: 13, fontStyle: 'italic', textAlign: 'center', marginBottom: 20, color: '#4A2E1E' },
  canopy: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', gap: 12 },
  deedBox: {
    width: 110, minHeight: 65, padding: 8, borderRadius: 10,
    border: '2px solid #8A6E45', backgroundColor: '#C9A876',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    cursor: 'pointer', boxSizing: 'border-box',
  },
  deedBoxGrown: { backgroundColor: '#4C8C3C', borderColor: '#33611F' },
  deedText: { fontSize: 12, textAlign: 'center', color: '#2A211A' },
  deedTextGrown: { color: '#ffffff' },
  addTile: {
    width: 110, minHeight: 65, borderRadius: 10,
    border: '2px dashed #B9AD93',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    cursor: 'pointer', boxSizing: 'border-box',
  },
  addTileText: { fontSize: 26, fontWeight: 'bold', color: '#B9AD93' },
  trunk: { width: 50, height: 70, backgroundColor: '#4A2E1E', borderRadius: 6, margin: '4px auto 0' },
  progress: { textAlign: 'center', fontSize: 13, marginTop: 12, marginBottom: 30 },
  modalOverlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(42,33,26,0.45)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  modalBox: { backgroundColor: '#fff', borderRadius: 14, padding: 22, width: '100%', maxWidth: 340, boxSizing: 'border-box' },
  modalTitle: { fontSize: 16, marginBottom: 14, color: '#2A211A' },
  modalInput: {
    border: '1px solid #8A6E45', borderRadius: 8, padding: 10, marginBottom: 16,
    fontSize: 16, width: '100%', boxSizing: 'border-box',
  },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10 },
  modalCancel: {
    padding: '8px 16px', borderRadius: 999, border: '1px solid #4A2E1E',
    background: 'none', color: '#4A2E1E', cursor: 'pointer',
  },
  modalConfirm: {
    padding: '8px 16px', borderRadius: 999, border: 'none',
    backgroundColor: '#4A2E1E', color: '#fff', cursor: 'pointer',
  },
};