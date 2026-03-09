import Joi from "joi";

export const visitValidation = {
  create: {
    body: Joi.object({
      clinicianId: Joi.string().uuid().required().messages({
        "string.guid": "clinicianId must be a valid UUID",
        "string.empty": "clinicianId is required",
        "any.required": "clinicianId is required",
      }),
      patientId: Joi.string().uuid().required().messages({
        "string.guid": "patientId must be a valid UUID",
        "string.empty": "patientId is required",
        "any.required": "patientId is required",
      }),
      visitDate: Joi.date().iso().required().messages({
        "date.base": "visitDate must be a valid date",
        "date.format": "visitDate must be in ISO 8601 format",
        "any.required": "visitDate is required",
      }),
      notes: Joi.string().trim().optional().allow("").messages({
        "string.base": "notes must be a string",
      }),
      diagnosis: Joi.string().trim().optional().allow("").messages({
        "string.base": "diagnosis must be a string",
      }),
      treatment: Joi.string().trim().optional().allow("").messages({
        "string.base": "treatment must be a string",
      }),
    }),
  },

  getAll: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1).messages({
        "number.base": "page must be a number",
        "number.integer": "page must be an integer",
        "number.min": "page must be at least 1",
      }),
      limit: Joi.number().integer().min(1).max(100).default(10).messages({
        "number.base": "limit must be a number",
        "number.integer": "limit must be an integer",
        "number.min": "limit must be at least 1",
        "number.max": "limit must not exceed 100",
      }),
      sortBy: Joi.string()
        .valid("visitDate", "createdAt", "updatedAt")
        .default("visitDate")
        .messages({
          "any.only": "sortBy must be one of: visitDate, createdAt, updatedAt",
        }),
      sortOrder: Joi.string()
        .valid("asc", "desc")
        .default("desc")
        .lowercase()
        .messages({
          "any.only": "sortOrder must be either asc or desc",
        }),
      clinicianId: Joi.string().uuid().optional().messages({
        "string.guid": "clinicianId must be a valid UUID",
      }),
      patientId: Joi.string().uuid().optional().messages({
        "string.guid": "patientId must be a valid UUID",
      }),
    }),
  },

  getById: {
    params: Joi.object({
      id: Joi.string().uuid().required().messages({
        "string.guid": "id must be a valid UUID",
        "any.required": "id is required",
      }),
    }),
  },
};
