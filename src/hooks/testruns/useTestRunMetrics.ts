import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTestRunMetrics = (testRunId: string) => {

     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  return useQuery({
    queryKey: ["testRunMetrics", testRunId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/testruns/${testRunId}/metrics`);
      return data;
    },
    //refetchInterval: 5000, // optional: auto-poll every 5s
  });
};
