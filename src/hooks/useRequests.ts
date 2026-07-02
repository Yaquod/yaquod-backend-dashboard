import { useQuery } from '@tanstack/react-query';
import { getAllRequests } from '../api/requests';

export function useRequests() {
  return useQuery({
    queryKey: ['requests'],
    queryFn: getAllRequests,
  });
}
