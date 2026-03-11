import { Request, Response } from "express";
import { PatientService } from "./patient.service";

export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await this.patientService.findAll({
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
    const id = String(req.params.id);
    const patient = await this.patientService.findById(id);
    res.status(200).json(patient);
  }
}
