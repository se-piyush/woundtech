import Joi from "joi";

export const authValidation = {
  signin: {
    body: Joi.object({
      email: Joi.string().trim().email().required().messages({
        "string.empty": "email is required",
        "string.email": "email must be a valid email address",
        "any.required": "email is required",
      }),
      password: Joi.string().min(6).required().messages({
        "string.empty": "password is required",
        "string.min": "password must be at least 6 characters long",
        "any.required": "password is required",
      }),
    }),
  },
};
