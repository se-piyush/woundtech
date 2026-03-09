import { Clinician } from "@prisma/client";
import { ClinicianRepository } from "./clinician.repository";
import { NotFoundError } from "../../errors";

const clinicianRepository = new ClinicianRepository();

export class ClinicianService {
  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Clinician[]; total: number }> {
    return clinicianRepository.findWithPagination(params);
  }

  async findById(id: string): Promise<Clinician> {
    const clinician = await clinicianRepository.findById(id);

    if (!clinician) {
      throw new NotFoundError("Clinician not found");
    }

    return clinician;
  }
}
