# International Student CRM 🌍

A comprehensive recruitment management system designed for universities to manage international student recruitment activities, track recruitment agents and partner schools, and plan recruitment itineraries.

## 📋 Features

### Core Functionality
- **Agent Management** - Manage recruitment agents and their branches worldwide
- **School Management** - Track partner schools with detailed information and geographic data
- **Itinerary Planning** - Create and manage recruitment trips with activities and scheduling
- **Activity Tracking** - Log visits, meetings, and recruitment activities
- **User Authentication** - Secure role-based access control
- **CSV Import** - Bulk import schools and agents from CSV files
- **Document Export** - Export itineraries as PDF and Word documents
- **Geographic Search** - Find agents and schools by location

### Technical Features
- Modern React/TypeScript frontend
- Express.js/Node.js backend with TypeScript
- PostgreSQL database with connection pooling
- JWT-based authentication
- RESTful API design
- Real-time data updates
- Responsive design for mobile and desktop

## 🏗️ Architecture

### Backend Structure
```
backend/
├── src/
│   ├── server.ts          # Main Express application
│   ├── config/
│   │   └── database.ts    # PostgreSQL connection pool
│   ├── models/
│   │   └── queries.ts     # Database queries for all entities
│   └── routes/
│       ├── auth.ts        # Authentication endpoints
│       ├── agents.ts      # Agent and branch management
│       ├── schools.ts     # School management with CSV upload
│       └── itineraries.ts # Itinerary and activity management
├── .env.example           # Environment variables template
└── tsconfig.json          # TypeScript configuration
```

### Frontend Structure
```
frontend/
├── src/
│   ├── App.tsx            # Main application component
│   ├── pages/
│   │   ├── Login.tsx      # Authentication page
│   │   ├── Dashboard.tsx  # Home dashboard
│   │   ├── Agents.tsx     # Agent management page
│   │   ├── Schools.tsx    # School management page
│   │   └── Itineraries.tsx # Itinerary planning page
│   ├── components/
│   │   └── Navigation.tsx # Navigation bar component
│   └── [CSS files]        # Styling for all pages
├── public/
│   └── index.html         # HTML entry point
├── tsconfig.json          # TypeScript configuration
└── .env.example           # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=international_crm
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   PORT=5000
   NODE_ENV=development
   
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   
   FRONTEND_URL=http://localhost:3000
   ```

4. **Create PostgreSQL database:**
   ```bash
   createdb international_crm
   ```

5. **Build TypeScript:**
   ```bash
   npm run build
   ```

6. **Start the server:**
   ```bash
   npm start
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

   Frontend runs on `http://localhost:3000`

## 📚 Database Schema

### Main Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  university_id UUID NOT NULL,
  role_id UUID,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Agents
