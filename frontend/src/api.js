import axios from 'axios';

// Configure the base URL for your Spring Boot backend
const API_BASE_URL = 'http://localhost:8083/api';


// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Login failed' };
    }
  }
};

// Candidates API calls
export const candidatesAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/candidates');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Failed to fetch candidates' };
    }
  },

  add: async (candidateData) => {
    try {
      const response = await api.post('/candidates/add', candidateData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Failed to add candidate' };
    }
  },

  update: async (id, candidateData) => {
    try {
      const response = await api.put(`/candidates/update/${id}`, candidateData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Failed to update candidate' };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/candidates/delete/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Failed to delete candidate' };
    }
  }
};

// Voting API calls
export const votingAPI = {
  castVote: async (userId, candidateId) => {
    try {
      const response = await api.post(`/vote/${userId}/${candidateId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Failed to cast vote' };
    }
  },

  getResults: async () => {
    try {
      const response = await api.get('/vote/results');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Failed to fetch results' };
    }
  }
};

// Helper function to check if backend is running
export const checkBackendHealth = async () => {
  try {
    await api.get('/candidates');
    return true;
  } catch (error) {
    console.warn('Backend not available:', error.message);
    return false;
  }
};

export default api;
