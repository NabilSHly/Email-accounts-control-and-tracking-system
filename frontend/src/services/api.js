import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
const API_URL = import.meta.env.VITE_API_URL;

// Create a configured axios instance
const api = axios.create({
  baseURL: `${API_URL}`, // Base URL for the API
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
};

export const updateEmployee = async (employeeId, updatedData) => {
  try {
    const response = await api.put(`/employees/${employeeId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

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

// Function to fetch dashboard stats
export const fetchDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard-stats');

    // Check if the response status code indicates success (2xx range)
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to fetch dashboard statistics');
    }

    const data = response.data;

    // Check if data contains all necessary fields
    if (
      data.totalEmployees === undefined ||
      data.activeEmployees === undefined ||
      data.pendingRequests === undefined ||
      data.totalDepartments === undefined ||
      data.totalMunicipalities === undefined
    ) {
      throw new Error('Incomplete data received for dashboard statistics');
    }

    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message);
    toast.error("فشل تحميل الإحصائيات");
    throw error; // Propagate the error to be handled by the calling component
  }
};

// Function to fetch audit logs
export const fetchAuditLogs = async () => {
  try {
    const response = await api.get(`/audit-logs`);

    // Check if the response status code indicates success (2xx range)
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to fetch audit logs');
    }

    const data = response.data;
console.log(data,"ll");

    // Check if the logs data is an array and has the correct structure
    if (!Array.isArray(data.logs)) {
      throw new Error('Invalid audit logs structure');
    }

    return data.logs;
  } catch (error) {
    console.error('Error fetching audit logs:', error.message);
    toast.error("فشل تحميل السجلات");
    throw error; // Propagate the error to be handled by the calling component
  }
};
