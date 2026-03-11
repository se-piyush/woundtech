import { Visit, Prisma, PrismaClient } from "@prisma/client";
import {
  IVisitRepository,
  PaginationParams,
  SortParams,
  PaginatedResponse,
  VisitFilters,
} from "../../types/common";

export class VisitRepository implements IVisitRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.VisitCreateInput): Promise<Visit> {
    return this.prisma.visit.create({
      data,
      include: {
        clinician: true,
        patient: true,
      },
    });
  }

  async findById(id: string): Promise<Visit | null> {
    return this.prisma.visit.findUnique({
      where: { id },
      include: {
        clinician: true,
        patient: true,
      },
    });
  }

  async findAll(
    pagination: PaginationParams,
    sort: SortParams,
    filters: VisitFilters,
  ): Promise<PaginatedResponse<Visit>> {
    const { page, limit } = pagination;
    const { sortBy, sortOrder } = sort;
    const skip = (page - 1) * limit;

    // Build where clause for filters
    const where: Prisma.VisitWhereInput = {};

    if (filters.clinicianId) {
      where.clinicianId = filters.clinicianId;
    }

    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    // Build orderBy clause
    const orderBy: Prisma.VisitOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute queries in parallel
    const [visits, total] = await Promise.all([
      this.prisma.visit.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          clinician: true,
          patient: true,
        },
      }),
      this.prisma.visit.count({ where }),
    ]);

    return {
      data: visits,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
