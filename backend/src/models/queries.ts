import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// ==================== AGENTS ====================
export const agentQueries = {
  create: async (universityId: string, data: any) => {
    const id = uuidv4();
    const query = `
      INSERT INTO agents (id, university_id, trading_name, legal_name, account_manager, status, website, hq_country, hq_address, agent_code, agreement_start_date, agreement_end_date, countries_of_operation, main_contact_person, email, contact_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;
    const values = [id, universityId, data.trading_name, data.legal_name, data.account_manager, data.status || 'active', data.website, data.hq_country, data.hq_address, data.agent_code, data.agreement_start_date, data.agreement_end_date, data.countries_of_operation, data.main_contact_person, data.email, data.contact_number];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getById: async (id: string) => {
    const query = 'SELECT * FROM agents WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  getByUniversity: async (universityId: string) => {
    const query = 'SELECT * FROM agents WHERE university_id = $1 ORDER BY created_at DESC;';
    const result = await pool.query(query, [universityId]);
    return result.rows;
  },

  update: async (id: string, data: any) => {
    const fields = Object.keys(data).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const query = `UPDATE agents SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`;
    const values = [id, ...Object.values(data)];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id: string) => {
    const query = 'DELETE FROM agents WHERE id = $1;';
    await pool.query(query, [id]);
  }
};

// ==================== AGENT BRANCHES ====================
export const agentBranchQueries = {
  create: async (data: any) => {
    const id = uuidv4();
    const query = `
      INSERT INTO agent_branches (id, agent_id, branch_name, country, city, address, latitude, longitude, google_maps_url, first_name, last_name, email, position, phone, in_country_trading_name, agency_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;
    const values = [id, data.agent_id, data.branch_name, data.country, data.city, data.address, data.latitude, data.longitude, data.google_maps_url, data.first_name, data.last_name, data.email, data.position, data.phone, data.in_country_trading_name, data.agency_name];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getByAgent: async (agentId: string) => {
    const query = 'SELECT * FROM agent_branches WHERE agent_id = $1 ORDER BY created_at DESC;';
    const result = await pool.query(query, [agentId]);
    return result.rows;
  },

  getByCountryCity: async (country: string, city: string) => {
    const query = 'SELECT * FROM agent_branches WHERE country = $1 AND city = $2 ORDER BY created_at DESC;';
    const result = await pool.query(query, [country, city]);
    return result.rows;
  },

  update: async (id: string, data: any) => {
    const fields = Object.keys(data).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const query = `UPDATE agent_branches SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`;
    const values = [id, ...Object.values(data)];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id: string) => {
    const query = 'DELETE FROM agent_branches WHERE id = $1;';
    await pool.query(query, [id]);
  }
};

// ==================== SCHOOLS ====================
export const schoolQueries = {
  create: async (universityId: string, data: any) => {
    const id = uuidv4();
    const query = `
      INSERT INTO schools (id, university_id, school_name, country, city, region, address, latitude, longitude, google_maps_url, website, school_type, general_email, general_contact_number, primary_contact_person, primary_contact_email, primary_contact_phone, secondary_contact_person, secondary_contact_email, secondary_contact_phone, school_group, last_visited, next_visit_date, number_of_visits, overall_score, files_media, position)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
      RETURNING *;
    `;
    const values = [id, universityId, data.school_name, data.country, data.city, data.region, data.address, data.latitude, data.longitude, data.google_maps_url, data.website, data.school_type, data.general_email, data.general_contact_number, data.primary_contact_person, data.primary_contact_email, data.primary_contact_phone, data.secondary_contact_person, data.secondary_contact_email, data.secondary_contact_phone, data.school_group, data.last_visited, data.next_visit_date, data.number_of_visits || 0, data.overall_score, data.files_media, data.position];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getById: async (id: string) => {
    const query = 'SELECT * FROM schools WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  getByUniversity: async (universityId: string) => {
    const query = 'SELECT * FROM schools WHERE university_id = $1 ORDER BY created_at DESC;';
    const result = await pool.query(query, [universityId]);
    return result.rows;
  },

  getByCountryCity: async (universityId: string, country: string, city: string) => {
    const query = 'SELECT * FROM schools WHERE university_id = $1 AND country = $2 AND city = $3 ORDER BY school_name;';
    const result = await pool.query(query, [universityId, country, city]);
    return result.rows;
  },

  update: async (id: string, data: any) => {
    const fields = Object.keys(data).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const query = `UPDATE schools SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`;
    const values = [id, ...Object.values(data)];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id: string) => {
    const query = 'DELETE FROM schools WHERE id = $1;';
    await pool.query(query, [id]);
  }
};

// ==================== ITINERARIES ====================
export const itineraryQueries = {
  create: async (universityId: string, userId: string, data: any) => {
    const id = uuidv4();
    const query = `
      INSERT INTO itineraries (id, university_id, user_id, title, countries_visited, start_date, end_date, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [id, universityId, userId, data.title, data.countries_visited, data.start_date, data.end_date, data.status || 'draft', data.notes];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getById: async (id: string) => {
    const query = 'SELECT * FROM itineraries WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  getByUser: async (userId: string) => {
    const query = 'SELECT * FROM itineraries WHERE user_id = $1 ORDER BY start_date DESC;';
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  getByUniversity: async (universityId: string) => {
    const query = 'SELECT * FROM itineraries WHERE university_id = $1 ORDER BY start_date DESC;';
    const result = await pool.query(query, [universityId]);
    return result.rows;
  },

  update: async (id: string, data: any) => {
    const fields = Object.keys(data).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const query = `UPDATE itineraries SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`;
    const values = [id, ...Object.values(data)];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id: string) => {
    const query = 'DELETE FROM itineraries WHERE id = $1;';
    await pool.query(query, [id]);
  }
};

// ==================== ACTIVITIES ====================
export const activityQueries = {
  create: async (itineraryId: string, data: any) => {
    const id = uuidv4();
    const query = `
      INSERT INTO activities (id, itinerary_id, activity_type, activity_date, start_time, end_time, agent_branch_id, school_id, venue_name, participation_cost, transport_type, departure_date, departure_time, arrival_date, arrival_time, airline, flight_number, travel_cost, resting_type, notes, cost)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *;
    `;
    const values = [id, itineraryId, data.activity_type, data.activity_date, data.start_time, data.end_time, data.agent_branch_id, data.school_id, data.venue_name, data.participation_cost, data.transport_type, data.departure_date, data.departure_time, data.arrival_date, data.arrival_time, data.airline, data.flight_number, data.travel_cost, data.resting_type, data.notes, data.cost];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getByItinerary: async (itineraryId: string) => {
    const query = 'SELECT * FROM activities WHERE itinerary_id = $1 ORDER BY activity_date, start_time;';
    const result = await pool.query(query, [itineraryId]);
    return result.rows;
  },

  update: async (id: string, data: any) => {
    const fields = Object.keys(data).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const query = `UPDATE activities SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`;
    const values = [id, ...Object.values(data)];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id: string) => {
    const query = 'DELETE FROM activities WHERE id = $1;';
    await pool.query(query, [id]);
  }
};

// ==================== USERS ====================
export const userQueries = {
  create: async (data: any) => {
    const id = uuidv4();
    const query = `
      INSERT INTO users (id, university_id, role_id, first_name, last_name, email, password_hash, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, university_id, role_id, first_name, last_name, email, status, created_at;
    `;
    const values = [id, data.university_id, data.role_id, data.first_name, data.last_name, data.email, data.password_hash, data.status || 'active'];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getByEmail: async (email: string) => {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  getById: async (id: string) => {
    const query = 'SELECT id, university_id, role_id, first_name, last_name, email, status, created_at FROM users WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  getByUniversity: async (universityId: string) => {
    const query = 'SELECT id, university_id, role_id, first_name, last_name, email, status, created_at FROM users WHERE university_id = $1 ORDER BY created_at DESC;';
    const result = await pool.query(query, [universityId]);
    return result.rows;
  },

  update: async (id: string, data: any) => {
    const fields = Object.keys(data).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const query = `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, university_id, role_id, first_name, last_name, email, status, created_at;`;
    const values = [id, ...Object.values(data)];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};
