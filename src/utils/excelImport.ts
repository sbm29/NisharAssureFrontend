
import * as XLSX from 'xlsx';
import { TestCase } from '@/types/testCase';

export const importTestCasesFromExcel = (file: File): Promise<Partial<TestCase>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        console.log('Imported Excel data:', jsonData);

        // Normalize column names and transform data
        const testCases = jsonData.map((row: any) => {
          // Create a normalized copy of the row with lowercase keys
          const normalizedRow: Record<string, any> = {};
          Object.keys(row).forEach(key => {
            normalizedRow[key.toLowerCase().trim()] = row[key];
          });

          return {
            title: normalizedRow.title || '',
            description: normalizedRow.description || '',
            priority: normalizedRow.priority || 'Medium',
            type: normalizedRow.type || '',
            preconditions: normalizedRow.preconditions || '',
            steps: normalizedRow.steps || '',
            expectedResults: normalizedRow.expectedresults || normalizedRow['expected results'] || '',
            status: normalizedRow.status || 'Draft',
            moduleId: normalizedRow.moduleid || normalizedRow['module id'] || '',
            testSuiteId: normalizedRow.testsuiteid || normalizedRow['test suite id'] || ''
          };
        });

        console.log('Normalized test cases:', testCases);
        resolve(testCases);
      } catch (error) {
        console.error('Excel import error:', error);
        reject(new Error('Failed to parse Excel file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
};

export const validateTestCase = (testCase: Partial<TestCase>): string[] => {
  const errors: string[] = [];
  const requiredFields = ['title', 'description', 'type', 'steps', 'expectedResults'];
  
  requiredFields.forEach(field => {
    if (!testCase[field as keyof Partial<TestCase>] || 
        (typeof testCase[field as keyof Partial<TestCase>] === 'string' && 
        (testCase[field as keyof Partial<TestCase>] as string).trim() === '')) {
      errors.push(`${field} is required`);
    }
  });

  return errors;
};
