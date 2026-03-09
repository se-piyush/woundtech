import { Patient } from "@prisma/client";
import { PatientRepository } from "./patient.repository";
import { NotFoundError } from "../../errors";

const patientRepository = new PatientRepository();

export class PatientService {
  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Patient[]; total: number }> {
    return patientRepository.findWithPagination(params);
  }

  async findById(id: string): Promise<Patient> {
    const patient = await patientRepository.findById(id);

    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    return patient;
  }
}
