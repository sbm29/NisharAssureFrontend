// hooks/testsuites/useCopyTestSuite.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BaseURL } from "@/lib/config";

interface CopyTestSuitePayload {
  testSuiteId: string;
  targetModuleId: string;
}

export const useCopyTestSuite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testSuiteId, targetModuleId }: CopyTestSuitePayload) => {
      const response = await axios.post(`${BaseURL}/api/testsuites/${testSuiteId}/copy`, {
        targetModuleId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testSuites"] });
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
    onError: (error) => {
      console.error("Error copying test suite:", error);
    },
  });
};
// // Added hook for copying test suites using React Query.