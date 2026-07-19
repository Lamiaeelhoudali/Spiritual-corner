import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://spiritual-corner.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      navigate('/dashboard');
    } catch {
      setError('Could not connect to server');
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Log In</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p style={styles.error}>{error}</p> : null}
        <button style={styles.button} type="submit">Log In</button>
      </form>
      <Link to="/register" style={styles.link}>Don't have an account? Register</Link>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 100, minHeight: '100vh', backgroundColor: '#ffffff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', width: 300 },
  input: { border: '1px solid #dddddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  error: { color: '#cc0000', textAlign: 'center' },
  button: { backgroundColor: '#2e7d32', color: '#ffffff', padding: 14, borderRadius: 8, border: 'none', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' },
  link: { color: '#2e7d32', fontWeight: '600', marginTop: 14, textDecoration: 'none' },
};