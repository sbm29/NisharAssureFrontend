
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Module } from '@/types/projectStructure';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAddModule } from "@/hooks/modules/useAddModule";

const moduleSchema = z.object({
  name: z.string().min(3, { message: 'Module name must be at least 3 characters.' }),
  description: z.string().optional(),

});

type ModuleFormValues = z.infer<typeof moduleSchema> 


interface ModuleFormProps {
  projectId: string;
  defaultValues?: Omit<Partial<ModuleFormValues>, 'name'> & { name: string }; // Makes name required
  isEditing?: boolean;
  onSuccess?: (data: Module) => void;
}

const ModuleForm: React.FC<ModuleFormProps> = ({
  projectId,
  defaultValues,
  isEditing = false,
  onSuccess,
}) => {
  const { toast } = useToast();
  const addModuleMutation = useAddModule(projectId);

  const { mutate, isPending } = addModuleMutation;
  
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      
    },
  });

  // const handleSubmit = (values: ModuleFormValues) => {
  //   addModuleMutation.mutate({ name: values.name });
    
  //   toast({
  //     title: `Module ${isEditing ? 'updated' : 'created'} successfully`,
  //     description: `"${values.name}" has been ${isEditing ? 'updated' : 'created'}.`,
  //   });
  // };


  const onSubmit = (data: ModuleFormValues) => {
    if (!data.name) {
      toast({
        title: "Error",
        description: "Module name is required",
        variant: "destructive",
      });
      return;
    }
    mutate(
      { name: data.name,  // Explicitly pass required fields
        description: data.description,
        
        
     
         },
      {
        onSuccess: (data) => {
          console.log("Form submitted with:", data); // ✅ Add this
          form.reset();
          onSuccess?.(data);
          toast({
            title: `Module ${isEditing ? 'updated' : 'created'} successfully`,
            description: `"${data.name}" has been ${isEditing ? 'updated' : 'created'}.`,
          });
          
        },
      }
    );
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter module name" {...field} />
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
                  placeholder="Enter module description" 
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
            {isEditing ? 'Update Module' : 'Create Module'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ModuleForm;
