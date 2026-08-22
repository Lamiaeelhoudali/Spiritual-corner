import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';
import WeekCalendar from '../components/WeekCalendar';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withSpring } from 'react-native-reanimated';

const LEAF_POSITIONS = [
  { top: 0, left: 100 },
  { top: 20, left: 40 },
  { top: 20, left: 160 },
  { top: 55, left: 10 },
  { top: 55, left: 100 },
  { top: 55, left: 190 },
  { top: 90, left: 50 },
  { top: 90, left: 150 },
  { top: 110, left: 100 },
];

const DEEDS = [
  { key: 'helpedSomeone', label: 'Helped Someone' },
  { key: 'gaveCharity', label: 'Gave Charity' },
  { key: 'kindWord', label: 'A Kind Word' },
  { key: 'helpedFamily', label: 'Helped Family' },
  { key: 'smiled', label: 'Smiled' },
  { key: 'spokeNoIll', label: 'Spoke No Ill' },
  { key: 'withheldJudgment', label: 'Withheld Judgment' },
  { key: 'gentleWithMyself', label: 'Gentle With Myself' },
  { key: 'keptMyPeace', label: 'Kept My Peace' },
];

function AnimatedLeaf({ position, isDone, label, onPress }: any) {
  const sway = useSharedValue(0);
  const scale = useSharedValue(1);

  useState(() => {
    sway.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 1500 }),
        withTiming(-3, { duration: 1500 })
      ),
      -1,
      true
    );
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sway.value}deg` }, { scale: scale.value }],
  }));

  function handlePress() {
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  }

  return (
    <Animated.View style={[styles.leaf, isDone && styles.leafDone, position, animatedStyle]}>
      <Pressable onPress={handlePress} style={styles.leafPressable}>
        <Text style={styles.leafText}>{isDone ? '🌿' : '🍂'}</Text>
        <Text style={styles.leafLabel}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function GoodDeedsScreen() {
  const { colors } = useTheme();
  const [deeds, setDeeds] = useState<Record<string, boolean>>({});
  const [week, setWeek] = useState<any[]>([]);

 useFocusEffect(
  useCallback(() => {
    async function init() {
      await loadToday();
      await loadWeek();
    }
    init();
  }, [])
);

  async function loadToday() {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        router.replace('/login?redirect=/good-deeds' as any);
        return;
      }
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDeeds(data.deeds || {});
    } catch {
      setDeeds({});
    }
  }

  async function loadWeek() {
    try {
      const token = await SecureStore.getItemAsync('token');
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/week', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWeek(Array.isArray(data) ? data : []);
    } catch {
      setWeek([]);
    }
  }

  async function toggleLeaf(key: string) {
    const newValue = !deeds[key];
    setDeeds({ ...deeds, [key]: newValue });
    try {
      const token = await SecureStore.getItemAsync('token');
      await fetch('https://spiritual-corner.onrender.com/gooddeeds/today', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deed: key, completed: newValue }),
      });
    } catch {
      // stays optimistically updated locally even if save fails
    }
  }

  const calendarDays = week.map((entry) => ({
    date: entry.date,
    completed: Object.values(entry.deeds).filter(Boolean).length,
    total: DEEDS.length,
  }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>Good Deeds</Text>
        <BackButton label="← Back" />
      </View>

     <View style={styles.treeContainer}>
  <View style={styles.trunk} />
   {DEEDS.map((d, index) => (
  <AnimatedLeaf
    key={d.key}
    position={LEAF_POSITIONS[index]}
    isDone={deeds[d.key]}
    label={d.label}
    onPress={() => toggleLeaf(d.key)}
  />
))}
</View>

      <Text style={[styles.subtitle, { color: colors.text }]}>This Week</Text>
      {calendarDays.length > 0 ? (
        <WeekCalendar days={calendarDays} />
      ) : (
        <Text style={{ color: colors.text }}>No history yet</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  tree: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  leaf: { position: 'absolute', width: 75, height: 75, borderRadius: 10, backgroundColor: '#e8dcc8', justifyContent: 'center', alignItems: 'center', padding: 4 },
  leafDone: { backgroundColor: '#c8e6c9', borderWidth: 2, borderColor: '#005f8c' },
  leafText: { fontSize: 22 },
  leafLabel: { fontSize: 10, textAlign: 'center', marginTop: 2, color: '#000000', fontWeight: '600' },
  leafPressable: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  treeContainer: { width: '100%', height: 260, alignItems: 'center', position: 'relative', marginBottom: 20 },
  trunk: { position: 'absolute', bottom: 0, left: '50%', marginLeft: -8, width: 16, height: 60, backgroundColor: '#8d6e4a', borderRadius: 4 },
});