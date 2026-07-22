import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('https://spiritual-corner.onrender.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || 'Registration failed');
        return;
      }
      setSuccess('Account created. Please log in.');
      setTimeout(() => navigate('/login'), 700);
    } catch {
      setError('Could not connect to server');
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create Account</h1>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        {success ? <p style={styles.success}>{success}</p> : null}
        <button style={styles.button} type="submit">Register</button>
      </form>
      <Link to="/login" style={styles.link}>Already have an account? Log In</Link>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 100, minHeight: '100vh', backgroundColor: '#ffffff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', width: 300 },
  input: { border: '1px solid #dddddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  error: { color: '#cc0000', textAlign: 'center' },
  success: { color: '#005f8c', textAlign: 'center' },
  button: { backgroundColor: '#005f8c', color: '#ffffff', padding: 14, borderRadius: 8, border: 'none', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' },
  link: { color: '#005f8c', fontWeight: '600', marginTop: 14, textDecoration: 'none' },
};