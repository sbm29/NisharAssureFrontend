
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
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
import { Project } from '@/types/project';
import { useToast } from '@/components/ui/use-toast';
import { BaseURL } from '@/lib/config';
import axios from 'axios';

const projectSchema = z.object({
  name: z.string().min(3, { message: 'Project name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  status: z.enum(['Active', 'On Hold', 'Completed', 'Planning']),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSubmit: (data: ProjectFormValues) => void;
  defaultValues?: Partial<ProjectFormValues>;
  isEditing?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  defaultValues,
  isEditing = false,
}) => {
  const { toast } = useToast();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      status: defaultValues?.status || 'Planning',
    },
  });

  const handleSubmit = async (values: ProjectFormValues) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token found');
      const response = await axios.post(`${BaseURL}/api/projects/createProject`, values,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }); // adjust the endpoint if needed
  
      toast({
        title: 'Project created successfully',
        //description: `"${response.data.name}" has been created.`,
      });
  
      // Optionally clear the form or trigger a callback
      form.reset(); // clear form after submission if needed
  
    } catch (error: any) {
      toast({
        title: 'Error creating project',
        description:
          error.response?.data?.message || 'Something went wrong while saving the project.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter project description" 
                  className="min-h-28"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
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
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">
            {isEditing ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
