import { Request, Response } from "express";
import { VisitService } from "./visit.service";

export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  async create(req: Request, res: Response): Promise<void> {
    const { clinicianId, patientId, visitDate, notes, diagnosis, treatment } =
      req.body;

    const visit = await this.visitService.create({
      clinicianId,
      patientId,
      visitDate: new Date(visitDate),
      notes,
      diagnosis,
      treatment,
    });

    res.status(201).json(visit);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Parse sort parameters
    const sortBy = (req.query.sortBy as string) || "visitDate";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    // Parse filter parameters
    const clinicianId = req.query.clinicianId as string | undefined;
    const patientId = req.query.patientId as string | undefined;

    const result = await this.visitService.findAll(
      { page, limit },
      { sortBy, sortOrder },
      { clinicianId, patientId },
    );

    res.status(200).json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const visit = await this.visitService.findById(id);
    res.status(200).json(visit);
  }
}
