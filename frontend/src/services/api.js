import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create a configured axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const fetchEmployees = () => api.get('/employees').then(res => res.data);
export const fetchDepartments = () => api.get('/departments').then(res => res.data);
export const fetchMunicipalities = () => api.get('/municipalities').then(res => res.data);

// Auth validation
export const validateToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return { valid: false, error: "Authentication token is missing" };
  }
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now()
      ? { valid: false, error: "Token expired" }
      : { valid: true };
  } catch {
    return { valid: false, error: "Invalid token" };
  }
}; 