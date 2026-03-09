import { Patient, Prisma } from "@prisma/client";
import prisma from "../../config/database";
import { IPatientRepository } from "../../types/common";

export class PatientRepository implements IPatientRepository {
  async findById(id: string): Promise<Patient | null> {
    return prisma.patient.findUnique({
      where: { id },
      include: {
        visits: {
          include: {
            clinician: true,
          },
          orderBy: {
            visitDate: "desc",
          },
        },
      },
    });
  }

  async findAll(): Promise<Patient[]> {
    return prisma.patient.findMany({
      orderBy: {
        lastName: "asc",
      },
    });
  }

  async findWithPagination(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Patient[]; total: number }> {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    let where: Prisma.PatientWhereInput = {};

    if (search) {
      const searchTerms = search.trim().split(/\s+/);
      const orConditions: Prisma.PatientWhereInput[] = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
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
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          lastName: "asc",
        },
      }),
      prisma.patient.count({ where }),
    ]);

    return { data, total };
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    if (!userId) return null;
    return prisma.patient.findUnique({
      where: { userId },
    });
  }
}
