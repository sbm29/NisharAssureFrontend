
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, HelpCircle, Plus, Folder } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { TestCase } from '@/types/testCase';

interface ProjectExecutionProps {
  projectId?: string;
  testCases?: TestCase[];
  onNavigateToTestCases: () => void;
}

/**
 * ProjectExecution Component
 * 
 * Provides test execution functionality directly within the project view.
 * Allows users to:
 * 1. Create test runs
 * 2. Add test cases to runs
 * 3. Execute test cases and record results
 * 
 * @param {string} projectId - The ID of the current project
 * @param {TestCase[]} testCases - Available test cases in the project
 * @param {Function} onNavigateToTestCases - Function to navigate to test cases tab
 */
const ProjectExecution: React.FC<ProjectExecutionProps> = ({ 
  projectId, 
  testCases = [], 
  onNavigateToTestCases 
}) => {
  // State for managing test runs and UI
  const [testRuns, setTestRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [createRunOpen, setCreateRunOpen] = useState(false);
  const [newRunName, setNewRunName] = useState('');
  const [newRunDescription, setNewRunDescription] = useState('');
  const [addTestCasesOpen, setAddTestCasesOpen] = useState(false);
  const [selectedTestCasesToAdd, setSelectedTestCasesToAdd] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [testCaseExecutionOpen, setTestCaseExecutionOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  
  // Hook for showing toast notifications
  const { toast } = useToast();
  
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
      projectId: projectId,
      status: 'In Progress',
      startDate: new Date(),
      testCases: [], // Initially empty - no test cases added yet
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

  // Add selected test cases to the current test run
  const handleAddTestCasesToRun = () => {
    if (!selectedRun) {
      toast({
        title: "No Test Run Selected",
        description: "Please select or create a test run first.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTestCasesToAdd.length === 0) {
      toast({
        title: "No Test Cases Selected",
        description: "Please select at least one test case to add.",
        variant: "destructive"
      });
      return;
    }

    // Get the selected test cases
    const testCasesToAdd = testCases
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

  // Toggle test case selection for adding to test run
  const toggleTestCaseSelection = (testCaseId: string) => {
    if (selectedTestCasesToAdd.includes(testCaseId)) {
      setSelectedTestCasesToAdd(selectedTestCasesToAdd.filter(id => id !== testCaseId));
    } else {
      setSelectedTestCasesToAdd([...selectedTestCasesToAdd, testCaseId]);
    }
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
    setTestCaseExecutionOpen(false);
    
    // Show success notification
    toast({
      title: `Test Case ${values.status}`,
      description: "Test execution has been recorded successfully."
    });
  };

  // Remove a test case from the selected test run
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

  // Helper function to get status badge
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

  // Helper function to get status icon
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
        return null;
    }
  };

  // Open the test execution dialog
  const handleExecuteTestCase = (testCase: any) => {
    setSelectedTestCase(testCase);
    setTestCaseExecutionOpen(true);
  };

  // Get pending and completed test cases from the selected run
  const pendingTestCases = selectedRun
    ? selectedRun.testCases.filter((tc: any) => tc.status === 'Not Executed')
    : [];
  
  const completedTestCases = selectedRun
    ? selectedRun.testCases.filter((tc: any) => tc.status !== 'Not Executed')
    : [];

  // If we don't have a project ID yet, show a message
  if (!projectId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Execution</CardTitle>
          <CardDescription>
            Execute and track test runs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Select test cases to execute from the Test Cases tab
              </p>
              <Button onClick={onNavigateToTestCases}>
                Go to Test Cases
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Test Execution</CardTitle>
          <CardDescription>
            Create test runs and execute test cases
          </CardDescription>
        </div>
        <Button onClick={() => setCreateRunOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Test Run
        </Button>
      </CardHeader>
      <CardContent>
        {testRuns.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No test runs created yet. Create a new test run to start executing test cases.
              </p>
              <Button onClick={() => setCreateRunOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Test Run
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Test Runs List */}
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
            
            {/* Test Run Details */}
            {selectedRun && (
              <div className="mt-6 border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Test Run: {selectedRun.name}
                  </h3>
                  <Badge variant="outline">{selectedRun.status}</Badge>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
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
                      <div className="text-center py-8 bg-muted/30 rounded-md">
                        <p className="text-muted-foreground">
                          No pending test cases to execute. Add test cases to this run or switch to the Completed tab.
                        </p>
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
                      <div className="text-center py-8 bg-muted/30 rounded-md">
                        <p className="text-muted-foreground">
                          No completed test cases yet. Execute test cases to see them here.
                        </p>
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
              </div>
            )}
          </div>
        )}
      </CardContent>

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
                  {/* Organize by module and test suite */}
                  {testCases?.filter(tc => !selectedRun?.testCases.some((existingTc: any) => existingTc.id === tc.id))
                    .map(testCase => (
                      <div key={testCase.id} className="flex items-center space-x-2 py-2 border-b">
                        <input
                          type="checkbox"
                          id={`tc-${testCase.id}`}
                          checked={selectedTestCasesToAdd.includes(testCase.id)}
                          onChange={() => toggleTestCaseSelection(testCase.id)}
                          className="rounded border-gray-400"
                        />
                        <label htmlFor={`tc-${testCase.id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium">{testCase.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Priority: {testCase.priority} • Type: {testCase.type}
                          </div>
                        </label>
                      </div>
                    ))}
                  
                  {testCases.filter(tc => !selectedRun?.testCases.some((existingTc: any) => existingTc.id === tc.id)).length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        All available test cases have already been added to this run.
                      </p>
                    </div>
                  )}
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
                        const testCase = testCases.find(tc => tc.id === id);
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

      {/* Test Execution Dialog */}
      {selectedTestCase && (
        <Dialog open={testCaseExecutionOpen} onOpenChange={setTestCaseExecutionOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Execute Test Case</DialogTitle>
              <DialogDescription>
                {selectedTestCase.title}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {/* We'll use the existing TestExecutionForm component */}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default ProjectExecution;
