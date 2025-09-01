import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Helper function to safely get token from localStorage
const getStoredToken = (): string | null => {
  if (!isBrowser) return null;
  try {
    const token = localStorage.getItem('token');
    return token && token !== 'undefined' && token !== 'null' ? token : null;
  } catch (error) {
    console.warn('Failed to access localStorage:', error);
    return null;
  }
};

// Helper function to safely set token in localStorage
const setStoredToken = (token: string): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.warn('Failed to set token in localStorage:', error);
  }
};

// Helper function to safely remove token from localStorage
const removeStoredToken = (): void => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.warn('Failed to remove token from localStorage:', error);
  }
};

// Create a shared axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Note: Token will be set dynamically by the request interceptor
// No need to set it here as the interceptor handles it for each request

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Debug - Token from localStorage:', token ? 'Present' : 'Not found');
    }
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Token added to request:', config.url);
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ No valid token found for request:', config.url);
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Response interceptor - URL:', error.config?.url, 'Status:', error.response?.status);
    }
    
    if (error.response?.status === 401) {
      // Don't remove token for auth endpoints (login/register)
      if (error.config?.url && !error.config.url.includes('/auth/')) {
        // Only remove token if it's actually invalid, not just missing
        const currentToken = getStoredToken();
        if (currentToken) {
          removeStoredToken();
          delete api.defaults.headers.common['Authorization'];
          if (process.env.NODE_ENV === 'development') {
            console.log('Authentication failed, token removed');
          }
        }
      }
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status, error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Export helper functions for external use
export const setAuthToken = (token: string): void => {
  setStoredToken(token);
  // Note: The request interceptor will automatically pick up the token
  // No need to set it in defaults as it's handled dynamically
};

export const clearAuthToken = (): void => {
  removeStoredToken();
  // Note: The request interceptor will automatically not include the token
  // No need to manually delete from defaults
};

export const getAuthToken = (): string | null => {
  return getStoredToken();
};

export default api;
