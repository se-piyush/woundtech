import { Router } from "express";
import { PatientController } from "./patient.controller";
import { asyncHandler } from "../../middleware/errorHandler";
import { validate } from "../../middleware/validator";
import { patientValidation } from "./patient.validation";

const router = Router();
const patientController = new PatientController();

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
