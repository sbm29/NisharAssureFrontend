import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateTestRun } from '@/hooks/testruns/useCreateTestRun'; 

interface CreateTestRunDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const CreateTestRunDialog: React.FC<CreateTestRunDialogProps> = ({
  open,
  onOpenChange,
  projectId,
}) => {
  const { toast } = useToast();
  const [testRunName, setTestRunName] = useState('');
  const [testRunDescription, setTestRunDescription] = useState('');

  const createTestRun = useCreateTestRun(projectId);

  const handleCreate = () => {
    if (!testRunName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a name for the test run',
        variant: 'destructive',
      });
      return;
    }

    createTestRun.mutate(
      { name: testRunName.trim(), description: testRunDescription.trim() },
      {
        onSuccess: () => {
          toast({
            title: 'Test Run Created',
            description: `${testRunName} has been created successfully.`,
          });
          // Reset form and close modal
          setTestRunName('');
          setTestRunDescription('');
          onOpenChange(false);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to create test run. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Test Run</DialogTitle>
          <DialogDescription>
            Set up a new test execution run for your project.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Test Run Name</Label>
            <Input
              id="name"
              value={testRunName}
              onChange={(e) => setTestRunName(e.target.value)}
              placeholder="e.g. Sprint 10 Regression Test"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={testRunDescription}
              onChange={(e) => setTestRunDescription(e.target.value)}
              placeholder="Add any additional details about this test run"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={createTestRun.isPending}
          >
            {createTestRun.isPending ? 'Creating...' : 'Create Test Run'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTestRunDialog;
