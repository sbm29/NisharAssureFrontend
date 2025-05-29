
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import StatusChart from '@/components/dashboard/StatusChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardStats, mockProjects } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { CheckSquare, Folder, Calendar, BarChart } from 'lucide-react';

const Dashboard = () => {
  const { totalProjects, activeProjects, totalTestCases, testCasesByStatus, testCasesByPriority, recentActivity } = dashboardStats;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your testing projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Projects"
            value={totalProjects}
            icon={<Folder className="h-5 w-5" />}
          />
          <StatCard 
            title="Active Projects"
            value={activeProjects}
            icon={<Calendar className="h-5 w-5" />}
          />
          <StatCard 
            title="Total Test Cases"
            value={totalTestCases}
            icon={<CheckSquare className="h-5 w-5" />}
          />
          <StatCard 
            title="Average Pass Rate"
            value="78%"
            trend={{ value: 4, isPositive: true }}
            icon={<BarChart className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart 
            title="Test Case Status"
            data={testCasesByStatus}
          />
          <StatusChart 
            title="Test Case Priority"
            data={testCasesByPriority}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      item.action.includes('Failed') 
                        ? 'bg-red-500' 
                        : item.action === 'New Test Case' 
                        ? 'bg-blue-500' 
                        : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{item.description}</p>
                      <div className="flex text-xs text-muted-foreground mt-1">
                        <span>{item.user}</span>
                        <span className="mx-2">•</span>
                        <time>{item.timestamp.toLocaleDateString()}</time>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <Link to={`/projects/${project.id}`} className="text-sm font-medium hover:text-primary transition-colors">
                        {project.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {project.testCaseCount} test cases
                      </p>
                    </div>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted-foreground/10 text-xs font-medium">
                      {project.passRate}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
