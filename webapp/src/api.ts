import axios from "axios";
import type {
  Visit,
  CreateVisitInput,
  PaginatedVisits,
  PaginatedClinicians,
  PaginatedPatients,
  LoginCredentials,
  AuthResponse,
} from "./types";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
const TOKEN_KEY = "woundtech_token";

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Initialize token from localStorage if it exists
const savedToken = getAuthToken();
if (savedToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      setAuthToken(null);
      // Reload page to show login
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

// Authentication
export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signin", credentials);
  setAuthToken(response.data.token);
  return response.data;
};

export const logout = () => {
  setAuthToken(null);
};

// Clinicians
export const getClinicians = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedClinicians> => {
  const response = await api.get<PaginatedClinicians>("/clinicians", {
    params,
  });
  return response.data;
};

// Patients
export const getPatients = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedPatients> => {
  const response = await api.get<PaginatedPatients>("/patients", { params });
  return response.data;
};

// Visits
export const getVisits = async (params?: {
  clinicianId?: string;
  patientId?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedVisits> => {
  const response = await api.get<PaginatedVisits>("/visits", { params });
  return response.data;
};

export const createVisit = async (data: CreateVisitInput): Promise<Visit> => {
  const response = await api.post<Visit>("/visits", data);
  return response.data;
};

export default api;
