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

### Option 1: Docker (Recommended)

- Docker (v20.10+)
- Docker Compose (v2.0+)

### Option 2: Local Development

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Quick Start

### Install all dependencies

```bash
npm run install:all
```

### Development

Run both server and webapp concurrently:

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

### Production Build

```bash
npm run build
```

## Server Setup

See [server/README.md](server/README.md) for backend-specific instructions.

## Webapp Setup

See [webapp/README.md](webapp/README.md) for frontend-specific instructions.

## Quick Start with Docker

**Production:**

```bash
docker-compose up -d
```

**Development with hot reload:**

```bash
docker-compose -f docker-compose.dev.yml up
```

The application will be available at `http://localhost:3000`

For detailed Docker instructions, see [DOCKER.md](server/DOCKER.md)

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

## Local Setup (Without Docker)

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

   Copy `.env.example` to `.env` and update with your PostgreSQL credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/patient_visits?schema=public"
   PORT=3000
   NODE_ENV=development
   ```

3. **Run database migrations:**

```bash
npm run prisma:migrate
```

4. **Generate Prisma Client:**

```bash
npm run prisma:generate
```

## Running the Application

### Development mode:

```bash
npm run dev
```

### Production mode:

```bash
npm run build
npm start
```

### Open Prisma Studio (Database GUI):

```bash
npm run prisma:studio
```

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User login

### Clinicians

- `GET /api/clinicians` - Get all clinicians (with pagination and search)
  - Query params:
    - `page` (default: 1) - Page number
    - `limit` (default: 10) - Items per page
    - `search` - Search by name or specialty
- `GET /api/clinicians/:id` - Get a specific clinician with visit history

### Patients

- `GET /api/patients` - Get all patients (with pagination and search)
  - Query params:
    - `page` (default: 1) - Page number
    - `limit` (default: 10) - Items per page
    - `search` - Search by name, email, or phone
- `GET /api/patients/:id` - Get a specific patient with visit history

### Visits

- `POST /api/visits` - Create a new visit
- `GET /api/visits` - List visits with pagination, sorting, and filtering
  - Query params:
    - `page` (default: 1) - Page number
    - `limit` (default: 10) - Items per page
    - `sortBy` (default: visitDate) - Field to sort by
    - `sortOrder` (default: desc) - Sort order (asc/desc)
    - `clinicianId` - Filter by clinician ID
    - `patientId` - Filter by patient ID
- `GET /api/visits/:id` - Get a specific visit with clinician and patient details

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
- Docker support (development & production)
- Database migrations
- Health check endpoint

## Error Handling

The application uses automatic error handling inspired by Express 5's promise support:

- No try-catch boilerplate needed
- Automatic error logging with stack traces
- Consistent JSON error responses
- Custom error classes for different HTTP status codes

For details, see [ERROR_HANDLING.md](docs/ERROR_HANDLING.md)

## Docker Commands

**Start services:**

```bash
docker-compose up -d
```

**View logs:**

```bash
docker-compose logs -f
```

**Run migrations:**

```bash
docker-compose exec app npx prisma migrate deploy
```

**Access database:**

```bash
docker-compose exec postgres psql -U postgres -d patient_visits
```

**Stop services:**

```bash
docker-compose down
```

For more Docker commands, see [DOCKER.md](DOCKER.md)

## Environment Variables

| Variable       | Description                          | Default     |
| -------------- | ------------------------------------ | ----------- |
| `DATABASE_URL` | PostgreSQL connection string         | -           |
| `PORT`         | Application port                     | 3000        |
| `NODE_ENV`     | Environment (development/production) | development |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC
