
/**
 * TestExecutionForm Component
 * 
 * Form for executing a test case and documenting results.
 * Allows users to set test status, document actual results, and add notes.
 * Used within the test execution workflow to record test outcomes.
 */

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { TestCase } from '@/types/testCase';
import { useExecuteTestCase } from '@/hooks/testruns/useExecuteTestCase';
import { useQueryClient } from '@tanstack/react-query';

// Define schema for form validation using Zod
const testExecutionSchema = z.object({
  status: z.enum(['Passed', 'Failed', 'Blocked', 'Rejected', 'Not Executed']),
  actualResults: z.string().min(5, { message: 'Please describe the actual results.' }),
  notes: z.string().optional(),
});

// Define type based on the schema
type TestExecutionFormValues = z.infer<typeof testExecutionSchema>;

// Component props interface
interface TestExecutionFormProps {
  testRunId?: string;
  testCase: TestCase;
  onSubmit: (data: TestExecutionFormValues) => void;
  defaultValues?: Partial<TestExecutionFormValues>;
  onSuccess: () => void;
}

/**
 * TestExecutionForm component renders a form for recording test execution results
 * Features:
 * - Setting test status (Passed, Failed, Blocked, Rejected, Not Executed)
 * - Documenting actual results
 * - Adding optional notes
 * - Form validation
 */
const TestExecutionForm: React.FC<TestExecutionFormProps> = ({
  testRunId,
  testCase,
  onSubmit,
  defaultValues,
  onSuccess
}) => {
  // Initialize toast for notifications
  const queryClient = useQueryClient();

  const { toast } = useToast();
  const { mutate, isPending } = useExecuteTestCase(testRunId);
  // Initialize form with React Hook Form and Zod validation
  const form = useForm<TestExecutionFormValues>({
    resolver: zodResolver(testExecutionSchema),
    defaultValues: {
      status: defaultValues?.status || 'Not Executed',
      actualResults: defaultValues?.actualResults || '',
      notes: defaultValues?.notes || '',
    },
  });

 console.log( "Test Case Data at Execution Form",testCase);

  // Handle form submission
  // const handleSubmit = (values: TestExecutionFormValues) => {
  //   onSubmit(values);
    
  //   // Show success notification
  //   toast({
  //     title: `Test case ${values.status.toLowerCase()}`,
  //     description: `Test case "${testCase.title}" has been marked as ${values.status.toLowerCase()}.`,
  //   });
  // };

const handleSubmit = (values: TestExecutionFormValues) => {
    mutate(
      {
        testRunId,
        testCaseId: testCase._id,
        status: values.status,
        actualResults: values.actualResults,
        notes: values.notes,
      },
      {
        onSuccess: () => {
          toast({
            title: `Test case ${values.status}`,
            description: `"${testCase.title}" marked as ${values.status}`,
          });
          // Refresh metrics immediately
          queryClient.invalidateQueries({ queryKey: ["testRunMetrics", testRunId] });
          onSuccess();
          //onclose?.(); // close dialog
        },
      }
    );
  };


  return (
    <div className="space-y-6">
      {/* Test case information card */}
      <Card>
        <CardHeader>
          <CardTitle>{testCase.title}</CardTitle>
          <CardDescription>{testCase.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display preconditions if available */}
          {testCase.preconditions && (
            <div>
              <h3 className="font-medium">Preconditions</h3>
              <p className="text-sm text-muted-foreground">{testCase.preconditions}</p>
            </div>
          )}
          
          {/* Display test steps */}
          <div>
            <h3 className="font-medium mb-2">Test Steps</h3>
            <div className="text-sm whitespace-pre-line bg-muted p-3 rounded-md">
              {testCase.steps}
            </div>
          </div>
          
          {/* Display expected results */}
          <div>
            <h3 className="font-medium mb-2">Expected Results</h3>
            <div className="text-sm whitespace-pre-line bg-muted p-3 rounded-md">
              {testCase.expectedResults}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      {/* Test execution form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Test result status dropdown */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Result</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Passed" className="text-green-600">Passed</SelectItem>
                    <SelectItem value="Failed" className="text-red-600">Failed</SelectItem>
                    <SelectItem value="Blocked" className="text-amber-600">Blocked</SelectItem>
                    <SelectItem value="Rejected" className="text-purple-600">Rejected</SelectItem>
                    <SelectItem value="Not Executed">Not Executed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Actual results textarea */}
          <FormField
            control={form.control}
            name="actualResults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Results</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what actually happened when executing the test" 
                    className="min-h-20"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Notes textarea (optional) */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any additional notes or observations" 
                    className="min-h-20"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Form action buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              Save Execution
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TestExecutionForm;
