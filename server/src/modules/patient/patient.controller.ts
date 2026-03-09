import { Request, Response } from "express";
import { PatientRepository } from "./patient.repository";
import { NotFoundError } from "../../errors";

const patientRepository = new PatientRepository();

export class PatientController {
  async getAll(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await patientRepository.findWithPagination({
      page,
      limit,
      search,
    });

    res.status(200).json({
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const patient = await patientRepository.findById(id);

    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    res.status(200).json(patient);
  }
}
