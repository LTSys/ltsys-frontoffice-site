import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  token: string;
  pendindPasswordChange: boolean;
}

export const authService = {
  /**
   * - Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict
   */
  login: async (email: string, password: string): Promise<UserData> => {
    const response = await api.post<UserData>('/auth/login', { email, password });
    return response.data;
    
  },

};