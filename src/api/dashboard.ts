import apiClient from './client';
import type { ApiResponse, DashboardDto } from '../types';

export async function getDashboardStats() {
  const res = await apiClient.get<ApiResponse<DashboardDto>>('/api/admins/dashboard');
  return res.data.data;
}
