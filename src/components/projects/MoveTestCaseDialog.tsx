import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Module, TestSuite } from "@/types/projectStructure";
import { TestCase } from "@/types/testCase";

interface MoveTestCaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  testCase: TestCase[];
  modules: Module[];
  testSuites: TestSuite[];
  onMove: (testCaseIds: string[], targetTestSuiteId: string) => void;
  onCopy: (testCaseIds: string[], targetTestSuiteId: string) => void;
  isMove?: boolean;
}

const MoveTestCaseDialog: React.FC<MoveTestCaseDialogProps> = ({
  isOpen,
  onOpenChange,
  testCase,
  modules,
  testSuites,
  onMove,
  onCopy,
  isMove = true,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    testCase[0].moduleId
  );
  const [selectedTestSuiteId, setSelectedTestSuiteId] = useState<string>(
    testCase[0].testSuite._id
  );

  const filteredTestSuites = testSuites.filter(
    suite => suite.module._id === selectedModuleId
  );

  // const FilterSuitesAtMoveTestCase = testSuites.map((suite) =>
  //   console.log("MoveTestCaseDialog", suite)
  // );

  const handleModuleChange = (value: string) => {
    setSelectedModuleId(value);
    // Reset test suite when module changes
    setSelectedTestSuiteId("");
  };

  const handleSubmit = () => {
    if (selectedTestSuiteId) {
      if (isMove) {
        onMove(testCase.map((tc) => tc._id), selectedTestSuiteId);
      } else {
        onCopy(testCase.map((tc) => tc._id), selectedTestSuiteId);
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isMove ? "Move" : "Copy"} Test Case</DialogTitle>
          <DialogDescription>
            {isMove
              ? "Select the destination test suite to move this test case to."
              : "Select the destination test suite to copy this test case to."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Module</Label>
            <Select value={selectedModuleId} onValueChange={handleModuleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module._id} value={module._id}>
                    {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Test Suite</Label>
            <Select
              value={selectedTestSuiteId}
              onValueChange={setSelectedTestSuiteId}
              disabled={filteredTestSuites.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    filteredTestSuites.length === 0
                      ? "No test suites available"
                      : "Select a test suite"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredTestSuites.map((suite) => (
                  <SelectItem key={suite._id} value={suite._id}>
                    {suite.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedTestSuiteId}>
            {isMove ? "Move" : "Copy"} Test Case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveTestCaseDialog;
