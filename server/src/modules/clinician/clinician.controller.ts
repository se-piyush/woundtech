import { Request, Response } from "express";
import { ClinicianRepository } from "./clinician.repository";
import { NotFoundError } from "../../errors";

const clinicianRepository = new ClinicianRepository();

export class ClinicianController {
  async getAll(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await clinicianRepository.findWithPagination({
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
    const clinician = await clinicianRepository.findById(id);

    if (!clinician) {
      throw new NotFoundError("Clinician not found");
    }

    res.status(200).json(clinician);
  }
}
