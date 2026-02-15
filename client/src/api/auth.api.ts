import apiClient from './client';
import type { RegisterRequest, LoginRequest } from '@volunteer/shared';

export const authApi = {
  register: (data: RegisterRequest) => apiClient.post('/auth/register', data),
  login: (data: LoginRequest) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),
};
