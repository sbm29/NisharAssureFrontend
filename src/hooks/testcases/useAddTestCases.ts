// hooks/useCreateTestCase.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { TestCase } from "@/types/testCase";
import { BaseURL } from "@/lib/config";

type CreateTestCasePayload = Partial<TestCase> & {
  testSuite: string;
};

export const useAddTestCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTestCase: CreateTestCasePayload) => {
      const res = await axios.post(
        `${BaseURL}/api/testcases/createTestCase`,
        newTestCase
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["testCases", { projectId: variables.project }],
      });
      queryClient.invalidateQueries({
        queryKey: ["testSuites", variables.testSuite],
      });
    },
  });
};
