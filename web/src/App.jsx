import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';
import Tracker from './pages/Tracker';
import Quran from './pages/Quran';
import Qibla from './pages/Qibla';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/quran" element={<Quran />} />
        <Route path="/qibla" element={<Qibla />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;