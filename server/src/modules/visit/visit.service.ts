import { Visit } from "@prisma/client";
import { VisitRepository } from "./visit.repository";
import { ClinicianRepository } from "../clinician/clinician.repository";
import { PatientRepository } from "../patient/patient.repository";
import { NotFoundError } from "../../errors";
import {
  PaginationParams,
  SortParams,
  PaginatedResponse,
  VisitFilters,
} from "../../types/common";

const visitRepository = new VisitRepository();
const clinicianRepository = new ClinicianRepository();
const patientRepository = new PatientRepository();

export class VisitService {
  async create(data: {
    clinicianId: string;
    patientId: string;
    visitDate: Date;
    notes?: string;
    diagnosis?: string;
    treatment?: string;
  }): Promise<Visit> {
    // Verify clinician exists
    const clinician = await clinicianRepository.findById(data.clinicianId);
    if (!clinician) {
      throw new NotFoundError("Clinician not found");
    }

    // Verify patient exists
    const patient = await patientRepository.findById(data.patientId);
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    return visitRepository.create({
      clinician: {
        connect: { id: data.clinicianId },
      },
      patient: {
        connect: { id: data.patientId },
      },
      visitDate: data.visitDate,
      notes: data.notes,
      diagnosis: data.diagnosis,
      treatment: data.treatment,
    });
  }

  async findAll(
    pagination: PaginationParams,
    sort: SortParams,
    filters: VisitFilters,
  ): Promise<PaginatedResponse<Visit>> {
    return visitRepository.findAll(pagination, sort, filters);
  }

  async findById(id: string): Promise<Visit> {
    const visit = await visitRepository.findById(id);

    if (!visit) {
      throw new NotFoundError("Visit not found");
    }

    return visit;
  }
}
