import { Clinician } from "@prisma/client";
import { IClinicianRepository } from "../../types/common";
import { NotFoundError } from "../../errors";

export class ClinicianService {
  constructor(private readonly clinicianRepository: IClinicianRepository) {}

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Clinician[]; total: number }> {
    return this.clinicianRepository.findWithPagination(params);
  }

  async findById(id: string): Promise<Clinician> {
    const clinician = await this.clinicianRepository.findById(id);

    if (!clinician) {
      throw new NotFoundError("Clinician not found");
    }

    return clinician;
  }
}
