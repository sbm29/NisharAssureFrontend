// hooks/useTestRunDetail.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useTestRunDetail = (testRunId: string) => {
  return useQuery({
    queryKey: ['testRun', testRunId],
    enabled: !!testRunId,
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/testruns/${testRunId}`);
      return res.data;
    }
  });
};
