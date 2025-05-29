// hooks/useMoveTestCases.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BaseURL } from "@/lib/config";

interface MoveTestCasePayload {
  testCaseIds: string[]; // can be single or multiple
  targetTestSuiteId: string;
}

export const useMoveTestCases = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testCaseIds, targetTestSuiteId }: MoveTestCasePayload) => {
      // Send move requests for each testCaseId
      const responses = await Promise.all(
        testCaseIds.map((id) =>
          axios.post(`${BaseURL}/api/testcases/${id}/move`, {
            targetTestSuiteId,
          })
        )
      );
      return responses.map((res) => res.data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["testCases"]});
      queryClient.invalidateQueries({queryKey: ["testSuites"]});
    },
  });
};
