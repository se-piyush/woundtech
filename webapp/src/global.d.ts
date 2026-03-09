// Global Type Declarations
// These types are available throughout the application without imports

// API Types
interface Clinician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty?: string;
  createdAt: string;
  updatedAt: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface Visit {
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

interface CreateVisitInput {
  clinicianId: string;
  patientId: string;
  visitDate: string;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
}

interface PaginatedVisits {
  data: Visit[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedClinicians {
  data: Clinician[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedPatients {
  data: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Authentication Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  role: "CLINICIAN" | "PATIENT" | "SUPER";
}

interface AuthResponse {
  token: string;
  user: User;
}

// Context Types
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// Component Props Types
interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  id?: string;
  label: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

interface CreateVisitFormProps {
  onSuccess: () => void;
}

interface VisitsTableProps {
  refreshTrigger?: number;
}

// App Types
type TabType = "clinicians" | "patients" | "visits";
