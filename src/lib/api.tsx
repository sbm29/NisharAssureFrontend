import axios from "axios";
import { BaseURL } from "./config";

export const fetchProject = async (projectId: string) => {
  const res = await axios.get(`${BaseURL}/api/projects/project/${projectId}`);
  return res.data;
};

export const fetchModules = async (projectId: string) => {
  try {
    const res = await axios.get(`${BaseURL}/api/modules/getModules`, {
      params: { project: projectId }, 
    });
    console.log("Modules from API ",res.data.modules);
    return res.data.modules ;
  } catch (error) {
    console.error("Failed to fetch modules:", error);
    return [];
  }
};

export const fetchTestSuites = async (moduleId: string) => {
  const res = await axios.get(`${BaseURL}/api/testsuites/getTestSuites/${moduleId}`);
  console.log("TestSuites from API ", res.data);
  return res.data;
};
export const fetchAllTestSuites = async () => {
  const res = await axios.get(`${BaseURL}/api/testsuites/getTestSuites`); // Adjust endpoint as needed
  console.log("TestSuites from API ", res.data);
  return res.data;
};

export const fetchAllTestCasesForProject = async (projectId: string) => {
  const response = await axios.get(`${BaseURL}/api/projects/${projectId}/testcases`);
  console.log("TestCases from API ", response.data);
  return response.data;
};

export const getTestCaseById = async (id: string) => {
  const response = await axios.get(`${BaseURL}/api/testcases/${id}`);
  return response.data;
};