// hooks/useCreateTestRun.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const useCreateTestRun = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await axios.post(`${API_BASE_URL}/api/testruns/create`, {
        ...data,
        projectId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testRuns', projectId] });
    }
  });
};
