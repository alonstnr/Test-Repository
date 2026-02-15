import apiClient from './client';
import type { CreateRegistrationRequest } from '@volunteer/shared';

export const registrationApi = {
  register: (data: CreateRegistrationRequest) => apiClient.post('/registrations', data),
  getMine: () => apiClient.get('/registrations/mine'),
  cancel: (id: string) => apiClient.delete(`/registrations/${id}`),
};