```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY,
  university_id UUID NOT NULL,
  trading_name VARCHAR(255),
  legal_name VARCHAR(255),
  account_manager VARCHAR(255),
  status VARCHAR(20),
  website VARCHAR(255),
  hq_country VARCHAR(100),
  hq_address TEXT,
  agent_code VARCHAR(50),
  agreement_start_date DATE,
  agreement_end_date DATE,
  countries_of_operation TEXT,
  main_contact_person VARCHAR(255),
  email VARCHAR(255),
  contact_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Agent Branches
```sql
CREATE TABLE agent_branches (
  id UUID PRIMARY KEY,
  agent_id UUID NOT NULL,
  branch_name VARCHAR(255),
  country VARCHAR(100),
  city VARCHAR(100),
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
```

#### Schools
```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY,
  university_id UUID NOT NULL,
  school_name VARCHAR(255),
  country VARCHAR(100),
  city VARCHAR(100),
  region VARCHAR(100),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  google_maps_url TEXT,
  website VARCHAR(255),
  school_type VARCHAR(100),
  general_email VARCHAR(255),
  general_contact_number VARCHAR(20),
  primary_contact_person VARCHAR(255),
  primary_contact_email VARCHAR(255),
  primary_contact_phone VARCHAR(20),
  secondary_contact_person VARCHAR(255),
  secondary_contact_email VARCHAR(255),
  secondary_contact_phone VARCHAR(20),
  school_group VARCHAR(100),
  last_visited DATE,
  next_visit_date DATE,
  number_of_visits INT DEFAULT 0,
  overall_score DECIMAL(3, 2),
  files_media JSONB,
  position VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Itineraries
```sql
CREATE TABLE itineraries (
  id UUID PRIMARY KEY,
  university_id UUID NOT NULL,
  user_id UUID NOT NULL,
  title VARCHAR(255),
  countries_visited TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Activities
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY,
  itinerary_id UUID NOT NULL,
  activity_type VARCHAR(100),
  activity_date DATE,
  start_time TIME,
  end_time TIME,
  agent_branch_id UUID,
  school_id UUID,
  venue_name VARCHAR(255),
  participation_cost DECIMAL(10, 2),
  transport_type VARCHAR(100),
  departure_date DATE,
  departure_time TIME,
  arrival_date DATE,
  arrival_time TIME,
  airline VARCHAR(100),
  flight_number VARCHAR(50),
  travel_cost DECIMAL(10, 2),
  resting_type VARCHAR(100),
  notes TEXT,
  cost DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Agents
- `GET /api/agents/:universityId` - List all agents
- `POST /api/agents/` - Create agent
- `GET /api/agents/:universityId/:id` - Get agent details
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Agent Branches
- `GET /api/agents/:agentId/branches` - List branches
- `POST /api/agents/:agentId/branches` - Create branch
- `GET /api/agents/search/:country/:city` - Search by location
- `PUT /api/agents/branches/:id` - Update branch
- `DELETE /api/agents/branches/:id` - Delete branch

### Schools
- `GET /api/schools/:universityId` - List all schools
- `POST /api/schools/` - Create school
- `GET /api/schools/:universityId/:id` - Get school details
- `GET /api/schools/:universityId/search/:country/:city` - Search schools
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school
- `POST /api/schools/upload/csv` - Bulk import from CSV

### Itineraries
- `GET /api/itineraries/user/:userId` - List user itineraries
- `GET /api/itineraries/university/:universityId` - List university itineraries
- `POST /api/itineraries/` - Create itinerary
- `GET /api/itineraries/:id` - Get itinerary with activities
- `PUT /api/itineraries/:id` - Update itinerary
- `DELETE /api/itineraries/:id` - Delete itinerary
- `GET /api/itineraries/:id/export/pdf` - Export as PDF
- `GET /api/itineraries/:id/export/word` - Export as Word

### Activities
- `GET /api/itineraries/:itineraryId/activities` - List activities
- `POST /api/itineraries/:itineraryId/activities` - Create activity
- `PUT /api/itineraries/activities/:id` - Update activity
- `DELETE /api/itineraries/activities/:id` - Delete activity

## 🎯 Usage Examples

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@university.edu",
    "password": "securepassword",
    "first_name": "John",
    "last_name": "Doe",
    "university_id": "univ-123",
    "role_id": "role-123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@university.edu",
    "password": "securepassword"
  }'
```

### Create an Agent
```bash
curl -X POST http://localhost:5000/api/agents/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "universityId": "univ-123",
    "trading_name": "Global Recruitment Partners",
    "legal_name": "Global Recruitment Partners Ltd",
    "hq_country": "Singapore",
    "email": "contact@grp.sg",
    "contact_number": "+65 1234 5678"
  }'
```

### Create an Itinerary
```bash
curl -X POST http://localhost:5000/api/itineraries/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "universityId": "univ-123",
    "userId": "user-123",
    "title": "Southeast Asia Recruitment Tour 2024",
    "countries_visited": "Vietnam, Thailand, Malaysia",
    "start_date": "2024-03-01",
    "end_date": "2024-03-21"
  }'
```

## 🔒 Security

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **CORS** - Cross-origin resource sharing configured
- **Environment Variables** - Sensitive data stored in .env files
- **SQL Injection Prevention** - Parameterized queries via pg library
- **Input Validation** - Server-side validation of all inputs

## 📦 Dependencies

### Backend
- express - Web framework
- pg - PostgreSQL client
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- uuid - UUID generation
- pdfkit - PDF generation
- docx - Word document generation
- multer - File upload handling
- cors - CORS middleware
- dotenv - Environment variables

### Frontend
- react - UI library
- react-router-dom - Client-side routing
- axios - HTTP client
- leaflet - Map library
- react-leaflet - React wrapper for Leaflet
- react-hook-form - Form management
- date-fns - Date utilities
- typescript - Type safety

## 📝 Environment Variables

### Backend (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=international_crm
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Google Maps API
GOOGLE_MAPS_API_KEY=your_api_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Backend Deployment (Heroku)
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set DATABASE_URL=postgres://...
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'build' directory
```

## 📊 Database Setup

### Create Database
```bash
psql -U postgres
CREATE DATABASE international_crm;
\c international_crm
```

### Run Migrations
Create SQL migration files in `backend/migrations/` and run:
```bash
psql -U postgres -d international_crm -f migrations/001_initial_schema.sql
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@international-crm.com or create an issue on GitHub.

## 🗺️ Roadmap

- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Integration with calendar systems
- [ ] Video conferencing integration
- [ ] Social media integration
- [ ] ML-based recommendations
- [ ] Advanced reporting system

---

**Built with ❤️ for International Student Recruitment**
