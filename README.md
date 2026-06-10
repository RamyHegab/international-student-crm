# International Student CRM System

A comprehensive Customer Relationship Management (CRM) system for international student recruitment at universities worldwide. Features agents management, schools database, and an advanced itinerary planner for recruitment trips.

## 🎯 Key Features

### 1. **Agents Management**
- Upload and manage recruitment agents
- Track agent branches across countries and cities
- Monitor agreements and contact details
- Google Maps integration for branch locations

### 2. **Schools Database**
- Comprehensive schools directory organized by country
- Track visits, contacts, and communication history
- Google Maps integration for school locations
- CSV import for bulk uploads

### 3. **Trip Itinerary Planner**
- Calendar-based activity scheduler
- Multiple activity types: Travel, Agent visit, School visit, Recruitment Event, Resting day
- Dynamic form fields based on activity type
- Real-time preview
- Export to PDF/Word

### 4. **User Management**
- Role-based access control (Admin, Director, Manager, Officer)
- Multi-university support
- Customizable permissions per university

## 📋 Activity Types

- **Travel**: Flight, train, taxi with departure/arrival times, airline info
- **Agent Visit**: Select agent branch
- **School Visit**: Select from schools list
- **Recruitment Event**: Select agent/venue + cost
- **Resting Day**: TOIL or Weekend (blocks full day)
- **Custom Activities**: Extensible for future needs

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Maps**: Google Maps API
- **Export**: jsPDF + docx
- **File Upload**: Multer (CSV)
- **Authentication**: JWT

## 📦 Project Structure

```
international-student-crm/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── server.ts
│   ├── migrations/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── styles/
│   │   └── App.tsx
│   ├── public/
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seeds/
└── docker-compose.yml
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Google Maps API Key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/RamyHegab/international-student-crm.git
cd international-student-crm
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database and API credentials
npm run migrate
npm run seed
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **Database Setup**
```bash
psql -U postgres -f database/schema.sql
```

## 📚 Database Schema

### Core Tables
- **universities** - Multi-tenant support
- **users** - User accounts and roles
- **agents** - Recruitment agents
- **agent_branches** - Agent office locations
- **schools** - Educational institutions
- **itineraries** - Trip itineraries
- **activities** - Individual trip activities
- **roles_permissions** - Role-based access control

## 🔐 User Roles

- **Admin** - Full system access, university configuration
- **Director** - Department oversight, approval authority
- **Manager** - Regional management, itinerary oversight
- **Officer** - Create and manage itineraries

## 📖 Documentation

- [Database Schema](./database/schema.sql)
- [API Documentation](./backend/API.md)
- [Frontend Components](./frontend/COMPONENTS.md)
- [Setup Guide](./SETUP.md)

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and create feature branches.

## 📄 License

MIT License - See LICENSE file

## 📧 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ for International Education Recruitment**
