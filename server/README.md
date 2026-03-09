# Server - Patient Visit Tracker API

Backend API for the WoundTech patient visit tracking application.

## Tech Stack

- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI documentation

## Prerequisites

- Node.js (v18 or higher)
- Docker

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Run Postgres**

go to workspace directory and run

```bash
docker-compose up -d
```

3. **Run database migrations:**

```bash
npm run prisma:migrate
```

4. **Seed the database:**

```bash
npm run prisma:seed
```

5. **Run server**

```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## API Documentation

Swagger documentation is available at `http://localhost:3000/api-docs`

## API Endpoints

All API endpoints are versioned. The current version is v1.

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login

### Clinicians

- `GET /api/v1/clinicians` - Get all clinicians
- `GET /api/v1/clinicians/:id` - Get clinician by ID

### Patients

- `GET /api/v1/patients` - Get all patients
- `GET /api/v1/patients/:id` - Get patient by ID

### Visits

- `GET /api/v1/visits` - Get all visits (with pagination and filtering)
  - Query params: `page`, `limit`, `clinicianId`, `patientId`, `sortBy`, `sortOrder`
- `POST /api/v1/visits` - Create a new visit
- `GET /api/v1/visits/:id` - Get visit by ID

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed the database
