import apiClient from './client';
import type { CreateActivityRequest, ActivityFilters } from '@volunteer/shared';

export const activityApi = {
  create: (data: CreateActivityRequest) => apiClient.post('/activities', data),
  getAll: (filters?: ActivityFilters) => apiClient.get('/activities', { params: filters }),
  getById: (id: string) => apiClient.get(`/activities/${id}`),
  update: (id: string, data: Partial<CreateActivityRequest>) =>
    apiClient.put(`/activities/${id}`, data),
  deactivate: (id: string) => apiClient.delete(`/activities/${id}`),
  getRegistrants: (id: string) => apiClient.get(`/activities/${id}/registrants`),
  getCalendar: (month: number, year: number) =>
    apiClient.get('/activities/calendar', { params: { month, year } }),
};
