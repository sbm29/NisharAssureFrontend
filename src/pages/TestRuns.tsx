
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Play, Check, AlertCircle, ArrowRight, Plus } from 'lucide-react';
import { mockProjects } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const TestRuns = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [testRunName, setTestRunName] = useState("");
  const [testRunDescription, setTestRunDescription] = useState("");
  const { toast } = useToast();

  // Mock test runs data
  const testRuns = [
    {
      id: "tr1",
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
      passRate: 75,
      createdAt: new Date('2023-11-15'),
      createdBy: "John Doe"
    },
    {
      id: "tr2",
      name: "Smoke Test - v1.3",
      description: "Quick smoke test for version 1.3",
      projectId: "proj2",
      projectName: "CRM System",
      status: "Completed",
      testCasesCount: 15,
      executed: 15,
      passed: 12,
      failed: 2,
      blocked: 1,
      passRate: 80,
      createdAt: new Date('2023-11-10'),
      createdBy: "Jane Smith"
    },
    {
      id: "tr3",
      name: "Security Test - v1.0",
      description: "Security validation for initial release",
      projectId: "proj1",
      projectName: "E-commerce Platform",
      status: "Completed",
      testCasesCount: 25,
      executed: 25,
      passed: 20,
      failed: 5,
      blocked: 0,
      passRate: 80,
      createdAt: new Date('2023-11-05'),
      createdBy: "John Doe"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  const handleCreateTestRun = () => {
    // Validation
    if (!selectedProject || !testRunName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here we would typically make an API call to create the test run
    console.log("Creating test run:", {
      name: testRunName,
      description: testRunDescription,
      projectId: selectedProject
    });

    // Show success message
    toast({
      title: "Test Run Created",
      description: `${testRunName} has been created successfully.`,
    });

    // Close modal and reset form
    setIsCreateModalOpen(false);
    setSelectedProject("");
    setTestRunName("");
    setTestRunDescription("");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Test Runs</h1>
            <p className="text-muted-foreground mt-1">Create and manage test executions</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Test Run
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Test Runs</CardTitle>
            <CardDescription>View and manage your test runs across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Pass Rate</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testRuns.map((testRun) => (
                  <TableRow key={testRun.id}>
                    <TableCell className="font-medium">
                      <div>
                        <span>{testRun.name}</span>
                        <p className="text-xs text-muted-foreground">{testRun.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{testRun.projectName}</TableCell>
                    <TableCell>{getStatusBadge(testRun.status)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{testRun.passRate}%</span>
                          <div className="text-xs text-muted-foreground">
                            {testRun.passed}/{testRun.testCasesCount}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {testRun.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{testRun.createdBy}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/test-runs/${testRun.id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Test Run Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Test Run</DialogTitle>
            <DialogDescription>
              Set up a new test execution run for your project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Test Run Name</Label>
              <Input
                id="name"
                value={testRunName}
                onChange={(e) => setTestRunName(e.target.value)}
                placeholder="e.g. Sprint 10 Regression Test"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={testRunDescription}
                onChange={(e) => setTestRunDescription(e.target.value)}
                placeholder="Add any additional details about this test run"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTestRun}>
              Create Test Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TestRuns;
