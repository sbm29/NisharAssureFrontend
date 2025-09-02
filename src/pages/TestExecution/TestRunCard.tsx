// components/test-execution/TestRunCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface TestRunCardProps {
  testRun: {
    _id: string;
    name: string;
    description: string;
    status: string;
    passRate: number;
    projectName: string;
    projectId: string;
    createdAt: Date;
    createdBy: {
      _id: string;
      name: string;
    };
    passed: number;
    testCasesCount: number;
  };
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Completed":
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    case "In Progress":
      return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
    case "Cancelled":
      return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const TestRunCard: React.FC<TestRunCardProps> = ({ testRun }) => {
  console.log("TestRunCard Props:", testRun);

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{testRun.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{testRun.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          {getStatusBadge(testRun.status)}
          <div className="text-sm text-muted-foreground text-right">
            <div>
              {testRun?.createdAt
                ? new Date(testRun.createdAt).toLocaleDateString()
                : "Unknown"}
            </div>
            <div>by {testRun?.createdBy?.name || "Unknown"}</div>
          </div>
        </div>
        {/* <div className="flex items-center justify-between text-sm">
          <div>{testRun.projectName}</div>
          <div>
            {testRun.passRate}% • {testRun.passed}/{testRun.testCasesCount}
          </div>
        </div> */}
        <div className="text-right">
          <Link
            to={`/test-runs/${testRun._id}`}
            state={{ fromProjectId: testRun.projectId, fromTab: "execution" }}
          >
            <Button size="sm" variant="ghost">
              <ArrowRight className="w-4 h-4 mr-1" />
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestRunCard;
