import apiClient from './client';
import type { ApiResponse, Vehicle, CreateVehicleDto, Trip } from '../types';

export async function getVehicles() {
  const res = await apiClient.get<ApiResponse<Vehicle[]>>('/api/admins/vehicles');
  return res.data.data;
}

export async function getVehicle(id: number) {
  const res = await apiClient.get<ApiResponse<Vehicle>>(`/api/vehicles/id/${id}`);
  return res.data.data;
}

export async function createVehicle(data: CreateVehicleDto) {
  const res = await apiClient.post<ApiResponse<Vehicle>>('/api/vehicles', data);
  return res.data.data;
}

export async function updateVehicle(data: CreateVehicleDto) {
  const res = await apiClient.patch<ApiResponse<Vehicle>>('/api/vehicles', data);
  return res.data.data;
}

export async function deleteVehicle(id: number) {
  const res = await apiClient.delete<ApiResponse<void>>(`/api/vehicles/id/${id}`);
  return res.data;
}

export async function getAllTrips() {
  const res = await apiClient.get<ApiResponse<Trip[]>>('/api/trips');
  return res.data.data;
}

export async function updateVehicleStatus(id: number, status: string) {
  const res = await apiClient.patch<ApiResponse<Vehicle>>(`/api/admins/vehicles/${id}/status`, null, {
    params: { status },
  });
  return res.data.data;
}
