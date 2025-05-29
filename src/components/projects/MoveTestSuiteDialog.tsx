
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Module, TestSuite } from '@/types/projectStructure';

interface MoveTestSuiteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  testSuite: TestSuite;
  modules: Module[];
  onMove: (testSuiteId: string, targetModuleId: string) => void;
  onCopy: (testSuiteId: string, targetModuleId: string) => void;
  isMove?: boolean;
}

const MoveTestSuiteDialog: React.FC<MoveTestSuiteDialogProps> = ({
  isOpen,
  onOpenChange,
  testSuite,
  modules,
  onMove,
  onCopy,
  isMove = true,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  
  const handleSubmit = () => {
    if (selectedModuleId) {
      if (isMove) {
        onMove(testSuite.id, selectedModuleId);
      } else {
        onCopy(testSuite.id, selectedModuleId);
      }
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isMove ? 'Move' : 'Copy'} Test Suite
          </DialogTitle>
          <DialogDescription>
            {isMove 
              ? 'Select the destination module to move this test suite to.' 
              : 'Select the destination module to copy this test suite to.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Module</Label>
            <Select 
              value={selectedModuleId} 
              onValueChange={setSelectedModuleId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a module" />
              </SelectTrigger>
              <SelectContent>
                {modules
                  .filter(module => module.id !== testSuite.moduleId)
                  .map(module => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedModuleId}
          >
            {isMove ? 'Move' : 'Copy'} Test Suite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveTestSuiteDialog;
