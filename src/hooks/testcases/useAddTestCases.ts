// hooks/useCreateTestCase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { TestCase } from '@/types/testCase';
import {BaseURL} from '@/lib/config';

type CreateTestCasePayload = Partial<TestCase> & {
  project: string;
  testSuite: string;
  module: string;
  
};

export const useAddTestCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTestCase: CreateTestCasePayload) => {
      const res = await axios.post(`${BaseURL}/api/testcases/createTestCase`, newTestCase);
      return res.data;
    },
    onSuccess: (_, variables) => {
      // Refetch both project and suite level queries
      queryClient.invalidateQueries({ queryKey: ['testcases', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['testSuites', variables.testSuiteId] });
      queryClient.invalidateQueries({ queryKey: ['modules', variables.moduleId] });
    },
  });
};
