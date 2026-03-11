import { Router } from "express";
import { PatientController } from "./patient.controller";
import { PatientService } from "./patient.service";
import { PatientRepository } from "./patient.repository";
import { validate } from "../../middleware/validator";
import { patientValidation } from "./patient.validation";
import prisma from "../../config/database";

const router = Router();

// Initialize dependencies
const patientRepository = new PatientRepository(prisma);
const patientService = new PatientService(patientRepository);
const patientController = new PatientController(patientService);

router.get("/", validate(patientValidation.getAll), (req, res) =>
  patientController.getAll(req, res),
);

router.get("/:id", validate(patientValidation.getById), (req, res) =>
  patientController.getById(req, res),
);

export default router;
