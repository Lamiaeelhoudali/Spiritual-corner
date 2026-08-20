export default function WeekCalendar({ days }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.row}>
      {days.map((day) => {
        const dayLabel = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const isToday = day.date === today;
        const fullyDone = day.completed === day.total && day.total > 0;
        return (
          <div
            key={day.date}
            style={{
              ...styles.box,
              ...(isToday ? styles.boxToday : {}),
              ...(fullyDone ? styles.boxDone : {}),
            }}
          >
            <p style={styles.dayLabel}>{dayLabel}</p>
            <p style={styles.count}>{day.completed}/{day.total}</p>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  row: { display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 16, marginBottom: 16 },
  box: { width: 44, height: 56, borderRadius: 8, backgroundColor: '#e8dcc8', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  boxToday: { border: '2px solid #005f8c' },
  boxDone: { backgroundColor: '#c8e6c9' },
  dayLabel: { fontSize: 11, fontWeight: '600', color: '#000000', margin: 0 },
  count: { fontSize: 12, fontWeight: 'bold', color: '#005f8c', margin: 0 },
};