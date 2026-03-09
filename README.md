# WoundTech - Patient Visit Tracker

A full-stack web application for tracking patient visits by clinicians.

## Project Structure (Monorepo)

```
woundtech/
├── server/          # Backend API (Node.js + Express + Prisma)
├── webapp/          # Frontend (React + TypeScript + Vite)
└── package.json     # Root workspace configuration
```

## Prerequisites

- Docker
- Node.js (v18 or higher)
- npm or yarn

## Running Applications

1. **Install all dependencies**

```bash
npm run install:all
```

2. **Run Postgres server on local**

```bash
docker-compose up -d
```

3. **Run database migration**

```bash
npm run prisma:setup
```

4. **Run both server and webapp concurrently**

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:webapp
```

- Backend API: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Swagger Docs: `http://localhost:3000/api-docs`

## Server Setup

See [server/README.md](server/README.md) for backend-specific instructions.

## Webapp Setup

See [webapp/README.md](webapp/README.md) for frontend-specific instructions.

## Features

### Backend

- RESTful API with Express.js
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- Role-based access control (SUPER, CLINICIAN, PATIENT)
- Swagger documentation
- Error handling middleware

### Frontend

- **Authentication**: Secure login required to access the application
- React with TypeScript
- Lists clinicians and patients
- Create new visits
- Display visits table with filtering
- Filter visits by clinician or patient
- Auto-logout on token expiration
- Responsive design

## Default Login Credentials

For testing and development:

```
Email: super@woundtech.com
Password: SuperPassword123
```

See [webapp/AUTHENTICATION.md](webapp/AUTHENTICATION.md) for detailed authentication documentation.

## API Endpoints

All API endpoints are versioned. The current version is v1.

### Authentication

- `POST /api/v1/auth/signin` - User login

### Clinicians

- `GET /api/v1/clinicians` - Get all clinicians (with pagination and search)
  - Query params:
    - `page` (default: 1) - Page number
    - `limit` (default: 10) - Items per page
    - `search` - Search by name or specialty
- `GET /api/v1/clinicians/:id` - Get a specific clinician with visit history

### Patients

- `GET /api/v1/patients` - Get all patients (with pagination and search)
  - Query params:
    - `page` (default: 1) - Page number
    - `limit` (default: 10) - Items per page
    - `search` - Search by name, email, or phone
- `GET /api/v1/patients/:id` - Get a specific patient with visit history

### Visits

- `POST /api/v1/visits` - Create a new visit
- `GET /api/v1/visits` - List visits with pagination, sorting, and filtering
  - Query params:
    - `page` (default: 1) - Page number
    - `limit` (default: 10) - Items per page
    - `sortBy` (default: visitDate) - Field to sort by
    - `sortOrder` (default: desc) - Sort order (asc/desc)
    - `clinicianId` - Filter by clinician ID
    - `patientId` - Filter by patient ID
- `GET /api/v1/visits/:id` - Get a specific visit with clinician and patient details

## Database Schema

- **Clinicians**: firstName, lastName, email, specialty
- **Patients**: firstName, lastName, dateOfBirth, email, phone
- **Visits**: clinicianId, patientId, visitDate, notes, diagnosis, treatment

## Architecture

The application follows clean architecture principles with a modular structure:

- **Modular Architecture**: Each feature (clinician, patient, visit) is self-contained in its own module
- **MVC Pattern**: Separation of concerns with Models, Views (JSON responses), and Controllers
- **Repository Pattern**: Data access layer abstraction for better testability
- **Custom Error Handling**: Automatic error logging with stack traces (see [ERROR_HANDLING.md](docs/ERROR_HANDLING.md))
- **TypeScript**: Type safety throughout the application
- **Prisma ORM**: Type-safe database queries with migrations

### Project Structure

```
src/
├── config/          # Database configuration
├── modules/         # Feature modules (modular architecture)
│   ├── clinician/
│   │   ├── clinician.controller.ts
│   │   ├── clinician.repository.ts
│   │   └── clinician.route.ts
│   ├── patient/
│   │   ├── patient.controller.ts
│   │   ├── patient.repository.ts
│   │   └── patient.route.ts
│   └── visit/
│       ├── visit.controller.ts
│       ├── visit.repository.ts
│       └── visit.route.ts
├── routes/          # Main route aggregator
├── middleware/      # Error handling and other middleware
├── errors/          # Custom error classes
├── types/           # TypeScript type definitions
└── index.ts         # Application entry point
```

## Features

- RESTful API with Express.js
- TypeScript for type safety
- PostgreSQL with Prisma ORM
- Repository pattern for data access
- MVC architecture
- Automatic error handling with logging
- Pagination, sorting, and filtering
- Database migrations
- Health check endpoint

## Error Handling

The application uses automatic error handling inspired by Express 5's promise support:

- No try-catch boilerplate needed
- Automatic error logging with stack traces
- Consistent JSON error responses
- Custom error classes for different HTTP status codes

For details, see [ERROR_HANDLING.md](docs/ERROR_HANDLING.md)
