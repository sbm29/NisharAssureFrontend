import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {useCreateTestSuite}  from '@/hooks/testsuites/useCreateTestSuite';
import { TestSuite } from '@/types/projectStructure'; // Optional: If defined

const testSuiteSchema = z.object({
  name: z.string().min(3, { message: 'Test suite name must be at least 3 characters.' }),
  description: z.string().optional(),
});

type TestSuiteFormValues = z.infer<typeof testSuiteSchema>;

interface TestSuiteFormProps {
  moduleId: string;
  projectId: string;
  defaultValues?: Partial<TestSuiteFormValues>;
  isEditing?: boolean;
  onSuccess?: (data: TestSuite) => void;
}

const TestSuiteForm: React.FC<TestSuiteFormProps> = ({
  moduleId,
  projectId,
  defaultValues,
  isEditing = false,
  onSuccess,
}) => {
  const { toast } = useToast();
  const createTestSuite = useCreateTestSuite();

  const form = useForm<TestSuiteFormValues>({
    resolver: zodResolver(testSuiteSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
    },
  });

 console.log('props value', projectId );

  const onSubmit = (data: TestSuiteFormValues) => {

    
    if (!data.name) {
      toast({
        title: 'Error',
        description: 'Test suite name is required',
        variant: 'destructive',
      });
      return;
    }

    createTestSuite.mutate(
      {
        module: moduleId,
        project: projectId,
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: (result) => {
          form.reset();
          toast({
            title: `Test suite ${isEditing ? 'updated' : 'created'} successfully`,
            description: `"${result.name}" has been ${isEditing ? 'updated' : 'created'}.`,
          });
          onSuccess?.(result);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Suite Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter test suite name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter test suite description"
                  className="min-h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={createTestSuite.isPending}>
            {isEditing ? 'Update Test Suite' : 'Create Test Suite'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TestSuiteForm;
