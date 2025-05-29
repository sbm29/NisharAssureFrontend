// src/hooks/useAddModule.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addModule } from "@/api/module/addModule";
import { toast } from "@/hooks/use-toast";

export const useAddModule = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      addModule({ name: payload.name, description: payload.description, project: projectId }),

    onSuccess: () => {
      toast({ title: "Module added successfully." });
      queryClient.invalidateQueries({ queryKey: ["modules", projectId] });
    },
    onError: (error) => {
      console.error("Add module error:", error);
      toast({ title: "Failed to add module", variant: "destructive" });
    },
  });
};
