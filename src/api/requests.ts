import apiClient from './client';
import type { ApiResponse, Request as YaquodRequest } from '../types';

export async function getAllRequests() {
  const res = await apiClient.get<ApiResponse<YaquodRequest[]>>('/api/admins/requests');
  return res.data.data;
}
