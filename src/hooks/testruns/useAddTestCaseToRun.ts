// hooks/useAddTestCasesToRun.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAddTestCaseToRun = (testRunId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testCaseIds: string[]) => {
      const res = await axios.post(`${API_BASE_URL}/api/testruns/${testRunId}/test-cases`, {
        testCaseIds,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testRun', testRunId] });
    }
  });
};
