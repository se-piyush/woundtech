import { Clinician, Prisma } from "@prisma/client";
import prisma from "../../config/database";

export class ClinicianRepository {
  async findById(id: string): Promise<Clinician | null> {
    return prisma.clinician.findUnique({
      where: { id },
      include: {
        visits: {
          include: {
            patient: true,
          },
          orderBy: {
            visitDate: "desc",
          },
        },
      },
    });
  }

  async findAll(): Promise<Clinician[]> {
    return prisma.clinician.findMany({
      orderBy: {
        lastName: "asc",
      },
    });
  }

  async findWithPagination(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Clinician[]; total: number }> {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    let where: Prisma.ClinicianWhereInput = {};

    if (search) {
      const searchTerms = search.trim().split(/\s+/);
      const orConditions: Prisma.ClinicianWhereInput[] = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { specialty: { contains: search, mode: "insensitive" } },
      ];

      // Support full name search (e.g., "John Doe")
      if (searchTerms.length >= 2) {
        orConditions.push({
          AND: [
            { firstName: { contains: searchTerms[0], mode: "insensitive" } },
            {
              lastName: {
                contains: searchTerms.slice(1).join(" "),
                mode: "insensitive",
              },
            },
          ],
        });
      }

      where = { OR: orConditions };
    }

    const [data, total] = await Promise.all([
      prisma.clinician.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          lastName: "asc",
        },
      }),
      prisma.clinician.count({ where }),
    ]);

    return { data, total };
  }

  async findByUserId(userId: string): Promise<Clinician | null> {
    return prisma.clinician.findUnique({
      where: { userId },
    });
  }
}
