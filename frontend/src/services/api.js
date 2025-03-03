import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

// Create a configured axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message || 'Unknown error');
  }
);

// API functions
export const fetchEmployees = async () => {
  try {
    const response = await api.get('/employees');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const fetchDepartments = async () => {
  try {
    const response = await api.get('/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const fetchMunicipalities = async () => {
  try {
    const response = await api.get('/municipalities');
    return response.data;
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    throw error;
  }
};
export const reportEmployee = async (employeeId) => {
  try {
    const response = await api.put(`/employees/${employeeId}/report`);
    return response.data;
  } catch (error) {
    console.error('Error reporting employee:', error);
    throw error;
  }
}
// Auth validation
export const validateToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return { valid: false, error: 'Authentication token is missing' };
  }

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now()
      ? { valid: false, error: 'Token expired' }
      : { valid: true };
  } catch (error) {
    console.error('Error decoding token:', error);
    return { valid: false, error: 'Invalid token' };
  }
};
