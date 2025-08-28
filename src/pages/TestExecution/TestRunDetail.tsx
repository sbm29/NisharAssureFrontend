import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckSquare,
  ArrowLeft,
  PlusCircle,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  History,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import TestExecutionForm from "@/components/test-execution/TestExecutionForm";
import TestExecutionHistory from "@/components/test-execution/TestExecutionHistory";
import { useTestRunDetail } from "@/hooks/testruns/useTestRunDetail";
import { useExecuteTestCase } from "@/hooks/testruns/useExecuteTestCase";
import { useTestCaseHistory } from "@/hooks/testruns/useTestCaseHistory";
import { useTestCasesByProject } from "@/hooks/testruns/useTestCaseByProject";
import { useAddTestCaseToRun } from "@/hooks/testruns/useAddTestCaseToRun";
import { error } from "console";
import { useTestRunMetrics } from "@/hooks/testruns/useTestRunMetrics";
import { TestCase } from "@/types/testCase";

const TestRunDetail = () => {
  const { id: testRunId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [addTestCasesDialogOpen, setAddTestCasesDialogOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [testExecutionDialogOpen, setTestExecutionDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState<string[]>([]);
  const { toast } = useToast();
  const location = useLocation();
  const backState = location.state as {
    fromProjectId?: string;
    fromTab?: string;
  };
  const { data: testRun, isLoading, isError } = useTestRunDetail(testRunId!);
  const { data: metricsData } = useTestRunMetrics(testRunId!);

  console.log("TestRunDetail:", testRun);

  const { data: allTestCases = [] } = useTestCasesByProject(
    testRun?.projectId._id
  );
  const executeTestCase = useExecuteTestCase(testRunId!);
  const addTestCasesMutation = useAddTestCaseToRun(testRunId!);

  // Filter test cases based on status
  const notExecutedTestCases =
    testRun?.testCases?.filter(
      (tc: TestCase) => tc.status === "Not Executed"
    ) || [];

  console.log("Not Executed Test Cases:", notExecutedTestCases);
  const executedTestCases =
    testRun?.testCases?.filter((tc) => tc.status !== "Not Executed") || [];

  const existingTestCaseIds =
    testRun?.testCases?.map((tc) => tc.testCaseId?._id || tc.testCaseId) || [];

  const filteredTestCases = allTestCases?.filter(
    (tc) => !existingTestCaseIds.includes(tc._id)
  );

  const handleAddTestCases = async () => {
    try {
      await addTestCasesMutation.mutateAsync(selectedTestCaseIds);
      toast({
        title: "Test Cases Added",
        description: "Selected test cases have been added to the test run.",
      });
      setAddTestCasesDialogOpen(false);
      setSelectedTestCaseIds([]);
    } catch {
      toast({
        title: "Error",
        description: "Failed to add test cases.",
        variant: "destructive",
      });
    }
  };

  const handleExecuteTestCase = (testCase: any) => {
    setSelectedTestCase(testCase);
    //setTestExecutionDialogOpen(true);
    //console.log("Selected Test Case", testCase);
  };

  useEffect(() => {
    if (selectedTestCase) {
      setTestExecutionDialogOpen(true);
      console.log("Selected Test Case", selectedTestCase);
    }
  }, [selectedTestCase]);

  const handleShowHistory = (testCase: any) => {
    setSelectedTestCase(testCase);
    setHistoryDialogOpen(true);
  };

  const handleTestSubmit = async (values: any) => {
    try {
      await executeTestCase.mutateAsync({
        testRunId,
        testCaseId: selectedTestCase._id || selectedTestCase.testCaseId?._id,
        status: values.status,
        actualResults: values.actualResults,
        notes: values.notes,
      });
      toast({
        title: `Test case ${values.status.toLowerCase()}`,
        description: "Execution has been recorded.",
      });
      setTestExecutionDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to record execution.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = (status: string) => {
    toast({
      title: "Test Run Updated",
      description: `Test run status changed to ${status}.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Blocked":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Play className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Passed":
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case "Failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "Blocked":
        return <Badge className="bg-amber-100 text-amber-800">Blocked</Badge>;
      case "Not Executed":
        return (
          <Badge className="bg-gray-100 text-gray-800">Not Executed</Badge>
        );
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            In Progress
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      {isLoading ? (
        <div className="text-muted-foreground p-8">Loading test run...</div>
      ) : isError ? (
        <div className="text-red-500 p-8">Failed to load test run data.</div>
      ) : !testRun ? (
        <div className="text-red-500 p-8">Test run not found.</div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Link
              to={`/projects/${testRun.projectId._id}`}
              state={{ activeTab: "test-execution" }}
            >
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Test Runs
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row justify-between gap-4 items-start">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{testRun.name}</h1>
                {getStatusBadge(testRun.status)}
              </div>
              <p className="text-muted-foreground mt-1">
                {testRun.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <Link
                  to={`/projects/${testRun.projectId.name}`}
                  className="text-primary hover:underline"
                >
                  {testRun.projectId.name}
                </Link>
                <span>•</span>
                <span>
                  Created on{" "}
                  {testRun?.createdAt
                    ? new Date(testRun.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
                <span>•</span>
                <span>by {testRun.createdBy.name}</span>
              </div>
            </div>
            <div className="space-x-2">
              <Select
                defaultValue={testRun.status}
                onValueChange={handleUpdateStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setAddTestCasesDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Test Cases
              </Button>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {metricsData?.passRate}%
                  </div>
                  <p className="text-muted-foreground mt-1">Pass Rate</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {metricsData?.passed}
                  </div>
                  <p className="text-muted-foreground mt-1">Passed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {metricsData?.failed}
                  </div>
                  <p className="text-muted-foreground mt-1">Failed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">
                    {metricsData?.blocked}
                  </div>
                  <p className="text-muted-foreground mt-1">Blocked</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Progress value={metricsData?.passRate} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>Executed: {metricsData?.executed} test cases</div>
            <div>Remaining: {metricsData?.notExecuted} test cases</div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pending">
                Pending Execution
                <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs py-0.5 px-2">
                  {notExecutedTestCases.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="executed">
                Executed
                <span className="ml-2 rounded-full bg-muted text-muted-foreground text-xs py-0.5 px-2">
                  {executedTestCases.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Test Run Summary : To be revisited later , add charts , etc{" "}
                  </CardTitle>
                  <CardDescription>
                    Overview of the test run execution status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Summary stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Total Test Cases
                        </div>
                        <div className="text-2xl font-bold">
                          {testRun.testCases.length}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Executed
                        </div>
                        <div className="text-2xl font-bold">
                          {testRun.executed}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Completion
                        </div>
                        <div className="text-2xl font-bold">
                          {Math.round(
                            (testRun.executed / testRun.testCasesCount) * 100
                          )}
                          %
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Duration
                        </div>
                        <div className="text-2xl font-bold">2d 4h</div>
                      </div>
                    </div>

                    {/* Status distribution */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Status Distribution
                      </h3>
                      <div className="h-80 bg-muted/20 rounded-md flex items-end justify-around p-4">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="bg-gray-200 h-[60%] w-16 rounded-t-md"></div>
                          <div>Not Executed</div>
                          <div className="text-sm text-muted-foreground">
                            {testRun.notExecuted}
                          </div>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="bg-green-200 h-[30%] w-16 rounded-t-md"></div>
                          <div>Passed</div>
                          <div className="text-sm text-muted-foreground">
                            {testRun.passed}
                          </div>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="bg-red-200 h-[10%] w-16 rounded-t-md"></div>
                          <div>Failed</div>
                          <div className="text-sm text-muted-foreground">
                            {testRun.failed}
                          </div>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="bg-yellow-200 h-[0%] w-16 rounded-t-md"></div>
                          <div>Blocked</div>
                          <div className="text-sm text-muted-foreground">
                            {testRun.blocked}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Test Cases</CardTitle>
                  <CardDescription>
                    Test cases that still need to be executed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notExecutedTestCases.length === 0 ? (
                    <div className="bg-muted/40 rounded-lg p-8 text-center">
                      <h3 className="text-lg font-medium">
                        All test cases executed
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        There are no pending test cases in this run
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notExecutedTestCases.map((testCase) => (
                        <Card key={testCase._id} className="overflow-hidden">
                          <div className="p-4 border-b border-border">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">
                                  <span className="mr-2 text-primary font-semibold">
                                    {testCase.testCaseId.testCaseId}
                                  </span>
                                  <span className="font-normal">
                                    {testCase.testCaseId.title}
                                  </span>
                                </h3>
                                <div className="text-sm text-muted-foreground mt-1">
                                  Priority: {testCase.testCaseId.priority} •
                                  Type: {testCase.testCaseId.type}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="ml-4"
                                onClick={() => handleExecuteTestCase(testCase)}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Execute
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="executed">
              <Card>
                <CardHeader>
                  <CardTitle>Executed Test Cases</CardTitle>
                  <CardDescription>
                    Test cases that have been executed in this run
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {executedTestCases.length === 0 ? (
                    <div className="bg-muted/40 rounded-lg p-8 text-center">
                      <h3 className="text-lg font-medium">
                        No test cases executed yet
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        Start executing test cases from the Pending tab
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setActiveTab("pending")}
                      >
                        Go to pending test cases
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {executedTestCases.map((testCase) => (
                        <>
                          {console.log("Executed Test Case:", testCase)}
                          <Card key={testCase._id} className="overflow-hidden">
                            <div className="p-4 border-b border-border">
                              <div className="flex items-start justify-between">
                                {/* Left section: Test Case info */}
                                <div className="flex flex-col">
                                  {/* First line: Status icon, Title, Status Badge */}
                                  <div className="flex items-center gap-2">
                                    <div>{getStatusIcon(testCase.status)}</div>
                                    <h3 className="font-medium">
                                      <span className="mr-2 text-primary font-semibold">
                                        {testCase.testCaseId.testCaseId}
                                      </span>
                                      <span className="font-normal">
                                        {testCase.testCaseId.title}
                                      </span>
                                    </h3>
                                    {getStatusBadge(testCase.status)}
                                  </div>
                                  {/* Second line: Executed by info */}
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <span>
                                      Executed by {testCase.executedBy?.name}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {testCase.executedAt &&
                                        new Date(
                                          testCase.executedAt
                                        ).toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                {/* Right section: Buttons */}
                                <div className="flex gap-2">
                                  {testCase.history &&
                                    testCase.history.length > 0 && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleShowHistory(testCase)
                                        }
                                      >
                                        <History className="h-4 w-4 mr-2" />
                                        History ({testCase.history.length})
                                      </Button>
                                    )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleExecuteTestCase(testCase)
                                    }
                                  >
                                    <CheckSquare className="h-4 w-4 mr-2" />
                                    Update
                                  </Button>
                                </div>
                              </div>

                              {/* Optional Actual Results / Notes */}
                              {testCase.actualResults && (
                                <div className="mt-4 pt-4 border-t border-border">
                                  <h4 className="text-sm font-medium mb-1">
                                    Actual Results
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {testCase.actualResults}
                                  </p>
                                  {testCase.notes && (
                                    <div className="mt-2">
                                      <h4 className="text-sm font-medium mb-1">
                                        Notes
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {testCase.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </Card>
                        </>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {/* Add Test Cases Dialog */}
      <Dialog
        open={addTestCasesDialogOpen}
        onOpenChange={setAddTestCasesDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add Test Cases to Test Run</DialogTitle>
            <DialogDescription>
              Select test cases to include in this test run.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {filteredTestCases.slice(0, 25).map((testCase) => (
              <>
                {console.log("Filtered Test Case:", testCase)}
                <div
                  key={testCase.id}
                  className="flex items-center space-x-2 py-2 border-b"
                >
                  <input
                    type="checkbox"
                    id={testCase._id}
                    className="rounded border-gray-400"
                    checked={selectedTestCaseIds.includes(testCase._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTestCaseIds((prev) => [
                          ...prev,
                          testCase._id,
                        ]);
                      } else {
                        setSelectedTestCaseIds((prev) =>
                          prev.filter((id) => id !== testCase._id)
                        );
                      }
                    }}
                  />
                  <label htmlFor={testCase.id} className="flex-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <span>{testCase.testCaseId}</span>
                      <span className="font-normal">{testCase.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Priority: {testCase.priority} • Type: {testCase.type}
                    </div>
                  </label>
                </div>
              </>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddTestCasesDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTestCases}>
              Add Selected Test Cases
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Execution Dialog */}
      {selectedTestCase && (
        // <Dialog
        //   open={testExecutionDialogOpen}
        //   onOpenChange={setTestExecutionDialogOpen}
        // >
        //   <DialogContent className="sm:max-w-[700px]">
        //     <DialogHeader>
        //       <DialogTitle>Execute Test Case</DialogTitle>
        //     </DialogHeader>
        //     <div className="py-4">
        //       <TestExecutionForm
        //         testCase={selectedTestCase}
        //         onSubmit={handleTestSubmit}
        //         defaultValues={{
        //           status: selectedTestCase.status,
        //           actualResults: selectedTestCase.actualResults || "",
        //           notes: selectedTestCase.notes || "",
        //         }}
        //       />
        //     </div>
        //   </DialogContent>
        // </Dialog>

        <Dialog
          open={testExecutionDialogOpen}
          onOpenChange={setTestExecutionDialogOpen}
        >
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
            {/* Header (fixed) */}
            <DialogHeader className="shrink-0 border-b pb-2">
              <DialogTitle>Execute Test Case</DialogTitle>
            </DialogHeader>

            {/* Body (scrollable) */}
            <div className="flex-1 overflow-y-auto py-4">
              <TestExecutionForm
                testRunId={testRunId}
                testCase={selectedTestCase.testCaseId || selectedTestCase}
                onSubmit={handleTestSubmit}
                onSuccess={() => setTestExecutionDialogOpen(false)}
                defaultValues={{
                  status: selectedTestCase.status,
                  actualResults: selectedTestCase.actualResults || "",
                  notes: selectedTestCase.notes || "",
                }}
              />
            </div>

            {/* Footer (fixed)
    <div className="shrink-0 border-t pt-2 flex justify-end space-x-2">
      <button 
        className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80"
        onClick={() => setTestExecutionDialogOpen(false)}
      >
        Cancel
      </button>
      <button 
        type="submit" 
        form="test-execution-form" // id on your form
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
      >
        Execute
      </button>
    </div> */}
          </DialogContent>
        </Dialog>
      )}

      {/* Test Execution History Dialog */}
      {selectedTestCase && (
        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Test Execution History</DialogTitle>
              <DialogDescription>
                History of status changes for {selectedTestCase.title}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <TestExecutionHistory testCase={selectedTestCase} />
            </div>
            <DialogFooter>
              <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default TestRunDetail;
