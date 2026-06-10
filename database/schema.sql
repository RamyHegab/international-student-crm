-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Universities Table
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(100),
  address TEXT,
  website VARCHAR(255),
  admin_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles Table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email, university_id)
);

-- Agents Table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  trading_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  account_manager VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  website VARCHAR(255),
  hq_country VARCHAR(100),
  hq_address TEXT,
  agent_code VARCHAR(100),
  agreement_start_date DATE,
  agreement_end_date DATE,
  countries_of_operation TEXT, -- comma-separated or JSON array
  main_contact_person VARCHAR(255),
  email VARCHAR(255),
  contact_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agent_code, university_id)
);

-- Agent Branches Table
CREATE TABLE agent_branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  branch_name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  google_maps_url TEXT,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  position VARCHAR(100),
  phone VARCHAR(20),
  in_country_trading_name VARCHAR(255),
  agency_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schools Table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  school_name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  google_maps_url TEXT,
  website VARCHAR(255),
  school_type VARCHAR(100), -- University, College, Secondary, Technical, etc.
  general_email VARCHAR(255),
  general_contact_number VARCHAR(20),
  primary_contact_person VARCHAR(255),
  primary_contact_email VARCHAR(255),
  primary_contact_phone VARCHAR(20),
  secondary_contact_person VARCHAR(255),
  secondary_contact_email VARCHAR(255),
  secondary_contact_phone VARCHAR(20),
  school_group VARCHAR(255),
  last_visited DATE,
  next_visit_date TIMESTAMP,
  number_of_visits INTEGER DEFAULT 0,
  overall_score DECIMAL(3, 1),
  files_media TEXT, -- JSON array of file paths/URLs
  position VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itineraries Table
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255),
  countries_visited TEXT, -- comma-separated or JSON array
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, approved
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Types Enum
CREATE TYPE activity_type AS ENUM (
  'travel',
  'agent_visit',
  'school_visit',
  'recruitment_event',
  'resting_day',
  'other'
);

-- Travel Types Enum
CREATE TYPE transport_type AS ENUM (
  'air',
  'train',
  'taxi',
  'bus',
  'car',
  'other'
);

-- Resting Day Types Enum
CREATE TYPE resting_type AS ENUM ('toil', 'weekend');

-- Activities Table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  activity_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  
  -- Agent Visit Fields
  agent_branch_id UUID REFERENCES agent_branches(id),
  
  -- School Visit Fields
  school_id UUID REFERENCES schools(id),
  
  -- Recruitment Event Fields
  venue_name VARCHAR(255),
  participation_cost DECIMAL(10, 2),
  
  -- Travel Fields
  transport_type transport_type,
  departure_date TIMESTAMP,
  departure_time TIME,
  arrival_date TIMESTAMP,
  arrival_time TIME,
  airline VARCHAR(100),
  flight_number VARCHAR(50),
  travel_cost DECIMAL(10, 2),
  
  -- Resting Day Fields
  resting_type resting_type,
  
  -- Common Fields
  notes TEXT,
  cost DECIMAL(10, 2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_agents_university_id ON agents(university_id);
CREATE INDEX idx_agent_branches_agent_id ON agent_branches(agent_id);
CREATE INDEX idx_agent_branches_country_city ON agent_branches(country, city);
CREATE INDEX idx_schools_university_id ON schools(university_id);
CREATE INDEX idx_schools_country_city ON schools(country, city);
CREATE INDEX idx_itineraries_university_id ON itineraries(university_id);
CREATE INDEX idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX idx_activities_itinerary_id ON activities(itinerary_id);
CREATE INDEX idx_activities_agent_branch_id ON activities(agent_branch_id);
CREATE INDEX idx_activities_school_id ON activities(school_id);
CREATE INDEX idx_users_university_id ON users(university_id);
CREATE INDEX idx_users_email ON users(email);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Full system access, university configuration'),
  ('director', 'Department oversight, approval authority'),
  ('manager', 'Regional management, itinerary oversight'),
  ('officer', 'Create and manage itineraries');

-- Insert University of Lincoln
INSERT INTO universities (name, country, address, website, admin_email) VALUES
  ('University of Lincoln', 'United Kingdom', 'Brayford Pool, Lincoln, LN6 7TS', 'https://www.lincoln.ac.uk', 'international@lincoln.ac.uk');
