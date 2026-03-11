import { Router } from "express";
import clinicianRoutes from "../../modules/clinician/clinician.route";
import patientRoutes from "../../modules/patient/patient.route";
import visitRoutes from "../../modules/visit/visit.route";
import authRoutes from "../../modules/auth/auth.route";
import { authenticate } from "../../middleware/auth";

const router = Router();

// Public routes
router.use("/auth", authRoutes);

// Protected routes - require authentication
router.use("/clinicians", authenticate, clinicianRoutes);
router.use("/patients", authenticate, patientRoutes);
router.use("/visits", authenticate, visitRoutes);

export default router;
