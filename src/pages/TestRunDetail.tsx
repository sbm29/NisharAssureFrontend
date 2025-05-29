
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckSquare, ArrowLeft, PlusCircle, Play, CheckCircle, XCircle, AlertTriangle, History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import TestExecutionForm from '@/components/test-execution/TestExecutionForm';
import TestExecutionHistory from '@/components/test-execution/TestExecutionHistory';
import { mockTestCases, mockProjects } from '@/data/mockData';

const TestRunDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [addTestCasesDialogOpen, setAddTestCasesDialogOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [testExecutionDialogOpen, setTestExecutionDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock test run data - in a real app, this would come from an API
  const testRun = {
    id: id || "tr1",
    name: "Regression Test - v1.2",
    description: "Full regression test for version 1.2",
    projectId: "proj1",
    projectName: "E-commerce Platform",
    status: "In Progress",
    testCasesCount: 45,
    executed: 20,
    passed: 15,
    failed: 5,
    blocked: 0,
    notExecuted: 25,
    passRate: 75,
    createdAt: new Date('2023-11-15'),
    createdBy: "John Doe"
  };

  // Mock test cases in this test run
  const testCasesInRun = mockTestCases
    .slice(0, 15)
    .map(tc => ({
      ...tc,
      status: ['Passed', 'Failed', 'Blocked', 'Not Executed'][Math.floor(Math.random() * 4)],
      executedBy: tc.status !== 'Not Executed' ? 'Jane Smith' : undefined,
      executedAt: tc.status !== 'Not Executed' ? new Date() : undefined,
      actualResults: tc.status !== 'Not Executed' ? 'Test execution results would go here.' : undefined,
      // Add mock history data
      history: tc.status !== 'Not Executed' ? [
        {
          status: 'Blocked',
          actualResults: 'Initial test execution was blocked due to environment issues.',
          notes: 'Need to fix the test environment before proceeding.',
          executedBy: 'John Doe',
          executedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          status: 'Failed',
          actualResults: 'Test execution failed due to validation error.',
          notes: 'The form validation is not working correctly.',
          executedBy: 'Jane Smith',
          executedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        }
      ] : []
    }));

  // Filter test cases based on status
  const notExecutedTestCases = testCasesInRun.filter(tc => tc.status === 'Not Executed');
  const executedTestCases = testCasesInRun.filter(tc => tc.status !== 'Not Executed');

  const handleAddTestCases = () => {
    toast({
      title: "Test Cases Added",
      description: "Selected test cases have been added to the test run.",
    });
    setAddTestCasesDialogOpen(false);
  };

  const handleExecuteTestCase = (testCase: any) => {
    setSelectedTestCase(testCase);
    setTestExecutionDialogOpen(true);
  };

  const handleShowHistory = (testCase: any) => {
    setSelectedTestCase(testCase);
    setHistoryDialogOpen(true);
  };

  const handleTestSubmit = (values: any) => {
    console.log('Test execution submitted:', values);
    toast({
      title: `Test case ${values.status.toLowerCase()}`,
      description: "Test case execution has been recorded.",
    });
    setTestExecutionDialogOpen(false);
  };

  const handleUpdateStatus = (status: string) => {
    toast({
      title: "Test Run Updated",
      description: `Test run status changed to ${status}.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Blocked':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Play className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Passed':
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'Blocked':
        return <Badge className="bg-amber-100 text-amber-800">Blocked</Badge>;
      case 'Not Executed':
        return <Badge className="bg-gray-100 text-gray-800">Not Executed</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'In Progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'Cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/test-runs">
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
            <p className="text-muted-foreground mt-1">{testRun.description}</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <Link to={`/projects/${testRun.projectId}`} className="text-primary hover:underline">
                {testRun.projectName}
              </Link>
              <span>•</span>
              <span>Created on {testRun.createdAt.toLocaleDateString()}</span>
              <span>•</span>
              <span>by {testRun.createdBy}</span>
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
            <Button variant="outline" onClick={() => setAddTestCasesDialogOpen(true)}>
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
                <div className="text-4xl font-bold">{testRun.passRate}%</div>
                <p className="text-muted-foreground mt-1">Pass Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{testRun.passed}</div>
                <p className="text-muted-foreground mt-1">Passed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{testRun.failed}</div>
                <p className="text-muted-foreground mt-1">Failed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">{testRun.blocked}</div>
                <p className="text-muted-foreground mt-1">Blocked</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Progress 
          value={testRun.passRate} 
          className="h-2" 
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <div>Executed: {testRun.executed}/{testRun.testCasesCount} test cases</div>
          <div>Remaining: {testRun.notExecuted} test cases</div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              Overview
            </TabsTrigger>
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
                <CardTitle>Test Run Summary</CardTitle>
                <CardDescription>
                  Overview of the test run execution status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Summary stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Total Test Cases</div>
                      <div className="text-2xl font-bold">{testRun.testCasesCount}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Executed</div>
                      <div className="text-2xl font-bold">{testRun.executed}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Completion</div>
                      <div className="text-2xl font-bold">
                        {Math.round((testRun.executed / testRun.testCasesCount) * 100)}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="text-2xl font-bold">2d 4h</div>
                    </div>
                  </div>

                  {/* Status distribution */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Status Distribution</h3>
                    <div className="h-80 bg-muted/20 rounded-md flex items-end justify-around p-4">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="bg-gray-200 h-[60%] w-16 rounded-t-md"></div>
                        <div>Not Executed</div>
                        <div className="text-sm text-muted-foreground">{testRun.notExecuted}</div>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="bg-green-200 h-[30%] w-16 rounded-t-md"></div>
                        <div>Passed</div>
                        <div className="text-sm text-muted-foreground">{testRun.passed}</div>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="bg-red-200 h-[10%] w-16 rounded-t-md"></div>
                        <div>Failed</div>
                        <div className="text-sm text-muted-foreground">{testRun.failed}</div>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="bg-yellow-200 h-[0%] w-16 rounded-t-md"></div>
                        <div>Blocked</div>
                        <div className="text-sm text-muted-foreground">{testRun.blocked}</div>
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
                    <h3 className="text-lg font-medium">All test cases executed</h3>
                    <p className="text-muted-foreground mt-1">There are no pending test cases in this run</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notExecutedTestCases.map((testCase) => (
                      <Card key={testCase.id} className="overflow-hidden">
                        <div className="p-4 border-b border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{testCase.title}</h3>
                              <div className="text-sm text-muted-foreground mt-1">
                                Priority: {testCase.priority} • Type: {testCase.type}
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
                    <h3 className="text-lg font-medium">No test cases executed yet</h3>
                    <p className="text-muted-foreground mt-1">Start executing test cases from the Pending tab</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('pending')}
                    >
                      Go to pending test cases
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {executedTestCases.map((testCase) => (
                      <Card key={testCase.id} className="overflow-hidden">
                        <div className="p-4 border-b border-border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="mr-3">
                                {getStatusIcon(testCase.status)}
                              </div>
                              <div>
                                <h3 className="font-medium">{testCase.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  {getStatusBadge(testCase.status)}
                                  <span>•</span>
                                  <span>Executed by {testCase.executedBy}</span>
                                  <span>•</span>
                                  <span>
                                    {testCase.executedAt?.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {testCase.history && testCase.history.length > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleShowHistory(testCase)}
                                >
                                  <History className="h-4 w-4 mr-2" />
                                  History ({testCase.history.length})
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleExecuteTestCase(testCase)}
                              >
                                <CheckSquare className="h-4 w-4 mr-2" />
                                Update
                              </Button>
                            </div>
                          </div>
                          {testCase.actualResults && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <h4 className="text-sm font-medium mb-1">Actual Results</h4>
                              <p className="text-sm text-muted-foreground">
                                {testCase.actualResults}
                              </p>
                              {testCase.notes && (
                                <div className="mt-2">
                                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {testCase.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Test Cases Dialog */}
      <Dialog open={addTestCasesDialogOpen} onOpenChange={setAddTestCasesDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add Test Cases to Test Run</DialogTitle>
            <DialogDescription>
              Select test cases to include in this test run.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {mockTestCases.slice(15, 25).map((testCase) => (
              <div key={testCase.id} className="flex items-center space-x-2 py-2 border-b">
                <input
                  type="checkbox"
                  id={testCase.id}
                  className="rounded border-gray-400"
                />
                <label htmlFor={testCase.id} className="flex-1">
                  <div className="font-medium">{testCase.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Priority: {testCase.priority} • Type: {testCase.type}
                  </div>
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTestCasesDialogOpen(false)}>
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
        <Dialog open={testExecutionDialogOpen} onOpenChange={setTestExecutionDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Execute Test Case</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <TestExecutionForm
                testCase={selectedTestCase}
                onSubmit={handleTestSubmit}
                defaultValues={{
                  status: selectedTestCase.status,
                  actualResults: selectedTestCase.actualResults || '',
                  notes: selectedTestCase.notes || '',
                }}
              />
            </div>
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
