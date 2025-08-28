import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import TestCaseList from "@/pages/ProjectsDetails/components/ProjectTestCases/TestCaseList";
import TestCaseForm from "@/components/test-cases/TestCaseForm";
import ImportTestCases from "@/components/test-cases/ImportTestCases";
import { TestCase } from "@/types/testCase";
import { Module, TestSuite } from "@/types/projectStructure";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useProjectSelection } from "../../../../contexts/ProjectContext/ProjectSelectionContext"

// Define props interface for component
interface ProjectTestCasesProps {
  projectId: string;
  testCases: TestCase[];
  activeModule: string;
  activeTestSuite: string;
  modules?: Module[];
  testSuites?: TestSuite[];
  //onCreateTestCase: (data: any) => void;
  onDeleteTestCase: (id: string) => void;
  onExecuteTestCase: (id: string) => void;
  onMoveTestCase?: (testCaseIds: string[], targetTestSuiteId: string) => void;
  onCopyTestCase?: (testCaseIds: string[], targetTestSuiteId: string) => void;
}

const ProjectTestCases: React.FC<ProjectTestCasesProps> = ({
  projectId,
  testCases,
  activeModule,
  activeTestSuite,
  modules = [],
  testSuites = [],
  onDeleteTestCase,
  onExecuteTestCase,
  onMoveTestCase = () => {},
  onCopyTestCase = () => {},
}) => {
  const [isTestCaseDialogOpen, setIsTestCaseDialogOpen] = useState(false);
  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState<string[]>([]);
  // Check if a module and test suite are selected


  const noModuleSelected = !activeModule;
  const noTestSuiteSelected = activeModule && !activeTestSuite;
  //const noModuleOrTestSuiteSelected = !activeModule || !activeTestSuite;

  

  //console.log("Active test suid id at PROJECT TEST CASE  ", activeTestSuite);
  //console.log("Active module id at PROJECT TEST CASE ", activeModule);
  //console.log("Test cases from project detail to test cases at PROJECT TEST CASE  ", testCases);

  const handleSuccess = () => {
    setIsTestCaseDialogOpen(false);
  };

  const handleSelect = (id: string) => {
    setSelectedTestCaseIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (selectAll: boolean) => {
    setSelectedTestCaseIds(selectAll ? testCases.map((tc) => tc._id) : []);
  };

  return (
    <Card>
      {/* Header section with title and action buttons */}
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Test Cases</CardTitle>
          <CardDescription>
            {activeModule && activeTestSuite
              ? `Test cases in selected test suite`
              : activeModule
              ? "Select a test suite to view test cases"
              : "Select a module and test suite to view test cases"}
          </CardDescription>
        </div>
        {/* Action buttons for importing and adding test cases */}
        <div className="flex gap-2">
          {/* Import test cases button */}
          <ImportTestCases
            projectId={projectId}
            moduleId={activeModule}
            testSuiteId={activeTestSuite}
            onImportSuccess={() => {
              console.log("Refreshing test cases after import");
            }}
          />
          {/* Add test case dialog */}
          <Dialog open={isTestCaseDialogOpen} onOpenChange={setIsTestCaseDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!activeModule || !activeTestSuite}>
                <Plus className="h-4 w-4 mr-2" />
                Add Test Case
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Test Case</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <TestCaseForm
                  //onSubmit={onCreateTestCase}
                  projectId={projectId}
                  onSuccess={handleSuccess}
                  testSuiteId={activeTestSuite}
                  //moduleId={activeModule}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Display appropriate guidance when no module is selected */}
        <div className="mb-2">
            <Button 
              className = {noModuleSelected || noTestSuiteSelected || testCases.length === 0 ? "hidden" : ""}
              disabled={ selectedTestCaseIds.length === 0}
              variant="destructive"
              onClick={() => {
                selectedTestCaseIds.forEach((id) => onDeleteTestCase(id));
                setSelectedTestCaseIds([]);
              }}
            >
              Delete Selected ({selectedTestCaseIds.length})
            </Button> 
          </div>

        {noModuleSelected && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please select a module from the project structure.
            </AlertDescription>
          </Alert>
        )}

        {/* Display appropriate guidance when no test suite is selected */}
        {noTestSuiteSelected && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please select a test suite from the project structure.
            </AlertDescription>
          </Alert>
        )}

        {/* Display test cases list when both module and test suite are selected */}
        

        {activeModule && activeTestSuite && (
          <TestCaseList
            testCases={testCases}
            modules={modules}
            testSuites={testSuites}
            onDelete={onDeleteTestCase}
            onExecute={onExecuteTestCase}
            onMove={onMoveTestCase}
            onCopy={onCopyTestCase}
            selectedIds={selectedTestCaseIds}
            onSelect={handleSelect}
            onToggleAll={handleToggleAll}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTestCases;
