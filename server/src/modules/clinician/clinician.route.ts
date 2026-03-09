import { Router } from "express";
import { ClinicianController } from "./clinician.controller";
import { asyncHandler } from "../../middleware/errorHandler";
import { validate } from "../../middleware/validator";
import { clinicianValidation } from "./clinician.validation";

const router = Router();
const clinicianController = new ClinicianController();

router.get(
  "/",
  validate(clinicianValidation.getAll),
  asyncHandler((req, res) => clinicianController.getAll(req, res)),
);

router.get(
  "/:id",
  validate(clinicianValidation.getById),
  asyncHandler((req, res) => clinicianController.getById(req, res)),
);

export default router;
