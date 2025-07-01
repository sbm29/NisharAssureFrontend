
/**
 * ProjectDashboard Component
 * 
 * Displays project-specific metrics and visualizations:
 * - Test case status distribution
 * - Test execution progress 
 * - Quality metrics over time
 * - Recent activity
 * 
 * Provides stakeholders with a quick overview of project testing status.
 */

import React, { useState, useEffect } from 'react';
import { TestCase } from '@/types/testCase';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
//import { mockProjects, mockTestCases } from '@/data/mockData';
import { useAllProjects } from '@/hooks/projects/useAllProjects';
import { useAllTestCases } from '@/hooks/testcases/useAllTestCases';

// Component for displaying project-specific dashboard with metrics and charts
const ProjectDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: project } = useAllProjects();
  const { data: testCases } = useAllTestCases();
  
  // Find the current project from mock data (in real app, would fetch from API)
  //const project = mockProjects.find(p => p.id === id);
  
  // Get test cases for this project (in real app, would fetch from API)
  //const projectTestCases = project?.filter((tc: TestCase) => tc.project === id);
  
  // Calculate metrics for test case status
  const totalTestCases = testCases?.length;
  const passedTestCases = testCases?.filter(tc => tc.status === 'Passed').length;
  const failedTestCases = testCases?.filter(tc => tc.status === 'Failed').length;
  const blockedTestCases = testCases?.filter(tc => tc.status === 'Blocked').length;
  const pendingTestCases = totalTestCases - passedTestCases - failedTestCases - blockedTestCases;
  
  // Calculate pass rate percentage for metrics
  const passRate = totalTestCases > 0 ? Math.round((passedTestCases / totalTestCases) * 100) : 0;
  
  // Prepare data for the status distribution chart
  const statusData = [
    { name: 'Passed', value: passedTestCases, color: '#4ade80' },
    { name: 'Failed', value: failedTestCases, color: '#f87171' },
    { name: 'Blocked', value: blockedTestCases, color: '#fbbf24' },
    { name: 'Pending', value: pendingTestCases, color: '#94a3b8' }
  ];
  
  // Prepare data for the weekly execution chart
  const weeklyData = [
    { name: 'Week 1', passed: 12, failed: 4, blocked: 2 },
    { name: 'Week 2', passed: 18, failed: 3, blocked: 1 },
    { name: 'Week 3', passed: 24, failed: 8, blocked: 3 },
    { name: 'Week 4', passed: 32, failed: 5, blocked: 2 }
  ];
  
  // Prepare data for progress by module chart
  const moduleProgressData = [
    { name: 'Authentication', completed: 85 },
    { name: 'User Management', completed: 65 },
    { name: 'Reports', completed: 45 },
    { name: 'Settings', completed: 90 }
  ];
  
  // Redirect if project not found
  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild>
            <a href="/projects">Return to Projects</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name} Dashboard</h1>
          <p className="text-muted-foreground mt-1">Project quality metrics and status overview</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Test Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalTestCases}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{passRate}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Open Defects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-500">8</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Last Execution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                      <span>2 days ago</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Status Distribution</CardTitle>
                  <CardDescription>Current status of all test cases in this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="execution" className="space-y-6">
              {/* Weekly Test Execution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Test Execution</CardTitle>
                  <CardDescription>Test execution results over the past 4 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData} barSize={30}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="passed" name="Passed" fill="#4ade80" />
                        <Bar dataKey="failed" name="Failed" fill="#f87171" />
                        <Bar dataKey="blocked" name="Blocked" fill="#fbbf24" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Test Progress by Module */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Progress by Module</CardTitle>
                  <CardDescription>Completion percentage across project modules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {moduleProgressData.map((module, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{module.name}</span>
                          <span className="text-muted-foreground">{module.completed}%</span>
                        </div>
                        <Progress value={module.completed} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quality" className="space-y-6">
              {/* Bug Severity Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Bug Severity Distribution</CardTitle>
                  <CardDescription>Distribution of bugs by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Critical', value: 3, color: '#ef4444' },
                            { name: 'High', value: 5, color: '#f97316' },
                            { name: 'Medium', value: 8, color: '#eab308' },
                            { name: 'Low', value: 12, color: '#84cc16' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates in the project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-start gap-4 pb-4 border-b">
                        <div className="mt-1">
                          {item % 3 === 0 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : item % 3 === 1 ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {item % 3 === 0
                              ? 'Test Case Passed'
                              : item % 3 === 1
                              ? 'Bug Reported'
                              : 'Test Blocked'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item % 3 === 0
                              ? 'User login test passed after fixing authentication issue'
                              : item % 3 === 1
                              ? 'Form submission fails when special characters are used'
                              : 'API integration tests blocked due to server issues'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item} hour{item !== 1 ? 's' : ''} ago by Jane Smith
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProjectDashboard;
