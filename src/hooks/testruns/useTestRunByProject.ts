// hooks/useTestRuns.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const useTestRunsByProject = (projectId: string) => {
  return useQuery({
    queryKey: ['testRuns', projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/testruns/project/${projectId}`);
      return res.data;
    }
  });
};
