// TestExecutionLanding.tsx
import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
//import { mockProjects } from "@/data/mockData"; // Replace with real API/data source if needed
import { useAllProjects } from '@/hooks/projects/useAllProjects';


const TestExecutionMain: React.FC = () => {
const { data: projects, isLoading, isError } = useAllProjects();

   console.log("Projects Data:", projects);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Test Execution</h1>
            <p className="text-muted-foreground mt-1">Select a project to manage its test runs</p>
          </div>
        </div>

        {/* Loader or Error */}
        {isLoading && <p className="text-muted-foreground">Loading projects...</p>}
        {isError && <p className="text-red-500">Failed to load projects.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(projects) && projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button asChild>
                  <Link to={`/test-execution/${project.id}`} className="flex items-center">
                    <Play className="mr-2 h-4 w-4" />
                    Execute
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default TestExecutionMain;
