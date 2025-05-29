import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "@/lib/api";

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });
};
