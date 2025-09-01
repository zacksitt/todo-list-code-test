import api, { setAuthToken, clearAuthToken, getAuthToken } from './api';
import { LoginDto, RegisterDto, AuthResponse } from '../types/Auth';

const authService = {
  async login(credentials: LoginDto): Promise<{ status: number; message: string; data: AuthResponse }> {
    const response = await api.post<{ status: number; message: string; data: AuthResponse }>('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterDto): Promise<{ status: number; message: string; data: AuthResponse }> {
    const response = await api.post<{ status: number; message: string; data: AuthResponse }>('/auth/register', userData);
    return response.data;
  },

  setToken(token: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Setting token:', token ? 'Present' : 'Not provided');
    }
    setAuthToken(token);
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Token set in localStorage and axios headers');
    }
  },

  getToken(): string | null {
    return getAuthToken();
  },

  removeToken(): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Removing token');
    }
    clearAuthToken();
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 isAuthenticated check - Token:', token ? 'Present' : 'Not found');
    }
    const result = !!token;
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 isAuthenticated result:', result);
    }
    return result;
  },
};

export default authService;
