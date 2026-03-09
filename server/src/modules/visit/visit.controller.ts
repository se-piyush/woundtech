import { Request, Response } from "express";
import { VisitRepository } from "./visit.repository";
import { ClinicianRepository } from "../clinician/clinician.repository";
import { PatientRepository } from "../patient/patient.repository";
import { NotFoundError } from "../../errors";

const visitRepository = new VisitRepository();
const clinicianRepository = new ClinicianRepository();
const patientRepository = new PatientRepository();

export class VisitController {
  async create(req: Request, res: Response): Promise<void> {
    const { clinicianId, patientId, visitDate, notes, diagnosis, treatment } =
      req.body;

    // Verify clinician exists
    const clinician = await clinicianRepository.findById(clinicianId);
    if (!clinician) {
      throw new NotFoundError("Clinician not found");
    }

    // Verify patient exists
    const patient = await patientRepository.findById(patientId);
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    const visit = await visitRepository.create({
      clinician: {
        connect: { id: clinicianId },
      },
      patient: {
        connect: { id: patientId },
      },
      visitDate: new Date(visitDate),
      notes,
      diagnosis,
      treatment,
    });

    res.status(201).json(visit);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Parse sort parameters
    const sortBy = (req.query.sortBy as string) || "visitDate";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    // Parse filter parameters
    const clinicianId = req.query.clinicianId as string | undefined;
    const patientId = req.query.patientId as string | undefined;

    const result = await visitRepository.findAll(
      { page, limit },
      { sortBy, sortOrder },
      { clinicianId, patientId },
    );

    res.status(200).json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const visit = await visitRepository.findById(id);

    if (!visit) {
      throw new NotFoundError("Visit not found");
    }

    res.status(200).json(visit);
  }
}
