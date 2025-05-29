// hooks/testcases/useCopyTestCases.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BaseURL } from "@/lib/config";

interface CopyTestCasePayload {
  testCaseIds: string[];
  targetTestSuiteId: string;
}

export const useCopyTestCases = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testCaseIds, targetTestSuiteId }: CopyTestCasePayload) => {
      const responses = await Promise.all(
        testCaseIds.map((id) =>
          axios.post(`${BaseURL}/api/testcases/${id}/copy`, {
            targetTestSuiteId,
          })
        )
      );
      return responses.map((res) => res.data); // array of copied test cases
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testCases"] });
      queryClient.invalidateQueries({ queryKey: ["testSuites"] });
    },

    onError: (error) => {
      console.error("Error copying test cases:", error);
    },
  });
};
