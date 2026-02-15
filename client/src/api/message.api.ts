import apiClient from './client';
import type { SendMessageRequest } from '@volunteer/shared';

export const messageApi = {
  send: (data: SendMessageRequest) => apiClient.post('/messages', data),
  getThreads: () => apiClient.get('/messages/threads'),
  getThread: (threadId: string) => apiClient.get(`/messages/threads/${threadId}`),
  markRead: (id: string) => apiClient.put(`/messages/${id}/read`),
  getUnreadCount: () => apiClient.get('/messages/unread-count'),
};
