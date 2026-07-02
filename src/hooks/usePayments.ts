import { useQuery } from '@tanstack/react-query';
import { getAllPayments } from '../api/payments';

export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: getAllPayments,
  });
}
