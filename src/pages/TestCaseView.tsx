
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
//import { mockTestCases } from '@/data/mockData';
import TestCaseForm from '@/components/test-cases/TestCaseForm';
import { useTestCaseById } from '@/hooks/testcases/useTestCaseById';
import { useUpdateTestCase } from "@/hooks/testcases/useUpdateTestCase";
import { toast } from "@/components/ui/use-toast"

interface TestCaseViewProps {
  isEditing?: boolean;
}

const TestCaseView: React.FC<TestCaseViewProps> = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
 // const testCase = mockTestCases.find(tc => tc.id === id);

  const { data: testCase, isLoading, error } = useTestCaseById(id || '');
  console.log( "TestCaseVIEW",testCase);

  const { mutate: updateTestCase, isPending } = useUpdateTestCase();

  if (!testCase) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Test Case Not Found</h2>
          <Button onClick={() => navigate('/test-cases')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Test Cases
          </Button>
        </div>
      </MainLayout>
    );
  }

  // const handleUpdateTestCase = (data: any) => {
  //   console.log('Update test case:', data);
  //   navigate(`/test-cases/${id}`);
  // };


  // const handleUpdateTestCase = (data: any) => {
  //   if (!id) return;
  
  //   updateTestCase(
  //     { id, updatedData: data },
  //     {
  //       onSuccess: () => {
  //         toast({ title: "Test case updated successfully!" });
  //         navigate(`/test-cases/${id}`); // back to view mode
  //       },
  //       onError: (error: any) => {
  //         toast({
  //           title: "Update failed",
  //           description: error?.response?.data?.message || "Something went wrong.",
  //           variant: "destructive",
  //         });
  //       },
  //     }
  //   );
  // };
  const getPriorityBadge = (priority: string) => {
    const classes = {
      Low: 'bg-blue-50 text-blue-700 border-blue-200',
      Medium: 'bg-green-50 text-green-700 border-green-200',
      High: 'bg-amber-50 text-amber-700 border-amber-200',
      Critical: 'bg-red-50 text-red-700 border-red-200',
    }[priority] || 'bg-gray-50 text-gray-700 border-gray-200';

    return <Badge variant="outline" className={classes}>{priority}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const classes = {
      Functional: 'bg-purple-50 text-purple-700 border-purple-200',
      Performance: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Security: 'bg-rose-50 text-rose-700 border-rose-200',
      Usability: 'bg-teal-50 text-teal-700 border-teal-200',
      Compatibility: 'bg-sky-50 text-sky-700 border-sky-200',
    }[type] || 'bg-gray-50 text-gray-700 border-gray-200';

    return <Badge variant="secondary" className={classes}>{type}</Badge>;
  };

  // Convert testCase to the expected format for the form
  const formTestCase = {
    ...testCase,
    // Ensure type is one of the expected literals
    type: testCase.type as "Functional" | "Performance" | "Security" | "Usability" | "Compatibility" | "Other",
    // Ensure priority is one of the expected literals
    priority: testCase.priority as "Low" | "Medium" | "High" | "Critical"
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/test-cases')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Test Case' : 'Test Case Details'}
          </h1>
        </div>

        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit Test Case</CardTitle>
              <CardDescription>
                Make changes to your test case here.Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TestCaseForm
                //onSubmit={handleUpdateTestCase}
                _id={id}
                defaultValues={formTestCase}
                isEditing={true}
                projectId={testCase.project}
                testSuiteId={testCase.testSuite}
                moduleId={testCase.module}
                onSuccess={() => navigate(`/test-cases/${id}`)}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>{testCase.title}</CardTitle>
                <CardDescription>{testCase.description}</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate(`/test-cases/${id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                {getPriorityBadge(testCase.priority)}
                {getTypeBadge(testCase.type)}
              </div>

              <div className="space-y-4">
                {testCase.preconditions && (
                  <div>
                    <h3 className="font-medium mb-2">Preconditions</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {testCase.preconditions}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-2">Test Steps</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {testCase.steps}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Expected Results</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {testCase.expectedResults}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Last updated: {testCase.updatedAt ? new Date(testCase.updatedAt).toLocaleDateString() : 'N/A'}
            </CardFooter>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default TestCaseView;
