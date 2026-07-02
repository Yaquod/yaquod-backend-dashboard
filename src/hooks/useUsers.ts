import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as usersApi from '../api/users';

export function useUsers(params: {
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => usersApi.updateUserRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUserVerified() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, verified }: { id: number; verified: boolean }) =>
      usersApi.updateUserVerified(id, verified),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
