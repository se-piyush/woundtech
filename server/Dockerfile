# Development Dockerfile with hot reload
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy TypeScript config
COPY tsconfig.json ./

# Expose port
EXPOSE 3000

# Start with hot reload
CMD ["sh", "-c", "npx prisma migrate dev && npm run dev"]
