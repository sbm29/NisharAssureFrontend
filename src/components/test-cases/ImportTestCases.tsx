
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Import } from 'lucide-react';
import { importTestCasesFromExcel, validateTestCase } from '@/utils/excelImport';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ImportTestCasesProps {
  projectId: string;
  moduleId: string;
  testSuiteId: string;
  onImportSuccess: () => void;
}

const ImportTestCases = ({ projectId, moduleId, testSuiteId, onImportSuccess }: ImportTestCasesProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setValidationErrors([]);
    setIsProcessing(true);

    try {
      console.log('Starting import of file:', file.name);
      const testCases = await importTestCasesFromExcel(file);
      const errors: string[] = [];
      
      testCases.forEach((testCase, index) => {
        const validationErrors = validateTestCase(testCase);
        if (validationErrors.length > 0) {
          errors.push(`Row ${index + 1}: ${validationErrors.join(', ')}`);
        }
      });

      if (errors.length > 0) {
        console.log('Validation errors found:', errors);
        setValidationErrors(errors);
        setIsProcessing(false);
        return;
      }

      // Add project, module and test suite IDs to each test case
      const enrichedTestCases = testCases.map(testCase => ({
        ...testCase,
        projectId,
        moduleId: testCase.moduleId || moduleId,
        testSuiteId: testCase.testSuiteId || testSuiteId
      }));

      console.log('Importing test cases:', enrichedTestCases);

      // Make API call to save test cases
      const response = await fetch('/api/test-cases/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testCases: enrichedTestCases }),
      });

      if (!response.ok) {
        throw new Error('Failed to import test cases');
      }

      toast({
        title: "Success",
        description: `Successfully imported ${testCases.length} test cases`,
      });

      onImportSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Failed to import test cases",
        variant: "destructive"
      });
    }

    setIsProcessing(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Import className="h-4 w-4 mr-2" />
          Import Test Cases
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Test Cases</DialogTitle>
          <DialogDescription>
            Upload an Excel (.xlsx) or CSV file with test case data
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            The Excel/CSV file should contain the following columns:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>title (required)</li>
              <li>description (required)</li>
              <li>priority</li>
              <li>type (required) - e.g., Functional, Integration, UI/UX, Performance, Security</li>
              <li>preconditions</li>
              <li>steps (required)</li>
              <li>expectedResults (required)</li>
              <li>moduleId (optional, will use selected module if not provided)</li>
              <li>testSuiteId (optional, will use selected test suite if not provided)</li>
            </ul>
          </div>
          
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              disabled={isProcessing}
            />
          </div>
          {isProcessing && (
            <div className="text-center text-sm text-muted-foreground">
              Processing your file...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTestCases;
