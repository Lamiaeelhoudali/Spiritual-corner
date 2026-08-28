import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { treeHtml } from '../assets/treeHtml';

export default function GoodDeeds() {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    function handleMessage(event) {
      handleTreeMessage(event.data);
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  async function fetchToday() {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return [];
    }
    try {
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data.deeds || [];
    } catch {
      return [];
    }
  }

  function pushDeeds(deeds) {
    iframeRef.current?.contentWindow?.setDeeds(deeds);
  }

  async function handleTreeMessage(msg) {
    const token = localStorage.getItem('token');

    if (msg.type === 'READY') {
      pushDeeds(await fetchToday());
    }
    if (msg.type === 'ADD_DEED') {
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: msg.text }),
      });
      pushDeeds((await res.json()).deeds || []);
    }
    if (msg.type === 'TOGGLE_DEED') {
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deedId: msg.deedId }),
      });
      pushDeeds((await res.json()).deeds || []);
    }
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>← Back</button>
      <iframe
        ref={iframeRef}
        srcDoc={treeHtml}
        style={styles.iframe}
        title="Good Deeds Tree"
        onLoad={() => setIframeReady(true)}
      />
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh' },
  backButton: { alignSelf: 'flex-end', margin: 16, background: 'none', border: 'none', color: '#005f8c', fontWeight: '600', cursor: 'pointer', fontSize: 16 },
  iframe: { flex: 1, border: 'none', width: '100%' },
};