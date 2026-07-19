import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';
import Tracker from './pages/Tracker';
import Quran from './pages/Quran';
import Qibla from './pages/Qibla';
import NewEntry from './pages/NewEntry';
import Unlock from './pages/Unlock';
import Tasbeeh from './pages/Tasbeeh';
import Adkar from './pages/Adkar';
import Avatar from './pages/Avatar';
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
        <Route path="/new-entry" element={<NewEntry />} />
        <Route path="/unlock/:id" element={<Unlock />} /> 
        <Route path="/tasbeeh" element={<Tasbeeh />} />
        <Route path="/adkar" element={<Adkar />} />
        <Route path="/avatar" element={<Avatar />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;