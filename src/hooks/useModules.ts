import { useQuery } from "@tanstack/react-query";
import { fetchModules } from "@/lib/api";

export const useModules = (projectId: string) => {
  return useQuery({
    queryKey: ["modules", projectId],
    queryFn: () => {
      if (!projectId) throw new Error("Project ID is required");
      return fetchModules(projectId);
    },
    enabled: !!projectId,
  });
};
