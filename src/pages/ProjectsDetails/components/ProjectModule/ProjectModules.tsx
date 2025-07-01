import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  FolderOpen,
  FolderClosed,
  Trash2,
  Edit,
  Copy,
  Move,
} from "lucide-react";
import { Module, TestSuite } from "@/types/projectStructure";
import { TestCase } from "@/types/testCase";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ModuleForm from "./ModuleForm";
import TestSuiteForm from "./TestSuiteForm";
import TestSuiteList from "./TestSuiteList";
import { useMoveTestSuite } from "@/hooks/testsuites/useMoveTestSuite";
import { useCopyTestSuite } from "@/hooks/testsuites/useCopyTestSuite";
import MoveTestSuiteDialog from "@/components/projects/MoveTestSuiteDialog";

interface ProjectModulesProps {
  projectId: string;
  modules: Module[];
  testSuites: TestSuite[];
  testCases: TestCase[];
  activeModuleId: string;
  activeTestSuiteId: string;
  onModuleCreate?: (data: any) => void;
  onModuleDelete?: (id: string) => void;
  onTestSuiteCreate?: (moduleId: string, data: any) => void;
  onTestSuiteDelete?: (id: string) => void;
  onModuleSelect?: (moduleId: string) => void;
  onTestSuiteSelect?: (testSuiteId: string) => void;
  onMoveTestCase?: (testCaseId: string, targetTestSuiteId: string) => void;
  onCopyTestCase?: (testCaseId: string, targetTestSuiteId: string) => void;
  onMoveTestSuite?: (testSuiteId: string, targetModuleId: string) => void;
  onCopyTestSuite?: (testSuiteId: string, targetModuleId: string) => void;
}

