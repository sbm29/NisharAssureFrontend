import { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TestRunList from "./TestRunList";
import CreateTestRunDialog from "./CreateTestRunDialog";
import { useTestRunsByProject } from "@/hooks/testruns/useTestRunByProject";
const ProjectTestRuns = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const {
    data: testRunsForProject,
    isLoading,
    isError,
  } = useTestRunsByProject(projectId!);

  console.log("Project ID from URL:", projectId);

  console.log("🔍 ProjectTestRuns - testRunsForProject:", testRunsForProject);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <h1 className="text-2xl font-bold">Test Runs</h1>
          <p className="text-muted-foreground">
            Manage test runs for this project
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Test Run
        </Button>
      </div>

      {/* Loading or Error */}
      {isLoading && (
        <p className="text-muted-foreground">Loading test runs...</p>
      )}
      {isError && <p className="text-red-500">Failed to load test runs.</p>}

      {/* Render test runs */}
      {Array.isArray(testRunsForProject) && testRunsForProject.length > 0 ? (
        <TestRunList testRuns={testRunsForProject} />
      ) : (
        !isLoading && (
          <p className="text-muted-foreground">No test runs available.</p>
        )
      )}
      {/* Modal for creating test run */}
      <CreateTestRunDialog
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        projectId={projectId!}
      />
    </MainLayout>
  );
};

export default ProjectTestRuns;
