import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput, Modal } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

type Deed = {
  _id: string;
  text: string;
  completed: boolean;
};

export default function GoodDeedsScreen() {
  const { colors } = useTheme();
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadToday();
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
      setDeeds(data.deeds || []);
    } catch {
      setDeeds([]);
    }
  }

  async function addDeed() {
    if (!inputValue.trim()) return;
    try {
      const token = await SecureStore.getItemAsync('token');
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: inputValue.trim() }),
      });
      const data = await res.json();
      setDeeds(data.deeds || []);
      setInputValue('');
      setShowModal(false);
    } catch {
      // stays open if it fails
    }
  }

  async function toggleDeed(deedId: string) {
    try {
      const token = await SecureStore.getItemAsync('token');
      const res = await fetch('https://spiritual-corner.onrender.com/gooddeeds/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deedId }),
      });
      const data = await res.json();
      setDeeds(data.deeds || []);
    } catch {
      // no local fallback
    }
  }

  const grownCount = deeds.filter((d) => d.completed).length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>Good Deeds</Text>
        <BackButton label="← Back" />
      </View>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Every deed is a step closer to God. Add one, then tap it when it's done.
      </Text>

      <View style={styles.canopy}>
        {deeds.map((d) => (
          <Pressable
            key={d._id}
            style={[styles.deedBox, d.completed && styles.deedBoxGrown]}
            onPress={() => toggleDeed(d._id)}
          >
            <Text style={[styles.deedText, d.completed && styles.deedTextGrown]}>{d.text}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.addTile} onPress={() => setShowModal(true)}>
          <Text style={styles.addTileText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.trunk} />

      <Text style={[styles.progress, { color: colors.text }]}>
        {grownCount} grown · {deeds.length} deeds
      </Text>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter your good deed:</Text>
            <TextInput
              style={styles.modalInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="e.g. Helped a neighbor"
              autoFocus
              maxLength={60}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setShowModal(false)}>
                <Text style={{ color: '#4A2E1E' }}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalConfirm} onPress={addDeed}>
                <Text style={{ color: '#fff' }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginBottom: 20 },
  canopy: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', gap: 12 },
  deedBox: { width: 110, minHeight: 65, padding: 8, borderRadius: 10, borderWidth: 2, borderColor: '#8A6E45', backgroundColor: '#C9A876', justifyContent: 'center', alignItems: 'center' },
  deedBoxGrown: { backgroundColor: '#4C8C3C', borderColor: '#33611F' },
  deedText: { fontSize: 12, textAlign: 'center', color: '#2A211A' },
  deedTextGrown: { color: '#ffffff' },
  addTile: { width: 110, minHeight: 65, borderRadius: 10, borderWidth: 2, borderColor: '#B9AD93', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  addTileText: { fontSize: 26, fontWeight: 'bold', color: '#B9AD93' },
  trunk: { alignSelf: 'center', width: 50, height: 70, backgroundColor: '#4A2E1E', borderRadius: 6, marginTop: 4 },
  progress: { textAlign: 'center', fontSize: 13, marginTop: 12, marginBottom: 30 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(42,33,26,0.45)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBox: { backgroundColor: '#fff', borderRadius: 14, padding: 22, width: '100%', maxWidth: 340 },
  modalTitle: { fontSize: 16, marginBottom: 14, color: '#2A211A' },
  modalInput: { borderWidth: 1, borderColor: '#8A6E45', borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 14 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  modalCancel: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: '#4A2E1E' },
  modalConfirm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: '#4A2E1E' },
});