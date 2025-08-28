import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import StatusChart from "@/components/dashboard/StatusChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
//import { dashboardStats, mockProjects } from "@/data/mockData";
import { Link } from "react-router-dom";
import { CheckSquare, Folder, Calendar, BarChart } from "lucide-react";
import { useAllProjects } from "@/hooks/projects/useAllProjects";
import { Project } from "@/types/project";
import { useAllTestCases } from "@/hooks/testcases/useAllTestCases";
import { TestCase } from "@/types/testCase";

const Dashboard = () => {
  //const { testCasesByStatus, testCasesByPriority, recentActivity } = dashboardStats;

  const { data: project } = useAllProjects();
  const { data: testCases } = useAllTestCases();
  console.log("Projects", project);
  console.log("TestCases", testCases);

  const totalProjects = project?.length;
  const activeProjects = project?.filter(
    (p: Project) => p.status === "Active"
  ).length;
  //const totalTestCases = project?.filter((p: Project) => p.testCaseCount > 0).length;
  const totalTestCases: number = testCases?.length;
  const PassedTestCases: number = testCases?.filter(
    (tc: TestCase) => tc.status === "Passed"
  ).length;
  const FailedTestCases: number = testCases?.filter(
    (tc: TestCase) => tc.status === "Failed"
  ).length;
  const PendingTestCases: number = testCases?.filter(
    (tc: TestCase) => tc.status === "Pending"
  ).length;
  const testCasesByStatus = [
    { name: "Passed", value: PassedTestCases || 3, color: "#22c55e" },
    { name: "Failed", value: FailedTestCases || 1, color: "#ef4444" },
    { name: "Pending", value: PendingTestCases || 1, color: "#f59e0b" },
  ];

  const criticalTestCase: number = testCases?.filter(
    (tc: TestCase) => tc.priority === "Critical"
  ).length;
  const highTestCase: number = testCases?.filter(
    (tc: TestCase) => tc.priority === "High"
  ).length;
  const mediumTestCase: number = testCases?.filter(
    (tc: TestCase) => tc.priority === "Medium"
  ).length;
  const lowTestCase: number = testCases?.filter(
    (tc: TestCase) => tc.priority === "Low"
  ).length;

  const testCasesByPriority = [
    { name: "Critical", value: criticalTestCase, color: "#dc2626" },
    { name: "High", value: highTestCase, color: "#f97316" },
    { name: "Medium", value: mediumTestCase, color: "#22d3ee" },
    { name: "Low", value: lowTestCase, color: "#60a5fa" },
  ];
  const recentActivity = testCases?.map((tc: TestCase) => ({
    id: tc._id,
    description: tc.title,
    timestamp: tc.updatedAt,
    action: tc.status,
  }));

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your testing projects
          </p>
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
          <StatusChart title="Test Case Status" data={testCasesByStatus} />
          <StatusChart title="Test Case Priority" data={testCasesByPriority} />
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity
                  ?.slice(-5)
                  .reverse()
                  .map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div
                        className={`mt-1 w-2 h-2 rounded-full ${
                          item.action.includes("Failed")
                            ? "bg-red-500"
                            : item.action === "New Test Case"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {item.description}
                        </p>
                        <div className="flex text-xs text-muted-foreground mt-1">
                          <span>{item.user}</span>
                          <span className="mx-2">•</span>
                          <time>
                            {new Date(item.timestamp).toLocaleDateString()}
                          </time>
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
                {project?.slice(0, 3)?.map((project: Project) => {
                  console.log("Project recent activity", project);
                  console.log("TestCases recent activity", testCases);
                  const count = testCases?.filter(
                    (tc) => tc.project._id === project.id
                  ).length;

                  return (
                    <div
                      key={project.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          {project.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {count} test cases
                        </p>
                      </div>
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted-foreground/10 text-xs font-medium">
                        {project.latestRunPassRate}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
