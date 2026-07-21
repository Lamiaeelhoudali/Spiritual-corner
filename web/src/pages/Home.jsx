import { useNavigate } from 'react-router-dom';
import homeImg from '../assets/home.jpg';

export default function Home() {
  const navigate = useNavigate();

  return (
   <div style={styles.container}>
  <h1 style={styles.titleEnglish}>Spiritual Corner</h1>
  <h2 style={styles.titleArabic}>الركن الروحي</h2>
  <button style={styles.button} onClick={() => navigate('/dashboard')}>
    Enter
  </button>
</div> 
  );
}

const styles = {
  container: {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100%',
  position: 'relative',
  paddingBottom: 60,
  backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${homeImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'top center',
  color: '#ffffff',

  },
  titleEnglish: { fontSize: 32, marginBottom: 4, color: '#ffffff' },
  titleArabic: { fontSize: 26, marginBottom: 40, color: '#ffffff' },
  button: {
  backgroundColor: '#005f8c',
  color: '#ffffff',
  padding: '14px 48px',
  borderRadius: 8,
  border: 'none',
  fontSize: 18,
  fontWeight: 'bold',
  cursor: 'pointer',
  position: 'absolute',
  bottom: 100,
  left: '50%',
  transform: 'translateX(-50%)',
},
};