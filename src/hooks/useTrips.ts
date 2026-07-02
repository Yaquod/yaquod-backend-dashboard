import { useQuery } from '@tanstack/react-query';
import { getAllTrips } from '../api/vehicles';

export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: getAllTrips,
  });
}
