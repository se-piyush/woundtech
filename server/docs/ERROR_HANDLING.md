# Automatic Error Handling

This application implements automatic error handling inspired by Express 5's built-in promise support, but compatible with Express 4.

## How It Works

### 1. Custom Error Classes ([src/errors](src/errors))

All HTTP errors extend from a `BaseError` class that automatically logs errors with stack traces:

```typescript
// Throwing errors is simple and clean
throw new BadRequestError("Invalid input");
throw new NotFoundError("Resource not found");
throw new ConflictError("Duplicate record");
throw new UnauthorizedError("Authentication required");
throw new ForbiddenError("Insufficient permissions");
throw new InternalServerError("Something went wrong");
```

### 2. Async Handler Wrapper ([src/middleware/errorHandler.ts](src/middleware/errorHandler.ts))

The `asyncHandler` wrapper automatically catches rejected promises from async route handlers, mimicking Express 5's native promise support:

```typescript
// In Express 4, without asyncHandler, you'd need:
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    next(error); // Manual error forwarding
  }
});

// With asyncHandler, it's clean like Express 5:
app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await getUser(req.params.id);
    res.json(user);
    // No try-catch needed! asyncHandler catches errors automatically
  }),
);
```

### 3. Clean Controller Code

Controllers can simply throw errors without try-catch blocks:

```typescript
async getById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const clinician = await clinicianRepository.findById(id);

  // Just throw the error - asyncHandler catches it
  if (!clinician) {
    throw new NotFoundError('Clinician not found');
  }

  res.status(200).json(clinician);
}
```

### 4. Centralized Error Handler

All errors flow to a single error handler that:

- Logs errors with stack traces (colored by severity)
- Returns consistent JSON error responses
- Includes stack traces in development mode
- Handles both custom and unexpected errors

## Benefits

- **Cleaner Code**: No try-catch boilerplate in every async function
- **Automatic Logging**: All errors are logged with stack traces
- **Consistent Responses**: Standardized error format across the API
- **Type Safety**: TypeScript ensures proper error handling
- **Forward Compatible**: Similar to Express 5's native promise support

## Error Flow

```
Controller throws error
        ↓
asyncHandler catches promise rejection
        ↓
Error forwarded to centralized error handler
        ↓
Error logged with stack trace
        ↓
Formatted JSON response sent to client
```

## Example Error Response

```json
{
  "error": "Clinician not found",
  "stack": "NotFoundError: Clinician not found\n    at ClinicianController.getById..."
}
```

## Migration to Express 5

When upgrading to Express 5, you can simply:

1. Update the Express version in package.json
2. Remove the `asyncHandler` wrapper from routes (Express 5 handles this natively)
3. Keep all the custom error classes and error handler - they'll still work!

The error classes and centralized error handler are framework-agnostic and will continue to work with Express 5's native promise support.
