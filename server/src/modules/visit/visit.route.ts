import { Router } from "express";
import { VisitController } from "./visit.controller";
import { asyncHandler } from "../../middleware/errorHandler";
import { validate } from "../../middleware/validator";
import { visitValidation } from "./visit.validation";

const router = Router();
const visitController = new VisitController();

router.post(
  "/",
  validate(visitValidation.create),
  asyncHandler((req, res) => visitController.create(req, res)),
);

router.get(
  "/",
  validate(visitValidation.getAll),
  asyncHandler((req, res) => visitController.getAll(req, res)),
);

router.get(
  "/:id",
  validate(visitValidation.getById),
  asyncHandler((req, res) => visitController.getById(req, res)),
);

export default router;
