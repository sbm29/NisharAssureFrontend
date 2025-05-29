import { useQuery } from '@tanstack/react-query';
import { getTestCaseById } from '@/lib/api';

export const useTestCaseById = (id: string) => {
  return useQuery({
    queryKey: ['test-case', id],
    queryFn: () => getTestCaseById(id),
    enabled: !!id, // only fetch if id exists
  });
};
