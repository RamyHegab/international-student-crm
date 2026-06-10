import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Schools.css';

interface School {
  id: string;
  school_name: string;
  country: string;
  city: string;
  school_type: string;
  website: string;
}

interface SchoolsProps {
  universityId: string;
}

const Schools: React.FC<SchoolsProps> = ({ universityId }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCountry, setSearchCountry] = useState('');
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    fetchSchools();
  }, [universityId]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/schools/${universityId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSchools(response.data);
    } catch (error) {
      console.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchCountry && searchCity) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/schools/${universityId}/search/${searchCountry}/${searchCity}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSchools(response.data);
      } catch (error) {
        console.error('Failed to search schools');
      }
    }
  };

  if (loading) return <div className="container"><p>Loading schools...</p></div>;

  return (
    <div className="schools-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Schools</h1>
            <p>Manage partner schools worldwide</p>
          </div>
        </div>

        <div className="search-box">
          <div className="form-group">
            <input
              type="text"
              placeholder="Search by country"
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Search by city"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>
          <button className="button button-primary" onClick={handleSearch}>Search</button>
          <button className="button button-secondary" onClick={fetchSchools}>Reset</button>
        </div>

        <div className="schools-table">
          <table>
            <thead>
              <tr>
                <th>School Name</th>
                <th>Type</th>
                <th>Country</th>
                <th>City</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id}>
                  <td>{school.school_name}</td>
                  <td>{school.school_type}</td>
                  <td>{school.country}</td>
                  <td>{school.city}</td>
                  <td>
                    {school.website && (
                      <a href={school.website} target="_blank" rel="noopener noreferrer">Visit</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Schools;
