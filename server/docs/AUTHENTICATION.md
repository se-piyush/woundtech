# Authentication System Documentation

## Overview

The application uses a unified authentication system with a central `users` table. Users can have different roles (CLINICIAN, PATIENT, SUPER), and authentication is handled via JWT tokens with a 1-hour expiration.

## Database Schema Changes

### User Model

- **id**: UUID (primary key)
- **email**: String (unique)
- **password**: String (hashed with bcrypt)
- **role**: UserRole enum (CLINICIAN, PATIENT, SUPER)
- **createdAt**: DateTime
- **updatedAt**: DateTime

### Clinician Model

- Now links to User via **userId** (required, unique)
- Removed **email** field (moved to User table)
- **userId** has cascade delete (deleting user deletes clinician profile)

### Patient Model

- Now links to User via **userId** (optional, unique)
- Removed **email** field (moved to User table)
- **userId** is optional (patients without user accounts are still supported)
- **userId** has SET NULL on delete

## User Roles

### SUPER

- Internal admin user with access to all APIs
- Can perform any operation in the system
- Not required to have clinician or patient profiles

### CLINICIAN

- Healthcare providers who manage patient visits
- Must have a corresponding Clinician profile
- Can only be linked to one Clinician profile

### PATIENT

- Patients who receive care
- Optionally have a Patient profile
- Patient records can exist without user accounts

## Authentication API

### Sign In

**Endpoint:** `POST /api/auth/signin`

**Request Body:**

```json
{
  "email": "super@woundtech.com",
  "password": "SuperPassword123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "super@woundtech.com",
    "role": "SUPER"
  }
}
```

**Token Expiration:** 1 hour

## Demo Super User

A demo super user is automatically created when you run the seed script:

**Credentials:**

- Email: `super@woundtech.com`
- Password: `SuperPassword123`
- Role: `SUPER`

### Running the Seed Script

```bash
npm run prisma:seed
```

## Using Authentication

### 1. Sign In

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "super@woundtech.com",
    "password": "SuperPassword123"
  }'
```

### 2. Use Token in Requests

Add the token to the `Authorization` header:

```bash
curl -X GET http://localhost:3000/api/clinicians \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Middleware

### `authenticate`

Verifies JWT token and adds user information to `req.user`

### `authorize(...roles)`

Checks if authenticated user has one of the specified roles

### `requireAuth`

Combination middleware that:

- Authenticates the user
- Allows SUPER users to access all APIs
- Can be extended for role-specific access control

## API Changes

### Clinician APIs

#### Create Clinician

**Changed:** Now requires `userId` instead of `email`

**Before:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@hospital.com",
  "specialty": "Cardiology"
}
```

**After:**

```json
{
  "userId": "user-uuid-here",
  "firstName": "John",
  "lastName": "Doe",
  "specialty": "Cardiology"
}
```

**Validations:**

- `userId` must be a valid UUID
- User must exist
- User must have CLINICIAN role
- User cannot already have a clinician profile

#### Update Clinician

**Changed:** Removed `email` field

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "specialty": "Neurology"
}
```

### Patient APIs

#### Create Patient

**Changed:** `userId` is now optional (replacing optional `email`)

**Before:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "email": "jane@email.com",
  "phone": "+1-555-123-4567"
}
```

**After:**

```json
{
  "userId": "user-uuid-here",
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "phone": "+1-555-123-4567"
}
```

**Validations (if userId provided):**

- `userId` must be a valid UUID
- User must exist
- User must have PATIENT role
- User cannot already have a patient profile

#### Update Patient

**Changed:** Removed `email` field

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "phone": "+1-555-987-6543"
}
```

## Environment Variables

Add to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
```

**Important:** Change the JWT_SECRET in production to a strong, random value.

## Migration

The old migration has been removed and replaced with a new migration that includes:

- User table with role-based authentication
- Updated Clinician table (linked to User)
- Updated Patient table (optionally linked to User)
- Proper foreign key constraints and cascading rules

To apply the migration:

```bash
npm run prisma:migrate
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
2. **JWT Tokens**: Stateless authentication with 1-hour expiration
3. **Role-Based Access Control**: Different roles have different permissions
4. **Input Validation**: All inputs are validated using Joi schemas
5. **UUID Validation**: All IDs are validated as proper UUIDs

## Future Enhancements

Consider implementing:

1. **Token Refresh**: Add refresh tokens for extended sessions
2. **Password Reset**: Email-based password recovery
3. **Rate Limiting**: Prevent brute force attacks on signin
4. **Audit Logging**: Track authentication events
5. **Two-Factor Authentication**: Additional security layer
6. **Role-Specific Endpoints**: Restrict certain APIs by role

## Testing Authentication

1. **Start the server:**

   ```bash
   npm run dev
   ```

2. **Sign in as super user:**

   ```bash
   curl -X POST http://localhost:3000/api/auth/signin \
     -H "Content-Type: application/json" \
     -d '{"email":"super@woundtech.com","password":"SuperPassword123"}'
   ```

3. **Copy the token from response**

4. **Use token in API calls:**
   ```bash
   curl http://localhost:3000/api/clinicians \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## Troubleshooting

### Token Expired

Error: "Invalid or expired token"

- Sign in again to get a new token
- Tokens expire after 1 hour

### Invalid Credentials

Error: "Invalid credentials"

- Check email and password are correct
- Ensure super user was created (run seed script)

### User Role Mismatch

Error: "User must have CLINICIAN role"

- Ensure the userId belongs to a user with the correct role
- Create a user with the appropriate role first

### Duplicate Profile

Error: "Clinician profile already exists for this user"

- A user can only have one clinician or patient profile
- Use a different userId or update the existing profile
