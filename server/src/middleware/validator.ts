import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { BadRequestError } from "../errors";

interface ValidationSchema {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationOptions: Joi.ValidationOptions = {
      abortEarly: false, // Return all errors, not just the first one
    };

    const errors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error, value } = schema.body.validate(
        req.body,
        validationOptions,
      );
      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      }
    }

    // Validate request params
    if (schema.params) {
      const { error, value } = schema.params.validate(
        req.params,
        validationOptions,
      );
      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error } = schema.query.validate(req.query, validationOptions);
      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      }
    }

    // If there are validation errors, throw a BadRequestError
    if (errors.length > 0) {
      throw new BadRequestError(errors.join("; "));
    }

    next();
  };
};
