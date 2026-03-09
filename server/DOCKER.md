# Docker Setup Guide

This project includes Docker configuration for both development and production environments.

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

## Quick Start

### Production Mode

1. **Build and run the application:**

```bash
docker-compose up -d
```

2. **View logs:**

```bash
docker-compose logs -f
```

3. **Stop the application:**

```bash
docker-compose down
```

4. **Stop and remove volumes:**

```bash
docker-compose down -v
```

### Development Mode

1. **Build and run in development:**

```bash
docker-compose -f docker-compose.dev.yml up
```

This will:

- Start PostgreSQL database
- Run the app with hot reload (ts-node-dev)
- Mount source code as volume for live updates
- Automatically run migrations

2. **Rebuild after dependency changes:**

```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Services

### PostgreSQL Database

- **Port:** 5432
- **User:** postgres
- **Password:** postgres123
- **Database:** patient_visits
- **Data persistence:** Using Docker volumes

### Application

- **Port:** 3000
- **Health check endpoint:** http://localhost:3000/health
- **API endpoints:** http://localhost:3000/api

## Available Commands

### Database Operations

**Run migrations in running container:**

```bash
docker-compose exec app npx prisma migrate deploy
```

**Generate Prisma Client:**

```bash
docker-compose exec app npx prisma generate
```

**Open Prisma Studio:**

```bash
docker-compose exec app npx prisma studio
```

**Seed database (if you have a seed script):**

```bash
docker-compose exec app npx prisma db seed
```

### Application Commands

**View application logs:**

```bash
docker-compose logs -f app
```

**View database logs:**

```bash
docker-compose logs -f postgres
```

**Execute commands in app container:**

```bash
docker-compose exec app sh
```

**Execute commands in database container:**

```bash
docker-compose exec postgres psql -U postgres -d patient_visits
```

## Environment Variables

You can override environment variables by creating a `.env.docker` file:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=patient_visits

# Application
NODE_ENV=production
PORT=3000
```

Then use it with docker-compose:

```bash
docker-compose --env-file .env.docker up
```

## Dockerfile Details

### Production Dockerfile (Dockerfile)

- **Multi-stage build** for smaller image size
- **Build stage:** Compiles TypeScript to JavaScript
- **Production stage:** Runs compiled JavaScript with minimal dependencies
- **Security:** Runs as non-root user
- **Health checks:** Built-in health monitoring

### Development Dockerfile (Dockerfile.dev)

- Single stage with all dev dependencies
- Hot reload enabled with ts-node-dev
- Source code mounted as volume
- Auto-runs migrations on startup

## Network Configuration

Both containers communicate through a custom bridge network `woundtech_network` for:

- Service discovery (app can connect to `postgres` hostname)
- Network isolation
- Better security

## Volume Management

**List volumes:**

```bash
docker volume ls | grep woundtech
```

**Inspect volume:**

```bash
docker volume inspect woundtech_postgres_data
```

**Backup database:**

```bash
docker-compose exec postgres pg_dump -U postgres patient_visits > backup.sql
```

**Restore database:**

```bash
docker-compose exec -T postgres psql -U postgres patient_visits < backup.sql
```

## Troubleshooting

### Database connection issues

```bash
# Check if postgres is healthy
docker-compose ps

# Check database logs
docker-compose logs postgres

# Verify connectivity from app
docker-compose exec app ping postgres
```

### Application not starting

```bash
# Check application logs
docker-compose logs app

# Verify environment variables
docker-compose exec app env

# Check if migrations ran
docker-compose exec app npx prisma migrate status
```

### Port conflicts

If ports 3000 or 5432 are already in use, modify the port mappings in docker-compose.yml:

```yaml
ports:
  - "3001:3000" # Change host port to 3001
```

## Production Deployment

For production deployments:

1. **Use secrets management** instead of hardcoded passwords
2. **Set strong DATABASE_URL** in environment
3. **Enable HTTPS** with reverse proxy (nginx, Traefik)
4. **Set up monitoring** and logging aggregation
5. **Configure backups** for PostgreSQL data volume
6. **Use container orchestration** (Kubernetes, Docker Swarm) for scaling

### Example with Docker Secrets

```yaml
services:
  postgres:
    secrets:
      - postgres_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password

secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
```

## Performance Tips

1. **Optimize image layers** - Group RUN commands
2. **Use .dockerignore** - Exclude unnecessary files
3. **Multi-stage builds** - Reduce final image size
4. **Volume caching** - Use bind mounts for node_modules in dev
5. **Health checks** - Enable proper startup dependency management
