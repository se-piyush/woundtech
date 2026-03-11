import { Router } from "express";
import { ClinicianController } from "./clinician.controller";
import { ClinicianService } from "./clinician.service";
import { ClinicianRepository } from "./clinician.repository";
import { validate } from "../../middleware/validator";
import { clinicianValidation } from "./clinician.validation";
import prisma from "../../config/database";

const router = Router();

// Initialize dependencies
const clinicianRepository = new ClinicianRepository(prisma);
const clinicianService = new ClinicianService(clinicianRepository);
const clinicianController = new ClinicianController(clinicianService);

router.get("/", validate(clinicianValidation.getAll), (req, res) =>
  clinicianController.getAll(req, res),
);

router.get("/:id", validate(clinicianValidation.getById), (req, res) =>
  clinicianController.getById(req, res),
);

export default router;
