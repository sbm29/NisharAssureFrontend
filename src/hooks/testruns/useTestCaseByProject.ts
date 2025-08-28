// hooks/useTestCasesByProject.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useTestCasesByProject = (projectId: string) => {
  return useQuery({
    queryKey: ['testCases', projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/projects/${projectId}/testcases`);
      return res.data;
    },
  });
};
