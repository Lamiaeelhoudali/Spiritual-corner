import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayImg from '../assets/day.jpg';
import nightImg from '../assets/night.jpg';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function getBackgroundImage() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? dayImg : nightImg;
}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad) {
  return (rad * 180) / Math.PI;
}

function calculateQiblaBearing(lat, lng) {
  const phi1 = toRadians(lat);
  const phi2 = toRadians(KAABA_LAT);
  const deltaLambda = toRadians(KAABA_LNG - lng);
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  return (toDegrees(theta) + 360) % 360;
}

export default function Qibla() {
  const navigate = useNavigate();
  const [bearing, setBearing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Location not supported by this browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setBearing(calculateQiblaBearing(latitude, longitude));
      },
      () => setError('Location permission denied')
    );
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Qibla Direction</h1>
      {error ? (
        <p style={styles.error}>{error}</p>
      ) : bearing === null ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={styles.arrowCircle}>
            <div style={{ ...styles.arrow, transform: `rotate(${bearing}deg)` }}>↑</div>
          </div>
          <p style={styles.bearingText}>{Math.round(bearing)}° from North</p>
          <p style={styles.hint}>
            Use a physical compass or your phone's compass app, and turn until it points {Math.round(bearing)}° from North.
          </p>
        </>
      )}
      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>Back to Home</button>
    </div>
  );
}

const styles = {
  container: {
    padding: 24,
    paddingTop: 80,
    minHeight: '100vh',
    textAlign: 'center',
    backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${getBackgroundImage()})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxSizing: 'border-box',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  error: { color: '#cc0000' },
  arrowCircle: { width: 220, height: 220, borderRadius: '50%', border: '3px solid #005f8c', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' },
  arrow: { fontSize: 100, color: '#005f8c' },
  bearingText: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  hint: { marginBottom: 20 },
  backButton: { marginTop: 12, background: 'none', border: 'none', color: '#005f8c', fontWeight: '600', cursor: 'pointer' },
};