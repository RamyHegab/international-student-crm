import React from 'react';
import './Dashboard.css';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="dashboard">
      <div className="container">
        <div className="page-header">
          <h1>Welcome, {user?.first_name}!</h1>
          <p>Manage your international student recruitment activities</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">🏢</div>
            <h3>Agents</h3>
            <p>Manage recruitment agents and their branches worldwide</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🏫</div>
            <h3>Schools</h3>
            <p>Track and manage partner schools across the globe</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🗺️</div>
            <h3>Itineraries</h3>
            <p>Plan and organize recruitment trips and activities</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Analytics</h3>
            <p>View recruitment statistics and performance metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
