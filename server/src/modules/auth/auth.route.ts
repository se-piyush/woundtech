import { Router } from "express";
import { AuthController } from "./auth.controller";
import { asyncHandler } from "../../middleware/errorHandler";
import { validate } from "../../middleware/validator";
import { authValidation } from "./auth.validation";

const router = Router();
const authController = new AuthController();

router.post(
  "/signin",
  validate(authValidation.signin),
  asyncHandler((req, res) => authController.signin(req, res)),
);

export default router;
