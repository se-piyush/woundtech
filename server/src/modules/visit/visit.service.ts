import { Visit } from "@prisma/client";
import { NotFoundError } from "../../errors";
import {
  IVisitRepository,
  IClinicianRepository,
  IPatientRepository,
  PaginationParams,
  SortParams,
  PaginatedResponse,
  VisitFilters,
} from "../../types/common";

export class VisitService {
  constructor(
    private readonly visitRepository: IVisitRepository,
    private readonly clinicianRepository: IClinicianRepository,
    private readonly patientRepository: IPatientRepository,
  ) {}

  async create(data: {
    clinicianId: string;
    patientId: string;
    visitDate: Date;
    notes?: string;
    diagnosis?: string;
    treatment?: string;
  }): Promise<Visit> {
    // Verify clinician exists
    const clinician = await this.clinicianRepository.findById(data.clinicianId);
    if (!clinician) {
      throw new NotFoundError("Clinician not found");
    }

    // Verify patient exists
    const patient = await this.patientRepository.findById(data.patientId);
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    return this.visitRepository.create({
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
    return this.visitRepository.findAll(pagination, sort, filters);
  }

  async findById(id: string): Promise<Visit> {
    const visit = await this.visitRepository.findById(id);

    if (!visit) {
      throw new NotFoundError("Visit not found");
    }

    return visit;
  }
}
