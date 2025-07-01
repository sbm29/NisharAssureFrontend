import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/projects/useProject";
import { useModules } from "@/hooks/modules/useModules";
import { useTestSuites } from "@/hooks/testsuites/useTestSuites";
import { useProjectTestCases } from "@/hooks/useProjectTestCases";
import { useAddModule } from "@/hooks/modules/useAddModule";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckSquare, Activity, ChartBar } from "lucide-react";
import ProjectOverview from "@/components/projects/ProjectOverview";
import ProjectTestCases from "@/pages/ProjectsDetails/components/ProjectTestCases/ProjectTestCases";
import ProjectExecution from "@/components/projects/ProjectExecution";
import ProjectModules from "@/pages/ProjectsDetails/components/ProjectModule/ProjectModules";
import { toast } from "@/hooks/use-toast";
import { fetchAllTestSuites } from "@/lib/api";
import { useDeleteTestCase } from "@/hooks/testcases/useDeleteTestCases";
import { useMoveTestCases } from "@/hooks/testcases/useMoveTestCases";
import { useCopyTestCases } from "@/hooks/testcases/useCopyTestCase";
import { useProjectSelection } from "@/contexts/ProjectContext/ProjectSelectionContext";

export default function ProjectDetail() {
  const { projectId } = useParams();
  // const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  // const [activeTestSuiteId, setActiveTestSuiteId] = useState<string | null>(
  //   null
  // );
  const [activeTab, setActiveTab] = useState("overview");
  //const [isTestCaseDialogOpen, setIsTestCaseDialogOpen] = useState(false);
  const {
    activeModuleId,
    setActiveModuleId,
    activeTestSuiteId,
    setActiveTestSuiteId,
  } = useProjectSelection();

  //console.log("Active Module ID at Project Detail Page ", activeModuleId);
  //console.log("Active Test Suite ID at Project Detail Page ", activeTestSuiteId);

  const { data: project, isLoading: loadingProject } = useProject(projectId!);
  const { data: modules, isLoading: loadingModules } = useModules(projectId!);
  const { data: testSuites, isLoading: loadingTestSuites } = useTestSuites();
  const { data: testCases, isLoading: isLoadingTestCases } =
    useProjectTestCases(projectId);
  const { mutate: deleteTestCase, isPending: isDeletingTestCase } =
    useDeleteTestCase(projectId);

  console.log("TESTCASES at PROJECT DETAIL Page ", testCases);
  console.log("MODULES at PROJECT DETAIL Page ", modules);
  console.log("TESTSUITES at PROJECT DETAIL Page ", testSuites);
  const { mutate: moveTestCase } = useMoveTestCases();
  const { mutate: copyTestCase } = useCopyTestCases();

  const handleDelete = (testCaseId: string) => {
    deleteTestCase(testCaseId);
  };

  const handleMoveTestCase = (
    selectedIds: string[],
    targetTestSuiteId: string
  ) => {
    try {
      moveTestCase({
        testCaseIds: selectedIds,
        targetTestSuiteId,
      });
    } catch (error) {
      console.error("Error moving test case:", error);
    }
  };

  const handleCopyTestCase = (
    selectedIds: string[],
    targetTestSuiteId: string
  ) => {
    try {
      copyTestCase({
        testCaseIds: selectedIds,
        targetTestSuiteId,
      });
    } catch (error) {
      console.error("Error copying test cases:", error);
    }
  };

  console.log("TestSuites at Project Detail Page ", testSuites);

  const handleModuleSelect = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setActiveTestSuiteId(null); // Reset test suite when switching modules
  };

  const handleTestSuiteSelect = (suiteId: string) => {
    setActiveTestSuiteId(suiteId);
    console.log("TestSuite selected : Project page ", suiteId);
  };

  if (
    loadingProject ||
    loadingModules ||
    loadingTestSuites ||
    isLoadingTestCases
  ) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/projects">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "on hold":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // console.log(
  //   "Active TestSuite ID at Project Detail Page ",
  //   activeTestSuiteId
  // );
  console.log("TestCases at Project Detail Page ", testCases);
  const projectTestCases = activeTestSuiteId
    ? testCases?.filter(
        (testCase) => testCase.testSuite?._id === activeTestSuiteId
      )
    : testCases;
  console.log("FILTERED TestCases at Project Detail Page ", projectTestCases);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Projects
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-4 items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
          <Link to={`/projects/${projectId}/dashboard`}>
            <Button>
              <ChartBar className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="test-cases">
              <FileText className="h-4 w-4 mr-2" />
              Test Cases
            </TabsTrigger>
            <TabsTrigger value="execution">
              <CheckSquare className="h-4 w-4 mr-2" />
              Test Execution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ProjectOverview project={project} />
          </TabsContent>

          <TabsContent value="test-cases">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 ">
                <ProjectModules
                  projectId={project.id}
                  modules={modules}
                  testSuites={testSuites}
                  testCases={testCases}
                  activeModuleId={activeModuleId}
                  activeTestSuiteId={activeTestSuiteId}
                  onModuleSelect={setActiveModuleId}
                  onTestSuiteSelect={setActiveTestSuiteId}
                />
              </div>

              <div className="md:col-span-3">
                {/* <ProjectTestCases 
                  projectId={project.id}
                  testCases={filteredTestCases}
                  activeModule={activeModuleId}
                  activeTestSuite={activeTestSuiteId}
                  modules={modules}
                  testSuites={testSuites}
                  onCreateTestCase={handleCreateTestCase}
                  onDeleteTestCase={handleDeleteTestCase}
                  onExecuteTestCase={handleExecuteTestCase}
                  onMoveTestCase={handleMoveTestCase}
                  onCopyTestCase={handleCopyTestCase}
                /> */}

                <ProjectTestCases
                  projectId={projectId!}
                  testCases={projectTestCases}
                  activeModule={activeModuleId}
                  activeTestSuite={activeTestSuiteId}
                  modules={modules ?? []}
                  testSuites={testSuites ?? []}
                  //onCreateTestCase={handleCreateTestCase}
                  onDeleteTestCase={(id) => {
                    handleDelete(id);
                  }}
                  onExecuteTestCase={(id) => {
                    console.log("Execute", id);
                  }}
                  onMoveTestCase={(testCaseIds, targetTestSuiteId) => {
                    handleMoveTestCase(testCaseIds, targetTestSuiteId);
                  }}
                  onCopyTestCase={(testCaseIds, targetTestSuiteId) => {
                    handleCopyTestCase(testCaseIds, targetTestSuiteId);
                  }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="execution">
            <ProjectExecution
              projectId={project.id}
              testCases={testCases}
              onNavigateToTestCases={() =>
                console.log("handlefuncitonherepreviously")
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
