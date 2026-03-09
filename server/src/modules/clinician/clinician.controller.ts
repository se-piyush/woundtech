import { Request, Response } from "express";
import { ClinicianService } from "./clinician.service";

const clinicianService = new ClinicianService();

export class ClinicianController {
  async getAll(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await clinicianService.findAll({
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
    const clinician = await clinicianService.findById(id);
    res.status(200).json(clinician);
  }
}
