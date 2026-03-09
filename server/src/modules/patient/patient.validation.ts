import Joi from "joi";

export const patientValidation = {
  getAll: {
    query: Joi.object({
      page: Joi.number().integer().min(1).optional().messages({
        "number.base": "page must be a number",
        "number.min": "page must be at least 1",
      }),
      limit: Joi.number().integer().min(1).max(100).optional().messages({
        "number.base": "limit must be a number",
        "number.min": "limit must be at least 1",
        "number.max": "limit must not exceed 100",
      }),
      search: Joi.string().trim().max(100).optional().allow("").messages({
        "string.max": "search must not exceed 100 characters",
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
