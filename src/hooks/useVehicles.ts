import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as vehiclesApi from '../api/vehicles';
import type { CreateVehicleDto } from '../types';

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.getVehicles,
  });
}

export function useVehicle(id: number) {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => vehiclesApi.getVehicle(id),
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVehicleDto) => vehiclesApi.createVehicle(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVehicleDto) => vehiclesApi.updateVehicle(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vehiclesApi.deleteVehicle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useUpdateVehicleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      vehiclesApi.updateVehicleStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}
