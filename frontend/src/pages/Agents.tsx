import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Agents.css';

interface Agent {
  id: string;
  trading_name: string;
  legal_name: string;
  country: string;
  status: string;
  email: string;
}

interface AgentsProps {
  universityId: string;
}

const Agents: React.FC<AgentsProps> = ({ universityId }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    trading_name: '',
    legal_name: '',
    hq_country: '',
    email: '',
    contact_number: ''
  });

  useEffect(() => {
    fetchAgents();
  }, [universityId]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/agents/${universityId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAgents(response.data);
    } catch (err) {
      setError('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/agents/`,
        { ...formData, universityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({
        trading_name: '',
        legal_name: '',
        hq_country: '',
        email: '',
        contact_number: ''
      });
      setShowForm(false);
      fetchAgents();
    } catch (err) {
      setError('Failed to create agent');
    }
  };

  if (loading) return <div className="container"><p>Loading agents...</p></div>;

  return (
    <div className="agents-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Agents</h1>
            <p>Manage recruitment agents worldwide</p>
          </div>
          <button
            className="button button-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Agent'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="card">
            <h3>Create New Agent</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Trading Name</label>
                <input
                  type="text"
                  value={formData.trading_name}
                  onChange={(e) => setFormData({ ...formData, trading_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Legal Name</label>
                <input
                  type="text"
                  value={formData.legal_name}
                  onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>HQ Country</label>
                <input
                  type="text"
                  value={formData.hq_country}
                  onChange={(e) => setFormData({ ...formData, hq_country: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                />
              </div>
              <button type="submit" className="button button-primary">Create Agent</button>
            </form>
          </div>
        )}

        <div className="agents-grid">
          {agents.map((agent) => (
            <div key={agent.id} className="agent-card">
              <h3>{agent.trading_name}</h3>
              <p className="agent-legal-name">{agent.legal_name}</p>
              <div className="agent-details">
                <span className="badge badge-status">{agent.status}</span>
                <p>{agent.hq_country}</p>
                <p>{agent.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agents;
