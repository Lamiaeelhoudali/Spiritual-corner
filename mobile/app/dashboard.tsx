import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../context/ThemeContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function DashboardScreen() {
  const { colors } = useTheme();
  const [name, setName] = useState<string | null>(null);
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [hijriDate, setHijriDate] = useState<string | null>(null);
  const [prayerError, setPrayerError] = useState('');
  const [loadingPrayers, setLoadingPrayers] = useState(true);

  useFocusEffect(
    useCallback(() => {
      SecureStore.getItemAsync('name').then(setName);
    }, [])
  );

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  async function loadPrayerTimes() {
    setLoadingPrayers(true);
    setPrayerError('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPrayerError('Location permission denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const today = new Date();
      const dateStr = String(today.getDate()).padStart(2, '0') + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + today.getFullYear();
      const response = await fetch(
        'https://api.aladhan.com/v1/timings/' + dateStr + '?latitude=' + latitude + '&longitude=' + longitude
      );
      const data = await response.json();
      if (data.code !== 200) {
        setPrayerError('Could not load prayer times');
        return;
      }
      setTimings(data.data.timings);
      const hijri = data.data.date.hijri;
      setHijriDate(hijri.day + ' ' + hijri.month.en + ' ' + hijri.year + ' AH');
      scheduleAzanNotifications(data.data.timings);
    } catch {
      setPrayerError('Could not get location or prayer times');
    } finally {
      setLoadingPrayers(false);
    }
  }


  async function setupNotificationChannel() {
    await Notifications.setNotificationChannelAsync('azan', {
      name: 'Prayer Time Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'azan.mp3',
    });
  }

  async function scheduleAzanNotifications(prayerTimes: Record<string, string>) {
    await setupNotificationChannel();
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const now = new Date();
    for (const prayer of prayers) {
      const [hours, minutes] = prayerTimes[prayer].split(':').map(Number);
      const prayerDate = new Date();
      prayerDate.setHours(hours, minutes, 0, 0);
      if (prayerDate > now) {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Prayer Time', body: `It is time for ${prayer} prayer.`, sound: 'azan.mp3' },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: prayerDate, channelId: 'azan' },
        });
      }
    }
  }

  return (
    <ImageBackground source={colors.backgroundImage} style={styles.container} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={[styles.prayerBox, { backgroundColor: colors.card }]}>
          {loadingPrayers ? (
            <ActivityIndicator color="#2e7d32" />
          ) : prayerError ? (
            <Text style={styles.prayerError}>{prayerError}</Text>
          ) : timings ? (
            <>
              {hijriDate ? <Text style={[styles.hijriText, { color: colors.text }]}>{hijriDate}</Text> : null}
              <Text style={[styles.prayerRow, { color: colors.text }]}>Fajr (الفجر): {timings.Fajr}</Text>
              <Text style={[styles.prayerRow, { color: colors.text }]}>Dhuhr (الظهر): {timings.Dhuhr}</Text>
              <Text style={[styles.prayerRow, { color: colors.text }]}>Asr (العصر): {timings.Asr}</Text>
              <Text style={[styles.prayerRow, { color: colors.text }]}>Maghrib (المغرب): {timings.Maghrib}</Text>
              <Text style={[styles.prayerRow, { color: colors.text }]}>Isha (العشاء): {timings.Isha}</Text>
            </>
          ) : null}
        </View>

        <Pressable style={styles.button} onPress={() => router.push('/qibla')}>
          <Text style={styles.buttonText}>Qibla</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push('/quran')}>
          <Text style={styles.buttonText}>Quran</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push('/journal')}>
          <Text style={styles.buttonText}>My Journal</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push('/tracker')}>
          <Text style={styles.buttonText}>Prayer Tracker</Text>
        </Pressable>

        {name ? (
        <Text style={[styles.welcome, { color: colors.text }]}>Welcome back, {name}</Text>
        ) : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  prayerBox: { marginBottom: 24, alignItems: 'center', padding: 16, borderRadius: 12 },
  hijriText: { fontSize: 16, color: '#2e7d32', fontWeight: '600', marginBottom: 8 },
  prayerRow: { fontSize: 16, marginBottom: 4 },
  prayerError: { color: '#cc0000', textAlign: 'center' },
  welcome: { fontSize: 18, marginBottom: 16 },
  button: { backgroundColor: '#2e7d32', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8, marginBottom: 8 },
  logoutButton: { backgroundColor: '#999999', marginTop: 12 },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});