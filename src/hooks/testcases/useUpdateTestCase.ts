// hooks/testcases/useUpdateTestCase.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BaseURL } from "@/lib/config";

type UpdateTestCasePayload = {
  _id: string;
  title?: string;
  description?: string;
  priority?: string;
  type?: string;
  preconditions?: string;
  steps?: string;
  expectedResults?: string;
  status?: string;
  project?: string;
  module?: string;
  testSuite?: string;
};

export const useUpdateTestCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ _id, ...rest }: UpdateTestCasePayload) => {
      const res = await axios.put(`${BaseURL}/api/testcases/updateTestCase/${_id}`, rest);
      return res.data;
    },
    onSuccess: (_data, variables) => {
        // Invalidate to refetch the updated test case
        queryClient.invalidateQueries({ queryKey: ['test-case', variables._id] });
      },
  });
};
