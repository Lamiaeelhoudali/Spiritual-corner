import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
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

  async function handleLogout() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('name');
    setName(null);
  }
  async function scheduleAzanNotifications(prayerTimes: Record<string, string>) {
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
        content: {
          title: 'Prayer Time',
          body: `It is time for ${prayer} prayer.`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: prayerDate,
        },
      });
    }
  }
}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spiritual Corner</Text>

      <View style={styles.prayerBox}>
        {loadingPrayers ? (
          <ActivityIndicator color="#2e7d32" />
        ) : prayerError ? (
          <Text style={styles.prayerError}>{prayerError}</Text>
        ) : timings ? (
          <>
            {hijriDate ? <Text style={styles.hijriText}>{hijriDate}</Text> : null}
            <Text style={styles.prayerRow}>Fajr: {timings.Fajr}</Text>
            <Text style={styles.prayerRow}>Dhuhr: {timings.Dhuhr}</Text>
            <Text style={styles.prayerRow}>Asr: {timings.Asr}</Text>
            <Text style={styles.prayerRow}>Maghrib: {timings.Maghrib}</Text>
            <Text style={styles.prayerRow}>Isha: {timings.Isha}</Text>
          </>
        ) : null}
      </View>

      {name ? (
        <>
          <Text style={styles.welcome}>Welcome back, {name}</Text>
          <Pressable style={styles.button} onPress={() => router.push('/journal')}>
            <Text style={styles.buttonText}>My Journal</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => router.push('/tracker')}>
          <Text style={styles.buttonText}>Prayer Tracker</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => router.push('/quran')}>
          <Text style={styles.buttonText}>Quran</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </Pressable>
        </>
      ) : (
        <Pressable style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
      )}
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 16 },
  prayerBox: { marginBottom: 24, alignItems: 'center' },
  hijriText: { fontSize: 16, color: '#2e7d32', fontWeight: '600', marginBottom: 8 },
  prayerRow: { fontSize: 16, color: '#000000', marginBottom: 4 },
  prayerError: { color: '#cc0000', textAlign: 'center' },
  welcome: { fontSize: 18, color: '#000000', marginBottom: 16 },
  button: { backgroundColor: '#2e7d32', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  logoutButton: { backgroundColor: '#999999', marginTop: 12 },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
