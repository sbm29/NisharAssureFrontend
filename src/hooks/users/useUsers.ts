import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || ""; // e.g. http://localhost:5000

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "test_manager" | "test_engineer";
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
  role: User["role"];
}

export interface UpdateUserPayload {
  id: string;
  updates: Partial<Pick<User, "name" | "email" | "role">>;
}

// Fetch all users
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get(`${API}/api/users`);
      return data;
    },
  });
};

// Add user
export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: NewUser) => {
      const { data } = await axios.post(`${API}/api/users`, newUser);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: UpdateUserPayload) => {
      const { data } = await axios.put(`${API}/api/users/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.put(`${API}/api/users/${id}/deactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
