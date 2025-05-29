// src/api/modules/addModule.ts
import axios from "axios";
import { Module } from "@/types/projectStructure";
import { BaseURL } from "@/lib/config";

export const addModule = async (payload: { name: string; project: string; description?: string }): Promise<Module> => {
  const response = await axios.post(`${BaseURL}/api/modules/createModule`, {
    name: payload.name,
    project: payload.project,
    description: payload.description || "",
  });
  return response.data;
};
