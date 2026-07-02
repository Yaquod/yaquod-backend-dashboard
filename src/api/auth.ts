import apiClient from './client';
import type { ApiResponse, LoginRequest, LoginResponse, User } from '../types';

export async function login(data: LoginRequest) {
  const res = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', data);
  return res.data.data;
}

export async function getMe() {
  const res = await apiClient.get<ApiResponse<User>>('/api/auth/me');
  return res.data.data;
}
