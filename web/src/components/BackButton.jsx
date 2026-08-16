import { useNavigate } from 'react-router-dom';

export default function BackButton({ to = '/dashboard', label = 'Back to Home' }) {
  const navigate = useNavigate();
  return (
    <button style={styles.backButton} onClick={() => navigate(to)}>
      {label}
    </button>
  );
}

const styles = {
  backButton: { marginTop: 16, background: 'none', border: 'none', color: '#005f8c', fontWeight: '600', cursor: 'pointer' },
};