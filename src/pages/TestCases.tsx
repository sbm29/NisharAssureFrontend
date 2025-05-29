
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import TestCaseList from '@/components/test-cases/TestCaseList';
import TestCaseForm from '@/components/test-cases/TestCaseForm';
import { TestCase } from '@/types/testCase';
import { mockTestCases, mockModules, mockTestSuites } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { Module, TestSuite } from '@/types/projectStructure';
import { useIsMobile } from '@/hooks/use-mobile';

const TestCases = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const isMobile = useIsMobile();
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [filteredTestCases, setFilteredTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    // In a real application, you would fetch test cases from your API
    // For now, we'll use mock data
    const filteredTestCases = mockTestCases.filter(tc => 
      !projectId || tc.projectId === projectId
    );
    
    setTestCases(filteredTestCases);
    setFilteredTestCases(filteredTestCases);
    setModules(mockModules);
    setTestSuites(mockTestSuites);
    setLoading(false);
  }, [projectId]);

  // Filter test cases based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTestCases(testCases);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = testCases.filter(testCase => 
      testCase.title.toLowerCase().includes(query) || 
      (testCase.testCaseId && testCase.testCaseId.toLowerCase().includes(query))
    );
    
    setFilteredTestCases(filtered);
  }, [searchQuery, testCases]);
  
  const handleCreateTestCase = (data: any) => {
    // Generate a unique test case ID
    const testCaseId = `TC-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`;
    
    const newTestCase: TestCase = {
      _id: `tc-${Date.now()}`,
      testCaseId: testCaseId,
      projectId: data.projectId,
      moduleId: data.moduleId || '',
      testSuiteId: data.testSuiteId || '',
      title: data.title,
      description: data.description,
      priority: data.priority,
      type: data.type,
      preconditions: data.preconditions,
      steps: data.steps,
      expectedResults: data.expectedResults,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedTestCases = [...testCases, newTestCase];
    setTestCases(updatedTestCases);
    setFilteredTestCases(updatedTestCases);
    setIsDialogOpen(false);
    
    toast({
      title: "Test Case Created",
      description: "Your test case has been created successfully.",
    });
  };
  
  const handleDeleteTestCase = (testCaseId: string) => {
    const updatedTestCases = testCases.filter(tc => tc._id !== testCaseId);
    setTestCases(updatedTestCases);
    setFilteredTestCases(updatedTestCases.filter(tc => 
      !searchQuery.trim() || tc.title.toLowerCase().includes(searchQuery.toLowerCase())
    ));
    
    toast({
      title: "Test Case Deleted",
      description: "Your test case has been deleted.",
    });
  };
  
  const handleExecuteTestCase = (testCaseId: string) => {
    console.log(`Execute test case with ID: ${testCaseId}`);
  };

  const handleMoveTestCase = (testCaseId: string, targetTestSuiteId: string) => {
    // Logic to move test case to a different test suite
    console.log(`Move test case ${testCaseId} to test suite ${targetTestSuiteId}`);
  };

  const handleCopyTestCase = (testCaseId: string, targetTestSuiteId: string) => {
    // Logic to copy test case to a different test suite
    console.log(`Copy test case ${testCaseId} to test suite ${targetTestSuiteId}`);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Test Cases</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Test Case
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Test Case</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <TestCaseForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle>All Test Cases</CardTitle>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search test cases..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-4 sm:flex">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="passed">Passed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {loading ? (
                  <div>Loading test cases...</div>
                ) : (
                  <TestCaseList 
                    testCases={filteredTestCases} 
                    modules={modules}
                    testSuites={testSuites}
                    onDelete={handleDeleteTestCase} 
                    onExecute={handleExecuteTestCase}
                    onMove={handleMoveTestCase}
                    onCopy={handleCopyTestCase}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="active">
                <TestCaseList 
                  testCases={filteredTestCases.filter(tc => !tc.status || tc.status === 'Not Executed')}
                  modules={modules}
                  testSuites={testSuites}
                  onDelete={handleDeleteTestCase} 
                  onExecute={handleExecuteTestCase}
                  onMove={handleMoveTestCase}
                  onCopy={handleCopyTestCase}
                />
              </TabsContent>
              
              <TabsContent value="passed">
                <TestCaseList 
                  testCases={filteredTestCases.filter(tc => tc.status === 'Passed')}
                  modules={modules}
                  testSuites={testSuites}
                  onDelete={handleDeleteTestCase} 
                  onExecute={handleExecuteTestCase}
                  onMove={handleMoveTestCase}
                  onCopy={handleCopyTestCase}
                />
              </TabsContent>
              
              <TabsContent value="failed">
                <TestCaseList 
                  testCases={filteredTestCases.filter(tc => tc.status === 'Failed')}
                  modules={modules}
                  testSuites={testSuites}
                  onDelete={handleDeleteTestCase} 
                  onExecute={handleExecuteTestCase}
                  onMove={handleMoveTestCase}
                  onCopy={handleCopyTestCase}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TestCases;
