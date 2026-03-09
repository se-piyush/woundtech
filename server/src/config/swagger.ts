import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Patient Visit Tracker API",
      version: "1.0.0",
      description:
        "API documentation for the Patient Visit Tracker application. Track patient visits by clinicians with comprehensive CRUD operations, pagination, sorting, and filtering.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "http://localhost:3000",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Clinicians",
        description: "Clinician management endpoints",
      },
      {
        name: "Patients",
        description: "Patient management endpoints",
      },
      {
        name: "Visits",
        description:
          "Visit tracking endpoints with pagination, sorting, and filtering",
      },
    ],
    components: {
      schemas: {
        Clinician: {
          type: "object",
          required: ["firstName", "lastName", "email"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            firstName: {
              type: "string",
              description: "First name of the clinician",
              example: "John",
            },
            lastName: {
              type: "string",
              description: "Last name of the clinician",
              example: "Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address (unique)",
              example: "john.doe@hospital.com",
            },
            specialty: {
              type: "string",
              description: "Medical specialty",
              example: "Cardiology",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Patient: {
          type: "object",
          required: ["firstName", "lastName", "dateOfBirth"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier",
              example: "660e8400-e29b-41d4-a716-446655440001",
            },
            firstName: {
              type: "string",
              description: "First name of the patient",
              example: "Jane",
            },
            lastName: {
              type: "string",
              description: "Last name of the patient",
              example: "Smith",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description: "Date of birth",
              example: "1990-05-15",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address (unique, optional)",
              example: "jane.smith@email.com",
              nullable: true,
            },
            phone: {
              type: "string",
              description: "Phone number",
              example: "+1-555-123-4567",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Visit: {
          type: "object",
          required: ["clinicianId", "patientId", "visitDate"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier",
              example: "770e8400-e29b-41d4-a716-446655440002",
            },
            clinicianId: {
              type: "string",
              format: "uuid",
              description: "ID of the clinician",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            patientId: {
              type: "string",
              format: "uuid",
              description: "ID of the patient",
              example: "660e8400-e29b-41d4-a716-446655440001",
            },
            visitDate: {
              type: "string",
              format: "date-time",
              description: "Date and time of the visit",
              example: "2026-03-08T10:30:00Z",
            },
            notes: {
              type: "string",
              description: "Visit notes",
              example: "Patient presented with chest pain",
              nullable: true,
            },
            diagnosis: {
              type: "string",
              description: "Diagnosis",
              example: "Acute myocardial infarction",
              nullable: true,
            },
            treatment: {
              type: "string",
              description: "Treatment plan",
              example: "Prescribed aspirin and statins",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
              example: "Resource not found",
            },
            stack: {
              type: "string",
              description: "Stack trace (development mode only)",
              nullable: true,
            },
          },
        },
        PaginatedVisits: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Visit",
              },
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "integer",
                  description: "Current page number",
                  example: 1,
                },
                limit: {
                  type: "integer",
                  description: "Items per page",
                  example: 10,
                },
                total: {
                  type: "integer",
                  description: "Total number of items",
                  example: 50,
                },
                totalPages: {
                  type: "integer",
                  description: "Total number of pages",
                  example: 5,
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/swagger/*.swagger.ts", "./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
