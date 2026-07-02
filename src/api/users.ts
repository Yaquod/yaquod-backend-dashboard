import apiClient from './client';
import type { ApiResponse, User, PageResponse, Trip } from '../types';

export async function getUsers(params: {
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
  search?: string;
}) {
  const res = await apiClient.get<ApiResponse<PageResponse<User>>>('/api/admins/users', { params });
  return res.data.data;
}

export async function getUser(id: number) {
  const res = await apiClient.get<ApiResponse<User>>(`/api/admins/users/${id}`);
  return res.data.data;
}

export async function updateUserRole(id: number, role: string) {
  const res = await apiClient.patch<ApiResponse<User>>(`/api/admins/users/${id}/role`, null, {
    params: { role },
  });
  return res.data.data;
}

export async function getUserTrips(id: number) {
  const res = await apiClient.get<ApiResponse<Trip[]>>(`/api/admins/users/${id}/trips`);
  return res.data.data;
}

export async function updateUserVerified(id: number, verified: boolean) {
  const res = await apiClient.patch<ApiResponse<User>>(`/api/admins/users/${id}/verify`, null, {
    params: { verified },
  });
  return res.data.data;
}
