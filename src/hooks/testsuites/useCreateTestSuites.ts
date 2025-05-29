// src/hooks/useCreateTestSuite.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { BaseURL } from "@/lib/config";

interface CreateTestSuiteInput {
  module: string;
  project: string;
  name: string;
  description?: string;
}

export const useCreateTestSuite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTestSuiteInput) =>
      {
        console.log("Sending test suite creation data:", data);
        return  await axios.post(`${BaseURL}/api/testsuites/createTestSuite`, data).then((res) => res.data);
      },

      onSuccess: (_, variables) => {
        toast({ title: "Test suite created successfully." });
        queryClient.invalidateQueries({ queryKey: ["testsuites", variables.module] });
      },

    onError: (error : any) => {
      console.error("Create test suite error:", error);
      const message = error?.response?.data?.message || 'Failed to create test suite';
      toast({ title: message, variant: 'destructive' });
    },
  });
};
