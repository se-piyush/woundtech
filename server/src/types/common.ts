import { User, Clinician, Patient, Visit, Prisma } from "@prisma/client";

// Common utility types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VisitFilters {
  clinicianId?: string;
  patientId?: string;
}

// Repository interfaces
export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
}

export interface IClinicianRepository {
  findById(id: string): Promise<Clinician | null>;
  findAll(): Promise<Clinician[]>;
  findWithPagination(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Clinician[]; total: number }>;
  findByUserId(userId: string): Promise<Clinician | null>;
}

export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>;
  findAll(): Promise<Patient[]>;
  findWithPagination(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Patient[]; total: number }>;
  findByUserId(userId: string): Promise<Patient | null>;
}

export interface IVisitRepository {
  create(data: Prisma.VisitCreateInput): Promise<Visit>;
  findById(id: string): Promise<Visit | null>;
  findAll(
    pagination: PaginationParams,
    sort: SortParams,
    filters: VisitFilters,
  ): Promise<PaginatedResponse<Visit>>;
}
