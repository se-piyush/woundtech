import { Patient } from "@prisma/client";
import { IPatientRepository } from "../../types/common";
import { NotFoundError } from "../../errors";

export class PatientService {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Patient[]; total: number }> {
    return this.patientRepository.findWithPagination(params);
  }

  async findById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);

    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    return patient;
  }
}
