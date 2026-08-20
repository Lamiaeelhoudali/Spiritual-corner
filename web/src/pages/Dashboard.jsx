import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayImg from '../assets/day.jpg';
import nightImg from '../assets/night.jpg';

function getBackgroundImage() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? dayImg : nightImg;
}

export default function Dashboard() {
  const [name, setName] = useState(null);
  const [timings, setTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [prayerError, setPrayerError] = useState('');
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const [avatar, setAvatar] = useState('🕌');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setName(localStorage.getItem('name'));
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) setAvatar(savedAvatar);
    loadPrayerTimes();
  }, []);

  function loadPrayerTimes() {
    setLoadingPrayers(true);
    setPrayerError('');
    if (!navigator.geolocation) {
      setPrayerError('Location not supported by this browser');
      setLoadingPrayers(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const today = new Date();
          const dateStr = String(today.getDate()).padStart(2, '0') + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + today.getFullYear();
          const response = await fetch(
            `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}`
          );
          const data = await response.json();
          if (data.code !== 200) {
            setPrayerError('Could not load prayer times');
            return;
          }
          setTimings(data.data.timings);
          const hijri = data.data.date.hijri;
          setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
        } catch {
          setPrayerError('Could not load prayer times');
        } finally {
          setLoadingPrayers(false);
        }
      },
      () => {
        setPrayerError('Location permission denied');
        setLoadingPrayers(false);
      }
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.topSection}>
        <button style={styles.returnButton} onClick={() => navigate('/')}>← Back</button>
        <div style={styles.prayerBox}>
          {loadingPrayers ? (
            <p>Loading...</p>
          ) : prayerError ? (
            <p style={styles.error}>{prayerError}</p>
          ) : timings ? (
            <>
              {hijriDate ? <p style={styles.hijriText}>{hijriDate}</p> : null}
              <div style={styles.prayerRowHorizontal}>
                <div style={styles.prayerItem}>
                  <p style={styles.prayerName}>{t('fajr')}</p>
                  <p style={styles.prayerTime}>{timings.Fajr}</p>
                </div>
                <div style={styles.prayerItem}>
                  <p style={styles.prayerName}>{t('dhuhr')}</p>
                  <p style={styles.prayerTime}>{timings.Dhuhr}</p>
                </div>
                <div style={styles.prayerItem}>
                  <p style={styles.prayerName}>{t('asr')}</p>
                  <p style={styles.prayerTime}>{timings.Asr}</p>
                </div>
                <div style={styles.prayerItem}>
                  <p style={styles.prayerName}>{t('maghrib')}</p>
                  <p style={styles.prayerTime}>{timings.Maghrib}</p>
                </div>
                <div style={{ ...styles.prayerItem, borderRight: 'none' }}>
                  <p style={styles.prayerName}>{t('isha')}</p>
                  <p style={styles.prayerTime}>{timings.Isha}</p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div style={styles.bottomSection}>
        <div style={styles.actionRow}>
          <button style={styles.actionButton} onClick={() => navigate('/qibla')}>{t('qibla')}</button>
          <button style={styles.actionButton} onClick={() => navigate('/quran')}>{t('quran')}</button>
          <button style={styles.actionButton} onClick={() => setMenuOpen((prev) => !prev)}>☰ More</button>
        </div>

        {menuOpen ? (
          <div style={styles.menu}>
            <div style={styles.menuItem}>
              <p style={styles.menuItemText}>{t('language')}</p>
              <div style={styles.langOptions}>
                <span
                  style={{ ...styles.langOption, ...(i18n.language === 'en' ? styles.langOptionActive : {}) }}
                  onClick={() => i18n.changeLanguage('en')}
                >
                  English
                </span>
                <span
                  style={{ ...styles.langOption, ...(i18n.language === 'fr' ? styles.langOptionActive : {}) }}
                  onClick={() => i18n.changeLanguage('fr')}
                >
                  Français
                </span>
              </div>
            </div>
            <div style={styles.menuItem} onClick={() => navigate('/journal')}>
              <p style={styles.menuItemText}>{t('myJournal')}</p>
            </div>
            <div style={styles.menuItem} onClick={() => navigate('/tracker')}>
              <p style={styles.menuItemText}>{t('prayerTracker')}</p>
            </div>
            <div style={styles.menuItem} onClick={() => navigate('/tasbeeh')}>
              <p style={styles.menuItemText}>{t('tasbeeh')}</p>
            </div>
            <div style={styles.menuItem} onClick={() => navigate('/adkar')}>
              <p style={styles.menuItemText}>{t('adkar')}</p>
            </div>
            <div style={styles.menuItem} onClick={() => navigate('/avatar')}>
              <p style={styles.menuItemText}>{t('avatar')}</p>
            </div>
            <div style={styles.menuItem} onClick={() => navigate('/good-deeds')}>
            <p style={styles.menuItemText}>Good Deeds</p>
           </div>
          </div>
        ) : null}

        {name ? <p style={styles.welcome}>{avatar} {t('welcomeBack')}, {name}</p> : null}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    paddingTop: 60,
    paddingBottom: 80,
    backgroundImage: `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(${getBackgroundImage()})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  topSection: { width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  bottomSection: { width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  returnButton: { alignSelf: 'flex-start', background: 'none', border: 'none', color: '#005f8c', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', marginBottom: 8 },
  prayerBox: { padding: 16, borderRadius: 12, backgroundColor: '#e8dcc8', textAlign: 'center', width: '100%', boxSizing: 'border-box' },
  hijriText: { color: '#005f8c', fontWeight: '600', fontStyle: 'italic', margin: '0 0 8px 0', fontSize: 18 },
  prayerRowHorizontal: { display: 'flex', width: '100%' },
  prayerItem: { flex: 1, alignItems: 'center', borderRight: '2px solid #005f8c', paddingHorizontal: 4 },
  prayerName: { fontSize: 13, fontWeight: '600', fontStyle: 'italic', margin: 0, color: '#000000' },
  prayerTime: { fontSize: 18, margin: 0, color: '#000000' },
  error: { color: '#cc0000' },
  actionRow: { display: 'flex', width: '100%', borderRadius: 12, padding: 8, marginBottom: 4, gap: 8, backgroundColor: '#f5f5f5', boxSizing: 'border-box' },
  actionButton: { flex: 1, backgroundColor: '#e8dcc8', color: '#005f8c', fontWeight: 'bold', fontStyle: 'italic', padding: '12px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 15 },
  menu: { width: '100%', borderRadius: 12, padding: 8, marginBottom: 16, backgroundColor: 'rgba(232, 220, 200, 0.95)', boxSizing: 'border-box' },  
  menuItem: { padding: 14, border: '1px solid #005f8c', borderRadius: 8, marginBottom: 6, cursor: 'pointer' },
  menuItemText: { fontSize: 16, fontWeight: '600', fontStyle: 'italic', margin: 0, color: '#005f8c' },
  langOptions: { display: 'flex', gap: 16, marginTop: 6 },
  langOption: { fontSize: 14, color: '#000000', fontWeight: '600', cursor: 'pointer' },
  langOptionActive: { color: '#005f8c', fontWeight: 'bold' },
  welcome: { fontSize: 24, fontStyle: 'italic', marginTop: 4, color: '#ffffff', fontWeight: 'bold' },
};