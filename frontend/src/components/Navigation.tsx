import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  user: any;
  setUser: (user: null) => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌍</span>
          International Student CRM
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/agents" className="nav-link">Agents</Link>
          </li>
          <li className="nav-item">
            <Link to="/schools" className="nav-link">Schools</Link>
          </li>
          <li className="nav-item">
            <Link to="/itineraries" className="nav-link">Itineraries</Link>
          </li>
        </ul>
        <div className="nav-right">
          <span className="user-name">{user?.first_name} {user?.last_name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
