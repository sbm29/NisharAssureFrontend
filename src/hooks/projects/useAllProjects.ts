import { useQuery } from "@tanstack/react-query";
import { fetchAllProjects } from "@/lib/api";

export const useAllProjects = () => {
  return useQuery({
    queryKey: ["project"],
    queryFn: () => fetchAllProjects(),
    enabled: true,
  });
};
