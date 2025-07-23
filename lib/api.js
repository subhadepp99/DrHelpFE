import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("healthcare_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("healthcare_token");
      window.location.href = "/auth/login";
    }

    const message = error.response?.data?.message || "Something went wrong";
    toast.error(message);

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  verifyEmail: (data) => api.post("/auth/verify-email", data),
  login: (data) => api.post("/auth/login", data),
  resendOTP: (data) => api.post("/auth/resend-otp", data),
};

// Doctor API calls
export const doctorAPI = {
  getAll: (params) => api.get("/doctors", { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) =>
    api.post("/doctors", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    api.put(`/doctors/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Patient API calls
export const patientAPI = {
  getAll: (params) => api.get("/patients", { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post("/patients", data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// Clinic API calls
export const clinicAPI = {
  getAll: (params) => api.get("/clinics", { params }),
  getById: (id) => api.get(`/clinics/${id}`),
  create: (data) => api.post("/clinics", data),
  update: (id, data) => api.put(`/clinics/${id}`, data),
  delete: (id) => api.delete(`/clinics/${id}`),
};

// Pharmacy API calls
export const pharmacyAPI = {
  getAll: (params) => api.get("/pharmacies", { params }),
  getById: (id) => api.get(`/pharmacies/${id}`),
  create: (data) => api.post("/pharmacies", data),
  update: (id, data) => api.put(`/pharmacies/${id}`, data),
  delete: (id) => api.delete(`/pharmacies/${id}`),
};

// Search API calls
export const searchAPI = {
  global: (params) => api.get("/search", { params }),
  suggestions: (params) => api.get("/search/suggestions", { params }),
};

export default api;
