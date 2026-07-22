import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

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

export default function AdkarScreen() {
  const { colors } = useTheme();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  function toggleReveal(key: string) {
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Adkar</Text>
      {CATEGORIES.map((category, catIndex) => (
        <View key={catIndex} style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          {category.items.map((item, itemIndex) => {
            const key = `${catIndex}-${itemIndex}`;
            const isOpen = revealed[key];
            return (
              <Pressable
                key={key}
                style={[styles.card, { backgroundColor: colors.card }]}
                onPress={() => toggleReveal(key)}
              >
                <Text style={styles.label}>{item.label}</Text>
                {isOpen ? (
                  <>
                    <Text style={[styles.arabic, { color: colors.text }]}>{item.arabic}</Text>
                    <Text style={[styles.translation, { color: colors.text }]}>{item.translation}</Text>
                  </>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ))}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  categoryBlock: { marginBottom: 20 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#005f8c' },
  card: { borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#005f8c' },
  label: { fontSize: 16, fontWeight: '600', color: '#005f8c' },
  arabic: { fontSize: 20, textAlign: 'right', marginTop: 10, marginBottom: 8 },
  translation: { fontSize: 14 },
  backButton: { marginTop: 20, marginBottom: 100, alignItems: 'center' },
  backText: { color: '#005f8c', fontWeight: '600' },
});