import apiClient from './client';
import type { ApiResponse, Payment } from '../types';

export async function getAllPayments() {
  const res = await apiClient.get<ApiResponse<Payment[]>>('/api/admins/payments');
  return res.data.data;
}
