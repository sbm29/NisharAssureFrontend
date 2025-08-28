// hooks/useExecuteTestCase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useExecuteTestCase = (testRunId: string) => {
  const queryClient = useQueryClient();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return useMutation({
    mutationFn: async ({
      testRunId,
      testCaseId,
      status,
      actualResults,
      notes,
    }: {
      testRunId: string;
      testCaseId: string;
      status: string;
      actualResults?: string;
      notes?: string;
    }) => {
      const res = await axios.post(
        `${API_BASE_URL}/api/testruns/${testRunId}/test-cases/${testCaseId}/execute`,
        { status, actualResults, notes }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testRun', testRunId] });
    }
  });
};
