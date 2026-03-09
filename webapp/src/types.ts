// API Types
export interface Clinician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  id: string;
  clinicianId: string;
  patientId: string;
  visitDate: string;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
  createdAt: string;
  updatedAt: string;
  clinician: Clinician;
  patient: Patient;
}

export interface CreateVisitInput {
  clinicianId: string;
  patientId: string;
  visitDate: string;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
}

export interface PaginatedVisits {
  data: Visit[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedClinicians {
  data: Clinician[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedPatients {
  data: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: "CLINICIAN" | "PATIENT" | "SUPER";
}

export interface AuthResponse {
  token: string;
  user: User;
}
