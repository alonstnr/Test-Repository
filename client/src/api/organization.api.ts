import apiClient from './client';
import type { CreateOrganizationRequest } from '@volunteer/shared';

export const organizationApi = {
  create: (data: CreateOrganizationRequest) => apiClient.post('/organizations', data),
  getMine: () => apiClient.get('/organizations/mine'),
  getById: (id: string) => apiClient.get(`/organizations/${id}`),
  update: (id: string, data: Partial<CreateOrganizationRequest>) =>
    apiClient.put(`/organizations/${id}`, data),
};
