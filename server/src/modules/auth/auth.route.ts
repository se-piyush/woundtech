import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { validate } from "../../middleware/validator";
import { authValidation } from "./auth.validation";

const router = Router();

// Initialize dependencies
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/signin", validate(authValidation.signin), (req, res) =>
  authController.signin(req, res),
);

export default router;
