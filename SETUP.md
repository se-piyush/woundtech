# WoundTech - Quick Setup Guide

This guide will help you get the WoundTech Patient Visit Tracker running quickly.

## Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm or yarn

## Initial Setup

### 1. Install All Dependencies

From the root directory:

```bash
npm run install:all
```

Or manually:

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Webapp dependencies
cd ../webapp
npm install
cd ..
```

### 2. Configure Database

#### Option A: Using Docker (Recommended)

```bash
cd server
docker-compose up -d
```

#### Option B: Local PostgreSQL

1. Create a PostgreSQL database named `patient_visits`
2. Copy `.env.example` to `.env` in the `server` directory
3. Update the `DATABASE_URL` with your PostgreSQL credentials

```bash
cd server
cp .env.example .env
# Edit .env with your database credentials
```

Example `.env`:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/patient_visits"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRY="1d"
PORT=3000
NODE_ENV=development
```

### 3. Setup Database Schema

Run migrations:

```bash
cd server
npm run prisma:migrate
```

### 4. Seed the Database (Optional)

Add sample data:

```bash
cd server
npm run prisma:seed
```

## Running the Application

### Development Mode

#### Option 1: Run Everything Together (Recommended)

From the root directory:

```bash
npm run dev
```

This will start:

- Backend API on `http://localhost:3000`
- Frontend on `http://localhost:5173`

#### Option 2: Run Separately

**Terminal 1 - Backend:**

```bash
npm run dev:server
```

**Terminal 2 - Frontend:**

```bash
npm run dev:webapp
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api-docs

### Login Credentials

When you first access the frontend, you'll be prompted to login. Use:

```
Email: super@woundtech.com
Password: SuperPassword123
```

**Note:** These credentials are created during database seeding. If you haven't run `npm run prisma:seed`, you'll need to do so first.

## Production Build

Build all applications:

```bash
npm run build
```

Or separately:

```bash
# Backend
npm run build:server

# Frontend
npm run build:webapp
```

## Common Issues

### Port Already in Use

If port 3000 or 5173 is already in use:

- **Backend:** Change `PORT` in `server/.env`
- **Frontend:** Change `port` in `webapp/vite.config.ts` and update the proxy target

### Database Connection Error

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `server/.env`
- Ensure the database exists

### API Requests Failing

- Ensure backend is running on port 3000
- Check browser console for errors
- Verify proxy settings in `webapp/vite.config.ts`

## Project Structure

```
woundtech/
├── server/              # Backend (Express + Prisma + PostgreSQL)
│   ├── src/            # Source code
│   ├── prisma/         # Database schema and migrations
│   └── package.json
├── webapp/             # Frontend (React + TypeScript + Vite)
│   ├── src/           # Source code
│   └── package.json
├── package.json       # Root workspace configuration
└── README.md
```

## What's Next?

1. **Customize the application** - Add more features as needed
2. **Add authentication** - The backend has auth endpoints ready
3. **Deploy** - See deployment guides in server and webapp README files
4. **Add tests** - Implement unit and integration tests

## Need Help?

- Check individual README files in `server/` and `webapp/` directories
- Review API documentation at http://localhost:3000/api-docs
- Check the error logs in the terminal

---

Happy coding! 🚀
