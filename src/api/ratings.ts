import apiClient from './client';
import type { ApiResponse, Rating } from '../types';

export async function getAllRatings() {
  const res = await apiClient.get<ApiResponse<Rating[]>>('/api/admins/ratings');
  return res.data.data;
}
