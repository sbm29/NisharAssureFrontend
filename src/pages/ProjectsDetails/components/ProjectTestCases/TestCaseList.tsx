import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { TestCase } from "@/types/testCase";
import { Module, TestSuite } from "@/types/projectStructure";
import { Link } from "react-router-dom";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  CheckSquare,
  Copy,
  Move,
} from "lucide-react";
import MoveTestCaseDialog from "@/components/projects/MoveTestCaseDialog";
import { useIsMobile } from "@/hooks/use-mobile";



interface TestCaseListProps {
  testCases: TestCase[];
  modules: Module[];
  testSuites: TestSuite[];
  onDelete: (id: string) => void;
  onExecute: (id: string) => void;
  onMove: (testCaseIds: string[], targetTestSuiteId: string) => void;
  onCopy: (testCaseIds: string[], targetTestSuiteId: string) => void;
  selectedIds: string[];
  onSelect: (id: string) => void;
  onToggleAll: (selectAll: boolean) => void;
}

const TestCaseList: React.FC<TestCaseListProps> = ({
  testCases,
  modules,
  testSuites,
  onDelete,
  onExecute,
  onMove,
  onCopy,
  selectedIds,
  onSelect,
  onToggleAll,
}) => {
  const isMobile = useIsMobile();
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [actionTargetTestCases, setActionTargetTestCases] = useState<
    TestCase[]
  >([]);

  console.table( testCases);
  console.log("TestCaseList modules", modules);
  console.log("TestCaseList testSuites", testSuites);



  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Low":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
          >
            Low
          </Badge>
        );
      case "Medium":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
          >
            Medium
          </Badge>
        );
      case "High":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
          >
            High
          </Badge>
        );
      case "Critical":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
          >
            Critical
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Functional":
        return (
          <Badge
            variant="secondary"
            className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
          >
            Functional
          </Badge>
        );
      case "Performance":
        return (
          <Badge
            variant="secondary"
            className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800"
          >
            Performance
          </Badge>
        );
      case "Security":
        return (
          <Badge
            variant="secondary"
            className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800"
          >
            Security
          </Badge>
        );
      case "Usability":
        return (
          <Badge
            variant="secondary"
            className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800"
          >
            Usability
          </Badge>
        );
      case "Compatibility":
        return (
          <Badge
            variant="secondary"
            className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800"
          >
            Compatibility
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
          >
            {type}
          </Badge>
        );
    }
  };

  const handleMoveClick = (testCase: TestCase) => {
    setActionTargetTestCases([testCase]);
    setMoveDialogOpen(true);
  };

  const handleCopyClick = (testCase: TestCase) => {
    setActionTargetTestCases([testCase]);
    setCopyDialogOpen(true);
  };

  // Responsive render functions
  const renderMobileView = () => (
    <div className="space-y-4">
      {testCases.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No test cases found
        </div>
      ) : (
        testCases.map((testCase) => (
          <div key={testCase._id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{testCase.testCaseId || "—"}</div>
                <Link
                  to={`/test-cases/${testCase._id}`}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {testCase.title}
                </Link>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => onExecute(testCase._id)}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Execute
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/test-cases/${testCase._id}/edit`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleMoveClick(testCase)}>
                    <Move className="h-4 w-4 mr-2" />
                    Move
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleCopyClick(testCase)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onSelect={() => onDelete(testCase._id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-full">
              {testCase.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {getPriorityBadge(testCase.priority)}
              {getTypeBadge(testCase.type)}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderDesktopView = () => (
    <div className="rounded-md border">
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={
                  testCases.length > 0 &&
                  selectedIds.length === testCases.length
                }
                onCheckedChange={(checked) => onToggleAll(checked as boolean)}
              />
            </TableHead>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell w-[100px]">
              Priority
            </TableHead>
            <TableHead className="hidden md:table-cell w-[130px]">
              Type
            </TableHead>
            <TableHead className="w-[220px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testCases?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No test cases found
              </TableCell>
            </TableRow>
          ) : (
            testCases?.map((testCase) => (
              <TableRow key={testCase._id}>
                <TableCell className="p-0 pr-0 text-center">
                  <Checkbox
                    checked={selectedIds.includes(testCase._id)}
                    onCheckedChange={() => onSelect(testCase._id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {testCase.testCaseId || "—"}
                </TableCell>
                <TableCell>
                  <Link
                    to={`/test-cases/${testCase._id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {testCase.title}
                  </Link>
                  <p className="text-sm text-muted-foreground truncate max-w-md">
                    {testCase.description}
                  </p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {getPriorityBadge(testCase.priority)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {getTypeBadge(testCase.type)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                  
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => handleMoveClick(testCase)}
                        >
                          <Move className="h-4 w-4 mr-2" />
                          Move to...
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleCopyClick(testCase)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to...
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onSelect={() => onDelete(testCase._id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}

      {actionTargetTestCases.length > 0 && (
        <>
          <MoveTestCaseDialog
            isOpen={moveDialogOpen}
            onOpenChange={setMoveDialogOpen}
            testCase={actionTargetTestCases}
            modules={modules}
            testSuites={testSuites}
            onMove={onMove}
            onCopy={onCopy}
            isMove={true}
          />

          <MoveTestCaseDialog
            isOpen={copyDialogOpen}
            onOpenChange={setCopyDialogOpen}
            testCase={actionTargetTestCases}
            modules={modules}
            testSuites={testSuites}
            onMove={onMove}
            onCopy={onCopy}
            isMove={false}
          />
        </>
      )}
    </>
  );
};

export default TestCaseList;
