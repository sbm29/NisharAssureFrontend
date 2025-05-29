
/**
 * Type Definitions for Test Case Management
 * 
 * This file defines the TypeScript interfaces for test cases and their execution.
 * These interfaces ensure type safety throughout the application when working with test data.
 */



// Main test case interface defining the structure of a test case

type testSuiteId =  {
    _id: string;
    name: string;
}

export interface TestCase {
  _id: string;
  testCaseId?: string;
  projectId: string;
  moduleId: string;
  testSuite: testSuiteId;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Functional' | 'Performance' | 'Security' | 'Usability' | 'Compatibility' | 'Other';
  preconditions?: string;
  steps: string;
  expectedResults: string;
  status?: 'Passed' | 'Failed' | 'Blocked' | 'Rejected' | 'Pending' | 'Not Executed';
  createdAt: Date;
  updatedAt: Date;
  // Optional fields for test execution data
  executedAt?: Date;
  executedBy?: string;
  actualResults?: string;
  notes?: string;
}

// Interface for a single execution record of a test case
export interface TestExecution {
  id: string;
  testCaseId: string;
  status: 'Passed' | 'Failed' | 'Blocked' | 'Rejected' | 'Not Executed';
  actualResults: string;
  notes?: string;
  executedBy: string;
  executedAt: Date;
}

// Interface for historical execution records of a test case
// Tracks changes in test case execution over time
export interface TestExecutionHistory {
  status: 'Passed' | 'Failed' | 'Blocked' | 'Rejected' | 'Not Executed';
  actualResults?: string;
  notes?: string;
  executedBy: string;
  executedAt: Date;
}

// Interface for test runs (test cycles)
export interface TestRun {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  status: 'In Progress' | 'Completed' | 'Cancelled';
  startDate: Date;
  endDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  testCases: TestRunTestCase[];
}

// Interface for test cases within a test run
export interface TestRunTestCase {
  testCaseId: string;
  status: 'Passed' | 'Failed' | 'Blocked' | 'Rejected' | 'Not Executed';
  executedBy?: string;
  executedAt?: Date;
  actualResults?: string;
  notes?: string;
  history: TestExecutionHistory[];
}
