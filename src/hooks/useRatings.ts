import { useQuery } from '@tanstack/react-query';
import { getAllRatings } from '../api/ratings';

export function useRatings() {
  return useQuery({
    queryKey: ['ratings'],
    queryFn: getAllRatings,
  });
}
