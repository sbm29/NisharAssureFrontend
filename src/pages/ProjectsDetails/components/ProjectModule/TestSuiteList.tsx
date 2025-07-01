// src/components/TestSuiteList.tsx

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Move, Copy, Trash2 } from "lucide-react";
import { TestSuite } from "@/types/projectStructure";
import { TestCase } from "@/types/testCase";
import { useProjectSelection } from "@/contexts/ProjectContext/ProjectSelectionContext";

interface TestSuiteListProps {
  testSuites: TestSuite[];
  testCases: TestCase[];
  onTestSuiteDelete?: (id: string) => void;
}

const TestSuiteList: React.FC<TestSuiteListProps> = ({
  testSuites,
  testCases,
  onTestSuiteDelete,
}) => {
  const { activeTestSuiteId, setActiveTestSuiteId } = useProjectSelection();

  return (
    <div className="space-y-1 pl-6 pr-2 pb-2">
      {testSuites?.length === 0 ? (
        <p className="text-sm text-muted-foreground px-2 py-1">
          No test suites
        </p>
      ) : (
        testSuites.map((suite) => {
          const suiteTestCases = testCases.filter(
            (tc) => tc.testSuite._id === suite._id
          );

          return (
            <div
              key={suite._id}
              className={`flex items-center justify-between p-2 rounded hover:bg-muted group cursor-pointer ${
                activeTestSuiteId === suite._id ? "bg-muted" : ""
              }`}
              onClick={() => setActiveTestSuiteId(suite._id)}
            >
              <div className="flex items-center">
                <span className="text-sm">{suite.name}</span>
                <Badge variant="outline" className="ml-2">
                  {suiteTestCases.length}
                </Badge>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex items-center">
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
                      Edit Test Suite
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Move className="h-4 w-4 mr-2" />
                      Move to...
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to...
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => onTestSuiteDelete?.(suite._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-red-500">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TestSuiteList;
