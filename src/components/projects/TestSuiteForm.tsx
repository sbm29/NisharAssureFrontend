
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

const testSuiteSchema = z.object({
  name: z.string().min(3, { message: 'Test suite name must be at least 3 characters.' }),
  description: z.string().optional(),
});

type TestSuiteFormValues = z.infer<typeof testSuiteSchema>;

interface TestSuiteFormProps {
  moduleId: string;
  onSubmit: ( data: TestSuiteFormValues) => void;
  defaultValues?: Partial<TestSuiteFormValues>;
  isEditing?: boolean;
}

const TestSuiteForm: React.FC<TestSuiteFormProps> = ({
  moduleId,
  onSubmit,
  defaultValues,
  isEditing = false,
}) => {
  const { toast } = useToast();
  
  const form = useForm<TestSuiteFormValues>({
    resolver: zodResolver(testSuiteSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
    },
  });

  const handleSubmit = (values: TestSuiteFormValues) => {
    onSubmit(values);
     
    
    toast({
      title: `Test suite ${isEditing ? 'updated' : 'created'} successfully from test form `,
      description: `"${values.name}" has been ${isEditing ? 'updated' : 'created'}.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          <Button type="submit">
            {isEditing ? 'Update Test Suite' : 'Create Test Suite'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TestSuiteForm;
