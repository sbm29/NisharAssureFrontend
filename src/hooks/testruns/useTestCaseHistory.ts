// hooks/useTestCaseHistory.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTestCaseHistory = (testRunId: string, testCaseId: string) => {
  return useQuery({
    queryKey: ['testCaseHistory', testRunId, testCaseId],
    enabled: !!testRunId && !!testCaseId,
    queryFn: async () => {
      const res = await axios.get(
        `/test-runs/${testRunId}/test-cases/${testCaseId}/history`
      );
      return res.data;
    }
  });
};
