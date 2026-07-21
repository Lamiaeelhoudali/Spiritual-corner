import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number) {
  return (rad * 180) / Math.PI;
}

function calculateQiblaBearing(lat: number, lng: number) {
  const phi1 = toRadians(lat);
  const phi2 = toRadians(KAABA_LAT);
  const deltaLambda = toRadians(KAABA_LNG - lng);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  return (toDegrees(theta) + 360) % 360;
}

export default function QiblaScreen() {
  const { colors } = useTheme();
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    getQiblaBearing();

    const subscription = Magnetometer.addListener((data) => {
      const { x, y } = data;
      let angle = toDegrees(Math.atan2(y, x));
      angle = (angle + 360) % 360;
      setHeading(angle);
    });
    Magnetometer.setUpdateInterval(100);

    return () => subscription.remove();
  }, []);

  async function getQiblaBearing() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const bearing = calculateQiblaBearing(location.coords.latitude, location.coords.longitude);
      setQiblaBearing(bearing);
    } catch {
      setError('Could not get location');
    }
  }

  const arrowRotation = qiblaBearing !== null ? qiblaBearing - heading : 0;

  return (
    <ImageBackground source={colors.backgroundImage} style={styles.container} resizeMode="cover">
      <View style={[styles.overlay, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Qibla Direction</Text>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : qiblaBearing === null ? (
          <Text style={{ color: colors.text }}>Loading...</Text>
        ) : (
          <>
            <View style={styles.compassCircle}>
              <Text style={[styles.arrow, { transform: [{ rotate: `${arrowRotation}deg` }] }]}>↑</Text>
            </View>
            <Text style={[styles.bearingText, { color: colors.text }]}>
              {Math.round(qiblaBearing)}° from North
            </Text>
            <Text style={[styles.hint, { color: colors.text }]}>
              Hold your phone flat. The arrow points toward the Kaaba.
            </Text>
          </>
        )}
        <Pressable style={styles.backButton} onPress={() => router.push('/dashboard')}>
          <Text style={styles.backText}>Back to Home</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  error: { color: '#cc0000', textAlign: 'center' },
  compassCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: '#005f8c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrow: { fontSize: 100, color: '#005f8c' },
  bearingText: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  hint: { textAlign: 'center', marginBottom: 20 },
  backButton: { marginTop: 12, alignItems: 'center' },
  backText: { color: '#005f8c', fontWeight: '600' },
});