const ProjectModules: React.FC<ProjectModulesProps> = ({
  projectId,
  modules,
  testSuites,
  testCases,
  activeModuleId,
  activeTestSuiteId,

  onModuleDelete,
  onTestSuiteCreate,
  onTestSuiteDelete,
  onModuleSelect,
  onTestSuiteSelect,
  onMoveTestCase,
  onCopyTestCase,
  onMoveTestSuite,
  onCopyTestSuite,
}) => {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [isAddModuleDialogOpen, setIsAddModuleDialogOpen] = useState(false);
  const [isAddTestSuiteDialogOpen, setIsAddTestSuiteDialogOpen] =
    useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [moveSuiteDialogOpen, setMoveSuiteDialogOpen] = useState(false);
  const [copySuiteDialogOpen, setCopySuiteDialogOpen] = useState(false);
  const [actionTargetSuite, setActionTargetSuite] = useState<TestSuite | null>(
    null
  );
  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const { mutate: moveTestSuite } = useMoveTestSuite();
  const { mutate: copyTestSuite } = useCopyTestSuite();

  const handleMoveSuiteClick = (suite: TestSuite) => {
    setActionTargetSuite(suite);
    setMoveSuiteDialogOpen(true);
  };

  const handleCopySuiteClick = (suite: TestSuite) => {
    setActionTargetSuite(suite);
    setCopySuiteDialogOpen(true);
  };

  const handleAddModuleDialog = (data: any) => {
    setIsAddModuleDialogOpen(false);
  };

  const openAddTestSuiteDialog = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setIsAddTestSuiteDialogOpen(true);
  };

  console.log("TESTCASES AT PROJECT MODULE PAGE ", testCases);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle>Project Structure</CardTitle>
        <Dialog
          open={isAddModuleDialogOpen}
          onOpenChange={setIsAddModuleDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Module</DialogTitle>
            </DialogHeader>
            <ModuleForm
              projectId={projectId}
              onSuccess={handleAddModuleDialog}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4   ">
          {!modules || modules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No modules found</p>
              <p className="text-sm mt-1">
                Add your first module to organize test suites
              </p>
            </div>
          ) : (
            <div className="space-y-2  pr-1 w-full max-w-[410px]  ">
              {modules.length > 0 &&
                modules?.map((module) => {
                  //console.log("module", module);
                  //console.log("testSuites at project module ", testSuites);

                  const moduleSuites = testSuites?.filter(
                    (suite) => suite.module && suite.module._id === module._id
                  );

                  // console.log(
                  //   "moduleSuites after mapping module",
                  //   moduleSuites
                  // );
                  const isOpen = openModules[module._id] || false;

                  return (
                    <Collapsible
                      key={module._id}
                      open={isOpen}
                      onOpenChange={() => toggleModule(module._id)}
                      className={`border rounded-md  ${
                        activeModuleId === module._id
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between p-2">
                        <div className="flex-1">
                          <CollapsibleTrigger className="flex items-center w-full text-left">
                            {isOpen ? (
                              <FolderOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                            ) : (
                              <FolderClosed className="h-4 w-4 mr-2 text-muted-foreground" />
                            )}
                            <span
                              className="font-medium"
                              onClick={() => onModuleSelect(module._id)}
                            >
                              {module.name}
                            </span>
                            <Badge variant="outline" className="ml-2">
                              {moduleSuites.length}
                            </Badge>
                          </CollapsibleTrigger>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAddTestSuiteDialog(module._id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Test Suite
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <span className="sr-only">Actions</span>
                                <span className="flex h-4 w-4 items-center justify-center">
                                  ...
                                </span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Module
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => onModuleDelete(module._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                <span className="text-red-500">Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CollapsibleContent>
                        <div className="space-y-1 pl-6 pr-2 pb-2">
                          {moduleSuites?.length === 0 ? (
                            <p className="text-sm text-muted-foreground px-2 py-1">
                              No test suites
                            </p>
                          ) : (
                            moduleSuites?.map((suite) => {
                              console.log("suite in the model suite ", suite);
                              console.log("testCases in the module", testCases);
                              // const testSuiteId = testCases.map((tc) =>
                              //   console.log("TC", tc)
                              // );

                              const suiteTestCases = Array.isArray(testCases)
                                ? testCases.filter((tc) =>
                                    typeof tc.testSuite === "string"
                                      ? tc.testSuite === suite._id
                                      : tc.testSuite._id === suite._id
                                  )
                                : [];
                              // console.log(
                              //   "suiteTestCases in the module",
                              //   suiteTestCases
                              // );

                              return (
                                <div
                                  key={suite._id}
                                  className={`flex items-center justify-between p-2 rounded hover:bg-muted group cursor-pointer ${
                                    activeTestSuiteId === suite._id
                                      ? "bg-muted"
                                      : ""
                                  }`}
                                  onClick={() => onTestSuiteSelect(suite._id)}
                                >
                                  <div className="flex items-center">
                                    <span className="text-sm">
                                      {suite.name}
                                    </span>
                                    <Badge variant="outline" className="ml-2">
                                      {suiteTestCases?.length}
                                    </Badge>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 flex items-center">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <span className="sr-only">
                                            Actions
                                          </span>
                                          <span className="flex h-4 w-4 items-center justify-center">
                                            ...
                                          </span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit Test Suite
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() =>
                                            handleMoveSuiteClick(suite)
                                          }
                                        >
                                          <Move className="h-4 w-4 mr-2" />
                                          Move to...
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() =>
                                            handleCopySuiteClick(suite)
                                          }
                                        >
                                          <Copy className="h-4 w-4 mr-2" />
                                          Copy to...
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() =>
                                            onTestSuiteDelete(suite._id)
                                          }
                                        >
                                          <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                          <span className="text-red-500">
                                            Delete
                                          </span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Add Test Suite Dialog */}
      <Dialog
        open={isAddTestSuiteDialogOpen}
        onOpenChange={setIsAddTestSuiteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Test Suite</DialogTitle>
          </DialogHeader>
          <TestSuiteForm
            moduleId={currentModuleId || ""}
            projectId={projectId}
          />
        </DialogContent>
      </Dialog>

      {actionTargetSuite && (
        <>
          <MoveTestSuiteDialog
            isOpen={moveSuiteDialogOpen}
            onOpenChange={setMoveSuiteDialogOpen}
            testSuite={actionTargetSuite}
            modules={modules}
            onMove={(testSuiteId, targetModuleId) => {
              moveTestSuite({ testSuiteId, targetModuleId });
              if (onMoveTestSuite) onMoveTestSuite(testSuiteId, targetModuleId);
            }}
            onCopy={() => {}}
            isMove={true}
          />
          <MoveTestSuiteDialog
            isOpen={copySuiteDialogOpen}
            onOpenChange={setCopySuiteDialogOpen}
            testSuite={actionTargetSuite}
            modules={modules}
            onMove={() => {}}
            onCopy={(testSuiteId, targetModuleId) => {
              copyTestSuite({ testSuiteId, targetModuleId });
              if (onCopyTestSuite) onCopyTestSuite(testSuiteId, targetModuleId);
            }}
            isMove={false}
          />
        </>
      )}
    </Card>
  );
};

export default ProjectModules;
