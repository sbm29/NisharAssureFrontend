// hooks/useDeleteTestCase.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BaseURL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";

export const useDeleteTestCase = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testCaseId: string) => {
      const response = await axios.delete(`${BaseURL}/api/testcases/${testCaseId}`);
      return response.data;
    },
    onSuccess: () => {
      // Refetch test cases after deletion
      queryClient.invalidateQueries({
        queryKey: ["testCases", projectId],
      });
      toast({
        title: "Test Case Deleted",
        description: "Test case deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete test case:", error);
      toast({
        title: "Failed to delete test case",
        description: "Test case deletion failed.",
      });
    },
  });
};
