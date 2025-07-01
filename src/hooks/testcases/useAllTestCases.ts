// hooks/useAllTestCases.ts
import { useQuery } from "@tanstack/react-query";

import { fetchAllTestCases } from "@/lib/api";



export const useAllTestCases = () => {
  return useQuery({
    queryKey: ["testCases"],
    queryFn: fetchAllTestCases,
    staleTime: 1000 * 60 * 2, 
    enabled: true,
   
  });
 
};
