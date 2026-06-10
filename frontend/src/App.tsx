import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Agents from './pages/Agents';
import Schools from './pages/Schools';
import Itineraries from './pages/Itineraries';
import Navigation from './components/Navigation';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  university_id: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(
            'http://localhost:5000/api/auth/me',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      {user && <Navigation user={user} setUser={setUser} />}
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/agents" element={user ? <Agents universityId={user.university_id} /> : <Navigate to="/login" />} />
        <Route path="/schools" element={user ? <Schools universityId={user.university_id} /> : <Navigate to="/login" />} />
        <Route path="/itineraries" element={user ? <Itineraries userId={user.id} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
