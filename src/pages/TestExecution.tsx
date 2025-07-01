
/**
 * TestExecution Component
 * 
 * Main component for the test execution workflow.
 * Allows users to select a project, create test runs, add test cases,
 * and execute tests with status tracking and history.
 * 
 * This page serves as the primary interface for testers to perform their testing activities.
 */

import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects, mockTestCases, mockModules, mockTestSuites } from '@/data/mockData';
import { ArrowLeft, ArrowRight, Plus, Check, X, AlertTriangle, HelpCircle, Folder } from 'lucide-react';
import TestExecutionForm from '@/components/test-execution/TestExecutionForm';
import TestCaseSelectionTree from '@/components/test-execution/TestCaseSelectionTree';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAllProjects } from '@/hooks/projects/useAllProjects';
import { useAllTestCases } from '@/hooks/testcases/useAllTestCases';

/**
 * TestExecution component handles the workflow for executing test cases within test runs
 * Features include:
 * - Project selection
 * - Creating and managing test runs
 * - Adding test cases to runs
 * - Executing test cases and recording results
 * - Tracking execution history
 */
const TestExecution = () => {
  // Get route parameters and navigation
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  // State management for the component
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createRunOpen, setCreateRunOpen] = useState(false);
  const [newRunName, setNewRunName] = useState('');
  const [newRunDescription, setNewRunDescription] = useState('');
  const [testRuns, setTestRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [addTestCasesOpen, setAddTestCasesOpen] = useState(false);
  const [selectedTestCasesToAdd, setSelectedTestCasesToAdd] = useState<string[]>([]);
  const [testExecutionDialogOpen, setTestExecutionDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  
  // Initialize toast for notifications
  const { toast } = useToast();

  const { data: project } = useAllProjects();
  const { data: testCases } = useAllTestCases();

  console.log("Projects at execution page",project);
  console.log("TestCases at execution page",testCases);

  // Get project modules and test suites if a project is selected
  const modules = id ? project?.filter((m: any) => m.projectId === id) : [];
  const testSuites = testCases?.filter((ts: any) => ts.projectId === id);
  
  // If there's no ID, show a project selection screen
  if (!id) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Test Execution</h1>
            <p className="text-muted-foreground mt-1">Execute and track test cases</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select a Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project?.map((project) => {
                   const count = testCases.filter((tc: any) => tc.project.id === project.id).length;
                   return (
                    <div key={project.id} className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{count} test cases</p>
                      </div>
                      <Link to={`/test-execution/${project.id}`}>
                        <Button>Execute Tests</Button>
                      </Link>
                    </div>
                  )

                } )}
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // If ID is provided, show the test execution screen for that project
  const projectwithId = project?.find((p: any) => p.id === id);
  const projectTestCases = testCases?.filter((tc: any) => tc.project.id === id);

  // Handle project not found
  if (!projectwithId) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/test-execution">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Test Execution
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Create a new test run
  const handleCreateRun = () => {
    if (newRunName.trim() === '') {
      toast({
        title: "Name Required",
        description: "Please provide a name for the test run.",
        variant: "destructive"
      });
      return;
    }

    // Generate a unique ID for the new test run
    const newRunId = `run-${Date.now()}`;
    
    // Create the new test run object
    const newRun = {
      id: newRunId,
      name: newRunName,
      description: newRunDescription,
      projectId: id,
      status: 'In Progress',
      startDate: new Date(),
      testCases: [],
      createdBy: 'Current User',
      createdAt: new Date()
    };
    
    // Add the new run to our state
    setTestRuns([...testRuns, newRun]);
    setSelectedRun(newRun);
    
    // Reset form and close dialog
    setNewRunName('');
    setNewRunDescription('');
    setCreateRunOpen(false);
    
    // Show success notification
    toast({
      title: "Test Run Created",
      description: `Test run "${newRunName}" has been created successfully.`
    });
  };

  // Toggle test case selection for adding to test run
  const toggleTestCaseSelection = (testCaseId: string) => {
    if (selectedTestCasesToAdd.includes(testCaseId)) {
      setSelectedTestCasesToAdd(selectedTestCasesToAdd.filter(id => id !== testCaseId));
    } else {
      setSelectedTestCasesToAdd([...selectedTestCasesToAdd, testCaseId]);
    }
  };

  // Add selected test cases to the current test run
  const handleAddTestCasesToRun = () => {
    if (selectedTestCasesToAdd.length === 0) {
      toast({
        title: "No Test Cases Selected",
        description: "Please select at least one test case to add.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedRun) {
      toast({
        title: "No Test Run Selected",
        description: "Please select or create a test run first.",
        variant: "destructive"
      });
      return;
    }

    // Get the selected test cases from the project test cases
    const testCasesToAdd = projectTestCases
      .filter(tc => selectedTestCasesToAdd.includes(tc.id))
      .map(tc => ({
        ...tc,
        status: 'Not Executed',
        history: []
      }));

    // Update the selected run with the new test cases
    const updatedRun = {
      ...selectedRun,
      testCases: [...selectedRun.testCases, ...testCasesToAdd]
    };

    // Update the test runs state
    setTestRuns(testRuns.map(run => run.id === selectedRun.id ? updatedRun : run));
    setSelectedRun(updatedRun);
    
    // Reset selection and close dialog
    setSelectedTestCasesToAdd([]);
    setAddTestCasesOpen(false);
    
    // Show success notification
    toast({
      title: "Test Cases Added",
      description: `${testCasesToAdd.length} test cases added to the test run.`
    });
  };

  // Handle submitting test execution results
  const handleSubmitExecution = (values: any) => {
    if (!selectedRun || !selectedTestCase) return;
    
    // Create execution history entry if this test case has been executed before
    let updatedHistory = [...selectedTestCase.history || []];
    
    if (selectedTestCase.status !== 'Not Executed') {
      // Add previous execution to history
      updatedHistory.push({
        status: selectedTestCase.status,
        actualResults: selectedTestCase.actualResults || '',
        notes: selectedTestCase.notes || '',
        executedBy: 'Current User',
        executedAt: new Date()
      });
    }
    
    // Update the test case with new execution data
    const updatedTestCase = {
      ...selectedTestCase,
      status: values.status,
      actualResults: values.actualResults,
      notes: values.notes,
      executedBy: 'Current User',
      executedAt: new Date(),
      history: updatedHistory
    };
    
    // Update the test run with the updated test case
    const updatedTestCases = selectedRun.testCases.map((tc: any) => 
      tc.id === selectedTestCase.id ? updatedTestCase : tc
    );
    
    const updatedRun = {
      ...selectedRun,
      testCases: updatedTestCases
    };
    
    // Update state
    setTestRuns(testRuns.map(run => run.id === selectedRun.id ? updatedRun : run));
    setSelectedRun(updatedRun);
    setTestExecutionDialogOpen(false);
    
    // Show success notification
    toast({
      title: `Test Case ${values.status}`,
      description: "Test execution has been recorded successfully."
    });
  };

  // Open the test execution dialog
  const handleExecuteTestCase = (testCase: any) => {
    setSelectedTestCase(testCase);
    setTestExecutionDialogOpen(true);
  };

  // Open the test execution history dialog
  const handleViewHistory = (testCase: any) => {
    setSelectedTestCase(testCase);
    setHistoryDialogOpen(true);
  };
  
  // Open the test case details dialog
  const handleViewDetails = (testCase: any) => {
    setSelectedTestCase(testCase);
    setDetailsOpen(true);
  };

  // Remove a test case from a test run
  const handleRemoveTestCase = (testCaseId: string) => {
    if (!selectedRun) return;
    
    // Filter out the test case to be removed
    const updatedTestCases = selectedRun.testCases.filter((tc: any) => tc.id !== testCaseId);
    
    // Update the test run
    const updatedRun = {
      ...selectedRun,
      testCases: updatedTestCases
    };
    
    // Update state
    setTestRuns(testRuns.map(run => run.id === selectedRun.id ? updatedRun : run));
    setSelectedRun(updatedRun);
    
    // Show notification
    toast({
      title: "Test Case Removed",
      description: "Test case has been removed from the test run."
    });
  };

  // Helper function to get the status icon based on status
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Passed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'Failed':
        return <X className="h-4 w-4 text-red-500" />;
      case 'Blocked':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'Rejected':
        return <HelpCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <ArrowRight className="h-4 w-4 text-gray-500" />;
    }
  };

  // Helper function to get the status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Passed':
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'Blocked':
        return <Badge className="bg-amber-100 text-amber-800">Blocked</Badge>;
      case 'Rejected':
        return <Badge className="bg-purple-100 text-purple-800">Rejected</Badge>;
      case 'Not Executed':
        return <Badge className="bg-gray-100 text-gray-800">Not Executed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get pending and completed test cases if a run is selected
  const pendingTestCases = selectedRun
    ? selectedRun.testCases.filter((tc: any) => tc.status === 'Not Executed')
    : [];
  
  const completedTestCases = selectedRun
    ? selectedRun.testCases.filter((tc: any) => tc.status !== 'Not Executed')
    : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/test-execution">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Test Execution
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{project.name} - Test Execution</h1>
            <p className="text-muted-foreground mt-1">Execute test cases for this project</p>
          </div>
          
          <Button onClick={() => setCreateRunOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Test Run
          </Button>
        </div>

        {/* Test Runs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Test Runs</CardTitle>
          </CardHeader>
          <CardContent>
            {testRuns.length === 0 ? (
              <div className="text-center py-8">
                <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">No Test Runs Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create a test run to organize and execute your test cases
                </p>
                <Button onClick={() => setCreateRunOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test Run
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {testRuns.map(run => (
                  <Card 
                    key={run.id} 
                    className={`overflow-hidden cursor-pointer hover:border-primary/50 transition-all ${selectedRun?.id === run.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedRun(run)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{run.name}</CardTitle>
                      <CardDescription>
                        {run.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Badge variant="outline">{run.status}</Badge>
                        <span>•</span>
                        <span>{run.testCases.length} test cases</span>
                        <span>•</span>
                        <span>Started {new Date(run.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 mt-3 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRun(run);
                            setAddTestCasesOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Test Cases
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedRun && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Test Run: {selectedRun.name}
              </h2>
              <Badge variant="outline">{selectedRun.status}</Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="pending" className="relative">
                  Pending Execution
                  {pendingTestCases.length > 0 && (
                    <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs py-0.5 px-2">
                      {pendingTestCases.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                  {completedTestCases.length > 0 && (
                    <span className="ml-2 rounded-full bg-muted text-muted-foreground text-xs py-0.5 px-2">
                      {completedTestCases.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                {pendingTestCases.length === 0 ? (
                  <div className="bg-muted/40 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium">No pending test cases</h3>
                    <p className="text-muted-foreground mt-1">All test cases have been executed</p>
                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab('completed')}>
                      View Completed Tests
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Test Case</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingTestCases.map((testCase: any) => (
                        <TableRow key={testCase.id}>
                          <TableCell className="font-medium">{testCase.title}</TableCell>
                          <TableCell>{testCase.priority}</TableCell>
                          <TableCell>{testCase.type}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleExecuteTestCase(testCase)}
                              >
                                Execute
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveTestCase(testCase.id);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {completedTestCases.length === 0 ? (
                  <div className="bg-muted/40 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium">No completed test cases</h3>
                    <p className="text-muted-foreground mt-1">Execute test cases to see them here</p>
                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab('pending')}>
                      Go to Pending Tests
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Test Case</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Executed At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedTestCases.map((testCase: any) => (
                        <TableRow key={testCase.id}>
                          <TableCell className="font-medium">{testCase.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(testCase.status)}
                              {getStatusBadge(testCase.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {testCase.executedAt ? new Date(testCase.executedAt).toLocaleString() : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {(testCase.history && testCase.history.length > 0) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewHistory(testCase)}
                                >
                                  History ({testCase.history.length})
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                onClick={() => handleExecuteTestCase(testCase)}
                              >
                                Update
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveTestCase(testCase.id);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Create Test Run Dialog */}
      <Dialog open={createRunOpen} onOpenChange={setCreateRunOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Test Run</DialogTitle>
            <DialogDescription>
              Test runs help you organize and execute test cases as a batch
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Test Run Name*</Label>
              <Input
                id="name"
                placeholder="e.g., Sprint 23 Regression"
                value={newRunName}
                onChange={(e) => setNewRunName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add details about the purpose of this test run"
                value={newRunDescription}
                onChange={(e) => setNewRunDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateRunOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRun}>
              Create Test Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Test Cases Dialog with Project Structure Tree */}
      <Dialog open={addTestCasesOpen} onOpenChange={setAddTestCasesOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Test Cases to Test Run</DialogTitle>
            <DialogDescription>
              Select test cases to add to "{selectedRun?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden mt-4 h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Left Column: Available test cases in project structure */}
              <div className="border rounded-md overflow-auto h-full">
                <div className="p-3 border-b bg-muted/30">
                  <h3 className="font-medium">Available Test Cases</h3>
                </div>
                <div className="p-2 overflow-auto max-h-[calc(60vh-3rem)]">
                  <TestCaseSelectionTree
                    projectId={id}
                    modules={modules}
                    testSuites={testSuites}
                    testCases={projectTestCases}
                    selectedTestCases={selectedTestCasesToAdd}
                    onToggleSelection={toggleTestCaseSelection}
                    excludeIds={selectedRun ? selectedRun.testCases.map((tc: any) => tc.id) : []}
                  />
                </div>
              </div>
              
              {/* Right Column: Selected test cases */}
              <div className="border rounded-md overflow-auto h-full">
                <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
                  <h3 className="font-medium">Selected Test Cases ({selectedTestCasesToAdd.length})</h3>
                </div>
                <div className="p-2 overflow-auto max-h-[calc(60vh-3rem)]">
                  {selectedTestCasesToAdd.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No test cases selected. Select test cases from the left panel.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {selectedTestCasesToAdd.map(id => {
                        const testCase = projectTestCases.find(tc => tc.id === id);
                        return testCase ? (
                          <div key={`selected-${id}`} className="flex items-center justify-between p-2 border-b">
                            <div>
                              <div className="font-medium">{testCase.title}</div>
                              <div className="text-sm text-muted-foreground">
                                Priority: {testCase.priority} • Type: {testCase.type}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleTestCaseSelection(id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setAddTestCasesOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddTestCasesToRun}
              disabled={selectedTestCasesToAdd.length === 0}
            >
              Add {selectedTestCasesToAdd.length} Test Case{selectedTestCasesToAdd.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Execution Form Dialog */}
      {selectedTestCase && (
        <Dialog open={testExecutionDialogOpen} onOpenChange={setTestExecutionDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Execute Test Case</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <TestExecutionForm
                testCase={selectedTestCase}
                onSubmit={handleSubmitExecution}
                defaultValues={{
                  status: selectedTestCase.status || 'Not Executed',
                  actualResults: selectedTestCase.actualResults || '',
                  notes: selectedTestCase.notes || '',
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Test Case Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Test Execution Details</DialogTitle>
          </DialogHeader>
          {selectedTestCase && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedTestCase.title}</h2>
                {getStatusBadge(selectedTestCase.status || 'Not Executed')}
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                  <p>{selectedTestCase.priority}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                  <p>{selectedTestCase.type}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-sm">{selectedTestCase.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Steps</h3>
                <div className="text-sm whitespace-pre-line bg-muted/40 p-3 rounded-md">
                  {selectedTestCase.steps}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Expected Results</h3>
                  <div className="text-sm whitespace-pre-line bg-muted/40 p-3 rounded-md">
                    {selectedTestCase.expectedResults}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Actual Results</h3>
                  <div className="text-sm whitespace-pre-line bg-muted/40 p-3 rounded-md">
                    {selectedTestCase.actualResults || "No results recorded"}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
                <Button onClick={() => navigate(`/test-cases/${selectedTestCase.id}`)}>
                  View Test Case
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Test Execution History Dialog */}
      {selectedTestCase && (
        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Test Execution History</DialogTitle>
              <DialogDescription>
                History of execution status changes for {selectedTestCase.title}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {/* Current Execution Status */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Current Status</h3>
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(selectedTestCase.status)}
                    <span className="text-sm text-muted-foreground">
                      {selectedTestCase.executedAt ? new Date(selectedTestCase.executedAt).toLocaleString() : ''}
                    </span>
                  </div>
                  {selectedTestCase.actualResults && (
                    <div className="mb-2">
                      <h4 className="text-xs font-medium">Actual Results</h4>
                      <p className="text-sm">{selectedTestCase.actualResults}</p>
                    </div>
                  )}
                  {selectedTestCase.notes && (
                    <div>
                      <h4 className="text-xs font-medium">Notes</h4>
                      <p className="text-sm">{selectedTestCase.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Historical Execution Records */}
              {selectedTestCase.history && selectedTestCase.history.length > 0 ? (
                <>
                  <h3 className="text-sm font-medium mb-2">Previous Executions</h3>
                  <div className="space-y-3">
                    {selectedTestCase.history.map((historyItem: any, index: number) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(historyItem.status)}
                          <span className="text-sm text-muted-foreground">
                            {historyItem.executedAt ? new Date(historyItem.executedAt).toLocaleString() : ''}
                          </span>
                        </div>
                        {historyItem.actualResults && (
                          <div className="mb-2">
                            <h4 className="text-xs font-medium">Actual Results</h4>
                            <p className="text-sm">{historyItem.actualResults}</p>
                          </div>
                        )}
                        {historyItem.notes && (
                          <div>
                            <h4 className="text-xs font-medium">Notes</h4>
                            <p className="text-sm">{historyItem.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No previous execution history available.</p>
              )}
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

export default TestExecution;
