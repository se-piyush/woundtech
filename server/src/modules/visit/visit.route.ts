import { Router } from "express";
import { VisitController } from "./visit.controller";
import { VisitService } from "./visit.service";
import { VisitRepository } from "./visit.repository";
import { ClinicianRepository } from "../clinician/clinician.repository";
import { PatientRepository } from "../patient/patient.repository";
import { validate } from "../../middleware/validator";
import { visitValidation } from "./visit.validation";

const router = Router();

// Initialize dependencies
const visitRepository = new VisitRepository();
const clinicianRepository = new ClinicianRepository();
const patientRepository = new PatientRepository();
const visitService = new VisitService(
  visitRepository,
  clinicianRepository,
  patientRepository,
);
const visitController = new VisitController(visitService);

router.post("/", validate(visitValidation.create), (req, res) =>
  visitController.create(req, res),
);

router.get("/", validate(visitValidation.getAll), (req, res) =>
  visitController.getAll(req, res),
);

router.get("/:id", validate(visitValidation.getById), (req, res) =>
  visitController.getById(req, res),
);

export default router;
