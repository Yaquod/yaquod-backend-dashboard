import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllRequests, createRequest as createRequestApi } from '../api/requests';
import type { CreateRequestDto } from '../types';

export function useRequests() {
  return useQuery({
    queryKey: ['requests'],
    queryFn: getAllRequests,
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRequestDto) => createRequestApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['requests'] }),
  });
}
