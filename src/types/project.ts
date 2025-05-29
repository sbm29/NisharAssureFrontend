
/**
 * Type definitions for projects within the application.
 */

import { Module } from "./projectStructure";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  startDate: Date;
  endDate?: Date;
  owner: {
    id: string;
    name: string;
  };
  team?: {
    id: string;
    name: string;
    role?: string;
  }[];
  progress?: number;
  testCaseCount?: number;
  passRate?: number;
  runs?: any[]; // Array of test runs associated with this project
  createdAt: Date;
  updatedAt: Date;
  modules?: Module[];
}

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed';
