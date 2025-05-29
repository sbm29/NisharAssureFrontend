import { useQuery } from "@tanstack/react-query";
import { fetchAllTestSuites } from "@/lib/api";

export const useTestSuites = () => {
  return useQuery({
    queryKey: ["testSuites"],
    queryFn: fetchAllTestSuites,
  });
};
