import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Itineraries.css';

interface Itinerary {
  id: string;
  title: string;
  countries_visited: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface ItinerariesProps {
  userId: string;
}

const Itineraries: React.FC<ItinerariesProps> = ({ userId }) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    countries_visited: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchItineraries();
  }, [userId]);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/itineraries/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItineraries(response.data);
    } catch (error) {
      console.error('Failed to load itineraries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/itineraries/',
        { ...formData, userId, status: 'draft' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ title: '', countries_visited: '', start_date: '', end_date: '' });
      setShowForm(false);
      fetchItineraries();
    } catch (error) {
      console.error('Failed to create itinerary');
    }
  };

  if (loading) return <div className="container"><p>Loading itineraries...</p></div>;

  return (
    <div className="itineraries-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Recruitment Itineraries</h1>
            <p>Plan and organize your recruitment trips</p>
          </div>
          <button
            className="button button-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Create Itinerary'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3>Create New Itinerary</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Southeast Asia 2024"
                  required
                />
              </div>
              <div className="form-group">
                <label>Countries Visited</label>
                <input
                  type="text"
                  value={formData.countries_visited}
                  onChange={(e) => setFormData({ ...formData, countries_visited: e.target.value })}
                  placeholder="e.g., Vietnam, Thailand, Malaysia"
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="button button-primary">Create Itinerary</button>
            </form>
          </div>
        )}

        <div className="itineraries-grid">
          {itineraries.map((itinerary) => (
            <div key={itinerary.id} className="itinerary-card">
              <h3>{itinerary.title}</h3>
              <p className="countries">{itinerary.countries_visited}</p>
              <div className="dates">
                <p>From {itinerary.start_date}</p>
                <p>To {itinerary.end_date}</p>
              </div>
              <div className="status">
                <span className={`badge badge-${itinerary.status}`}>{itinerary.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Itineraries;
