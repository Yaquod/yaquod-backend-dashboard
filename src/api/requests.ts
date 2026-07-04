import apiClient from './client';
import type { ApiResponse, CreateRequestDto, Request as YaquodRequest } from '../types';

export async function getAllRequests() {
  const res = await apiClient.get<ApiResponse<YaquodRequest[]>>('/api/admins/requests');
  return res.data.data;
}

export async function createRequest(data: CreateRequestDto) {
  const res = await apiClient.post<ApiResponse<YaquodRequest>>('/api/trips/request', data);
  return res.data.data;
}
