import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ImageBackground, ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

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
  const [avatar, setAvatar] = useState('🕌');
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      SecureStore.getItemAsync('name').then(setName);
      SecureStore.getItemAsync('avatar').then((saved) => {
        if (saved) setAvatar(saved);
      });
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

  async function setupNotificationChannel() {
    await Notifications.setNotificationChannelAsync('azan', {
      name: 'Prayer Time Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'azan.mp3',
    });
  }

  async function scheduleAzanNotifications(prayerTimes: Record<string, string>) {
    await setupNotificationChannel();
    const avatar = (await SecureStore.getItemAsync('avatar')) || '🕌';
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
          content: { title: `${avatar} Prayer Time`, body: `It is time for ${prayer} prayer.`, sound: 'azan.mp3' },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: prayerDate, channelId: 'azan' },
        });
      }
    }
  }

  return (
    <ImageBackground source={colors.backgroundImage} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.overlay}>
        <View style={styles.topSection}>
          <Pressable style={styles.returnButton} onPress={() => router.push('/')}>
            <Text style={styles.returnText}>← Back</Text>
          </Pressable>

          <View style={styles.prayerBox}>
            {loadingPrayers ? (
              <ActivityIndicator color="#005f8c" />
            ) : prayerError ? (
              <Text style={styles.prayerError}>{prayerError}</Text>
            ) : timings ? (
              <>
                {hijriDate ? <Text style={styles.hijriText}>{hijriDate}</Text> : null}
                <View style={styles.prayerRowHorizontal}>
                  <View style={styles.prayerItem}>
                    <Text style={styles.prayerName} numberOfLines={1}>{t('fajr')}</Text>
                    <Text style={styles.prayerTime}>{timings.Fajr}</Text>
                  </View>
                  <View style={styles.prayerItem}>
                    <Text style={styles.prayerName} numberOfLines={1}>{t('dhuhr')}</Text>
                    <Text style={styles.prayerTime}>{timings.Dhuhr}</Text>
                  </View>
                  <View style={styles.prayerItem}>
                    <Text style={styles.prayerName} numberOfLines={1}>{t('asr')}</Text>
                    <Text style={styles.prayerTime}>{timings.Asr}</Text>
                  </View>
                  <View style={styles.prayerItem}>
                    <Text style={styles.prayerName} numberOfLines={1}>{t('maghrib')}</Text>
                    <Text style={styles.prayerTime}>{timings.Maghrib}</Text>
                  </View>
                  <View style={[styles.prayerItem, { borderRightWidth: 0 }]}>
                    <Text style={styles.prayerName} numberOfLines={1}>{t('isha')}</Text>
                    <Text style={styles.prayerTime}>{timings.Isha}</Text>
                  </View>
                </View>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={[styles.actionRow, { backgroundColor: colors.card }]}>
            <Pressable style={styles.actionButton} onPress={() => router.push('/qibla')}>
              <Text style={styles.buttonText}>{t('qibla')}</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => router.push('/quran')}>
              <Text style={styles.buttonText}>{t('quran')}</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => setMenuOpen((prev) => !prev)}>
              <Text style={styles.buttonText}>☰ More</Text>
            </Pressable>
          </View>

          {menuOpen ? (
              <View style={styles.menu}>
              <View style={styles.menuItem}>
                <Text style={styles.languageLabel}>{t('language') || 'Language'}</Text>
                <View style={styles.langOptions}>
                  <Pressable onPress={() => i18n.changeLanguage('en')}>
                    <Text style={[styles.langOption, i18n.language === 'en' && styles.langOptionActive]}>English</Text>
                  </Pressable>
                  <Pressable onPress={() => i18n.changeLanguage('fr')}>
                    <Text style={[styles.langOption, i18n.language === 'fr' && styles.langOptionActive]}>Français</Text>
                  </Pressable>
                </View>
              </View>
              <Pressable style={styles.menuItem} onPress={() => router.push('/journal')}>
                <Text style={styles.menuItemText}>{t('myJournal')}</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => router.push('/tracker')}>
                <Text style={styles.menuItemText}>{t('prayerTracker')}</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => router.push('/tasbeeh')}>
                <Text style={styles.menuItemText}>{t('tasbeeh')}</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => router.push('/adkar')}>
                <Text style={styles.menuItemText}>{t('adkar')}</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => router.push('/avatar')}>
                <Text style={styles.menuItemText}>{t('avatar')}</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => router.push('/good-deeds' as any)}>
             <Text style={styles.menuItemText}>Good Deeds</Text>
            </Pressable>
            </View>
          ) : null}

          {name ? (
            <Text style={[styles.welcome, { color: colors.text }]}>{avatar} {t('welcomeBack')}, {name}</Text>
          ) : null}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flexGrow: 1, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  topSection: { width: '100%', alignItems: 'center' },
  bottomSection: { width: '100%', alignItems: 'center' },
  returnButton: { alignSelf: 'flex-start', marginBottom: 8 },
  returnText: { color: '#005f8c', fontWeight: 'bold', fontSize: 18 },
  prayerBox: { marginBottom: 24, alignItems: 'center', padding: 16, borderRadius: 12, width: '100%', backgroundColor: 'rgba(232, 220, 200, 0.75)' },
  hijriText: { fontSize: 18, color: '#005f8c', fontWeight: '600', fontStyle: 'italic', marginBottom: 8 },
  prayerRowHorizontal: { flexDirection: 'row', width: '100%' },
  prayerItem: { flex: 1, alignItems: 'center', borderRightWidth: 2, borderRightColor: '#005f8c', paddingHorizontal: 2 },
  prayerName: { fontSize: 11, fontWeight: '600', fontStyle: 'italic', color: '#000000', textAlign: 'center', flexShrink: 1 },
  prayerTime: { fontSize: 14, color: '#000000' },
  prayerError: { color: '#cc0000', textAlign: 'center' },
  welcome: { fontSize: 18, marginTop: 4, fontStyle: 'italic' },
  buttonText: { color: '#005f8c', fontWeight: 'bold', fontStyle: 'italic', fontSize: 14, flexShrink: 1 },
  menu: { width: '100%', borderRadius: 12, padding: 8, marginBottom: 16, backgroundColor: 'rgba(208, 195, 174, 0.85)' },
  menuItem: { padding: 14, borderWidth: 1, borderColor: '#005f8c', borderRadius: 8, marginBottom: 6 },
  menuItemText: { fontSize: 16, fontWeight: '600', fontStyle: 'italic', color: '#090909' },
  languageLabel: { fontSize: 16, fontWeight: '600', fontStyle: 'italic', color: '#000000' },
  actionRow: { flexDirection: 'row', width: '100%', borderRadius: 12, padding: 8, marginBottom: 4, gap: 8 },
  actionButton: { flex: 1, backgroundColor: '#e8dcc8', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  langOptions: { flexDirection: 'row', gap: 16, marginTop: 6 },
  langOption: { fontSize: 14, color: '#000000', fontWeight: '600' },
  langOptionActive: { color: '#005f8c', fontWeight: 'bold' },
});