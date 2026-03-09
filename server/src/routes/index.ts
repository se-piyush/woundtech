import { Router } from "express";
import clinicianRoutes from "../modules/clinician/clinician.route";
import patientRoutes from "../modules/patient/patient.route";
import visitRoutes from "../modules/visit/visit.route";
import authRoutes from "../modules/auth/auth.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clinicians", clinicianRoutes);
router.use("/patients", patientRoutes);
router.use("/visits", visitRoutes);

export default router;
