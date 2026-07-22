import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { title: 'Waking Up', items: [
    { label: 'Upon Waking', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', translation: 'Praise be to Allah who gave us life after having taken it from us, and unto Him is the resurrection.' },
  ]},
  { title: 'Morning', items: [
    { label: 'Morning Remembrance', arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ', translation: 'We have reached the morning, and at this very time all sovereignty belongs to Allah, and all praise is for Allah.' },
    { label: 'By Your Leave', arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا', translation: 'O Allah, by Your leave we have reached the morning and by Your leave we reach the evening.' },
  ]},
  { title: 'Evening', items: [
    { label: 'Evening Remembrance', arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ', translation: 'We have reached the evening, and at this very time all sovereignty belongs to Allah, and all praise is for Allah.' },
    { label: 'By Your Leave', arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا', translation: 'O Allah, by Your leave we have reached the evening and by Your leave we reach the morning.' },
  ]},
  { title: 'Going to Bed', items: [
    { label: 'Before Sleep', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', translation: 'In Your name, O Allah, I die and I live.' },
    { label: 'Seeking Protection', arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', translation: 'O Allah, protect me from Your punishment on the day You resurrect Your servants.' },
  ]},
  { title: 'Before Prayer', items: [
    { label: 'Opening Supplication', arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ', translation: 'Glory is to You, O Allah, and praise; blessed is Your name.' },
  ]},
  { title: 'After Prayer', items: [
    { label: 'Seeking Forgiveness', arabic: 'أَسْتَغْفِرُ اللَّهَ (×3)', translation: 'I seek forgiveness from Allah (said three times).' },
    { label: 'Tasbeeh After Salah', arabic: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ (×33)', translation: 'Glory be to Allah, praise be to Allah, Allah is greatest (each said 33 times).' },
  ]},
  { title: 'After Adhan', items: [
    { label: 'Dua After the Call to Prayer', arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ', translation: 'O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favor.' },
  ]},
  { title: 'Leaving the House', items: [
  { label: 'Upon Leaving', arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', translation: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.' },
]},
{ title: 'Entering the House', items: [
  { label: 'Upon Returning', arabic: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا', translation: 'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust.' },
]},

];

export default function Adkar() {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState({});

  function toggleReveal(key) {
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Adkar</h1>
      {CATEGORIES.map((category, catIndex) => (
        <div key={catIndex} style={styles.categoryBlock}>
          <h2 style={styles.categoryTitle}>{category.title}</h2>
          {category.items.map((item, itemIndex) => {
            const key = `${catIndex}-${itemIndex}`;
            const isOpen = revealed[key];
            return (
              <div key={key} style={styles.card} onClick={() => toggleReveal(key)}>
                <p style={styles.label}>{item.label}</p>
                {isOpen ? (
                  <>
                    <p style={styles.arabic}>{item.arabic}</p>
                    <p style={styles.translation}>{item.translation}</p>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>Back to Home</button>
    </div>
  );
}

const styles = {
  container: { padding: 24, paddingTop: 60, maxWidth: 600, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  categoryBlock: { marginBottom: 20 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#005f8c' },
  card: { backgroundColor: '#f5f5f5', border: '1px solid #005f8c', borderRadius: 12, padding: 16, marginBottom: 12, cursor: 'pointer' },
  label: { fontWeight: '600', margin: 0, color: '#000000' },
  arabic: { fontSize: 20, textAlign: 'right', marginTop: 10, marginBottom: 8, color: '#000000' },
  translation: { fontSize: 14, color: '#000000' },
  backButton: { marginTop: 20, marginBottom: 40, background: 'none', border: 'none', color: '#005f8c', fontWeight: '600', cursor: 'pointer' },
};