import apiClient from './client';
import type { UpdateVolunteerProfileRequest } from '@volunteer/shared';

export const userApi = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) =>
    apiClient.put('/users/profile', data),
  getVolunteerProfile: () => apiClient.get('/users/volunteer-profile'),
  upsertVolunteerProfile: (data: UpdateVolunteerProfileRequest) =>
    apiClient.put('/users/volunteer-profile', data),
};
