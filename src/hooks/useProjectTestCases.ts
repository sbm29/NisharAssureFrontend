// hooks/useProjectTestCases.ts
import { useQuery } from "@tanstack/react-query";
import { fetchAllTestCasesForProject } from "@/lib/api"; // You will write this

export const useProjectTestCases = (projectId: string) => {
  return useQuery({
    queryKey: ["testCases", { projectId }],
    queryFn: () => fetchAllTestCasesForProject(projectId),
    
    enabled: !!projectId,
  });
};
