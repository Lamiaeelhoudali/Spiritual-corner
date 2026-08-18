import { View, Text, StyleSheet } from 'react-native';

type DayData = {
  date: string;
  completed: number;
  total: number;
};

type WeekCalendarProps = {
  days: DayData[];
};

export default function WeekCalendar({ days }: WeekCalendarProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={styles.row}>
      {days.map((day) => {
        const dayLabel = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const isToday = day.date === today;
        const fullyDone = day.completed === day.total && day.total > 0;
        return (
          <View
            key={day.date}
            style={[
              styles.box,
              isToday && styles.boxToday,
              fullyDone && styles.boxDone,
            ]}
          >
            <Text style={styles.dayLabel}>{dayLabel}</Text>
            <Text style={styles.count}>{day.completed}/{day.total}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 16 },
  box: { width: 44, height: 56, borderRadius: 8, backgroundColor: '#e8dcc8', justifyContent: 'center', alignItems: 'center' },
  boxToday: { borderWidth: 2, borderColor: '#005f8c' },
  boxDone: { backgroundColor: '#c8e6c9' },
  dayLabel: { fontSize: 11, fontWeight: '600', color: '#000000' },
  count: { fontSize: 12, fontWeight: 'bold', color: '#005f8c' },
});