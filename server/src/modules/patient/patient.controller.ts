import { Request, Response } from "express";
import { PatientService } from "./patient.service";

const patientService = new PatientService();

export class PatientController {
  async getAll(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await patientService.findAll({
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
    const patient = await patientService.findById(id);
    res.status(200).json(patient);
  }
}
