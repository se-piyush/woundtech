import { Router } from "express";
import { PatientController } from "./patient.controller";
import { PatientService } from "./patient.service";
import { PatientRepository } from "./patient.repository";
import { asyncHandler } from "../../middleware/errorHandler";
import { validate } from "../../middleware/validator";
import { patientValidation } from "./patient.validation";

const router = Router();

// Initialize dependencies
const patientRepository = new PatientRepository();
const patientService = new PatientService(patientRepository);
const patientController = new PatientController(patientService);

router.get(
  "/",
  validate(patientValidation.getAll),
  asyncHandler((req, res) => patientController.getAll(req, res)),
);

router.get(
  "/:id",
  validate(patientValidation.getById),
  asyncHandler((req, res) => patientController.getById(req, res)),
);

export default router;
