// hooks/testsuites/useMoveTestSuite.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BaseURL } from "@/lib/config";

interface MoveTestSuitePayload {
  testSuiteId: string;
  targetModuleId: string;
}

export const useMoveTestSuite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testSuiteId, targetModuleId }: MoveTestSuitePayload) => {
      const response = await axios.post(`${BaseURL}/api/testsuites/${testSuiteId}/move`, {
        targetModuleId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testSuites"] });
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
    onError: (error) => {
      console.error("Error moving test suite:", error);
    },
  });
};
// // Added hook for moving test suites using React Query.