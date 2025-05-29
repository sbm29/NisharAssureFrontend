
import { Project } from '@/types/project';
import { TestCase, TestExecution } from '@/types/testCase';
import { Module, TestSuite } from '@/types/projectStructure';

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Website',
    description: 'Testing for the new e-commerce website with payment gateway integration.',
    status: 'Active',
    startDate: new Date('2024-03-01'),
    owner: {
      id: 'user1',
      name: 'John Doe',
    },
    progress: 65,
    testCaseCount: 48,
    passRate: 78,
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-22'),
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    description: 'End-to-end testing for the mobile banking application.',
    status: 'Active',
    startDate: new Date('2024-02-15'),
    owner: {
      id: 'user2',
      name: 'Jane Smith',
    },
    progress: 42,
    testCaseCount: 76,
    passRate: 62,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-04-18'),
  },
  {
    id: '3',
    name: 'CRM System Upgrade',
    description: 'Regression testing for the CRM system upgrade to version 4.0.',
    status: 'On Hold',
    startDate: new Date('2024-01-10'),
    owner: {
      id: 'user3',
      name: 'Mike Johnson',
    },
    progress: 28,
    testCaseCount: 32,
    passRate: 85,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-04-05'),
  },
  {
    id: '4',
    name: 'HR Portal',
    description: 'Functional testing for the new HR portal and employee self-service system.',
    status: 'Completed',
    startDate: new Date('2023-12-05'),
    endDate: new Date('2024-03-20'),
    owner: {
      id: 'user1',
      name: 'John Doe',
    },
    progress: 100,
    testCaseCount: 27,
    passRate: 92,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-28'),
  },
];

// Mock Modules
export const mockModules: Module[] = [
  {
    id: 'mod1',
    projectId: '1',
    name: 'Authentication',
    description: 'User authentication features',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-12'),
  },
  {
    id: 'mod2',
    projectId: '1',
    name: 'Payment Processing',
    description: 'Payment gateway and transaction features',
    createdAt: new Date('2024-04-11'),
    updatedAt: new Date('2024-04-14'),
  },
  {
    id: 'mod3',
    projectId: '2',
    name: 'User Account',
    description: 'User account management features',
    createdAt: new Date('2024-03-16'),
    updatedAt: new Date('2024-03-20'),
  }
];

// Mock Test Suites
export const mockTestSuites: TestSuite[] = [
  {
    id: 'ts1',
    moduleId: 'mod1',
    name: 'Registration Tests',
    description: 'Tests for user registration functionality',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-12'),
  },
  {
    id: 'ts2',
    moduleId: 'mod1',
    name: 'Login Tests',
    description: 'Tests for user login functionality',
    createdAt: new Date('2024-04-11'),
    updatedAt: new Date('2024-04-13'),
  },
  {
    id: 'ts3',
    moduleId: 'mod2',
    name: 'Credit Card Processing',
    description: 'Tests for credit card processing',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-04-15'),
  },
  {
    id: 'ts4',
    moduleId: 'mod3',
    name: 'Fund Transfer',
    description: 'Tests for fund transfer functionality',
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-20'),
  }
];

// Mock Test Cases
export const mockTestCases: TestCase[] = [
  {
    id: '1',
    projectId: '1',
    moduleId: '6831b41f21f4ab6e71e973e2',
    testSuiteId: '6831a74fab07630af59e66f8',
    title: 'User Registration Validation',
    description: 'Verify that the system validates user registration form fields correctly.',
    priority: 'High',
    type: 'Functional',
    preconditions: 'Registration page is accessible.',
    steps: '1. Navigate to Registration page\n2. Enter invalid email format\n3. Enter weak password\n4. Submit the form',
    expectedResults: 'System should display appropriate validation errors for email and password.',
    status: 'Passed',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-04-15'),
  },
  {
    id: '2',
    projectId: '1',
    moduleId: 'mod2',
    testSuiteId: 'ts3',
    title: 'Payment Processing',
    description: 'Verify that payment processing works correctly with valid credit card details.',
    priority: 'Critical',
    type: 'Functional',
    preconditions: 'User is logged in and has items in cart.',
    steps: '1. Proceed to checkout\n2. Fill in shipping information\n3. Enter valid credit card details\n4. Complete purchase',
    expectedResults: 'Order is processed successfully and confirmation is displayed.',
    status: 'Failed',
    createdAt: new Date('2024-04-14'),
    updatedAt: new Date('2024-04-16'),
  },
  {
    id: '3',
    projectId: '1',
    moduleId: 'mod1',
    testSuiteId: 'ts2',
    title: 'Search Functionality',
    description: 'Verify that product search returns relevant results.',
    priority: 'Medium',
    type: 'Functional',
    steps: '1. Navigate to the home page\n2. Enter a search term in the search box\n3. Submit the search',
    expectedResults: 'Relevant products should be displayed in the search results page.',
    status: 'Passed',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-04-13'),
  },
  {
    id: '4',
    projectId: '2',
    moduleId: 'mod3',
    testSuiteId: 'ts4',
    title: 'Fund Transfer Between Accounts',
    description: 'Verify that users can transfer funds between their own accounts.',
    priority: 'Critical',
    type: 'Functional',
    preconditions: 'User is logged in and has at least two accounts with sufficient funds.',
    steps: '1. Navigate to Transfer Funds section\n2. Select source account\n3. Select destination account\n4. Enter amount\n5. Confirm transfer',
    expectedResults: 'Transfer should complete successfully with updated balances showing.',
    status: 'Passed',
    createdAt: new Date('2024-03-16'),
    updatedAt: new Date('2024-03-20'),
  },
  {
    id: '5',
    projectId: '2',
    moduleId: 'mod3',
    testSuiteId: 'ts4',
    title: 'Login Security',
    description: 'Verify that the app locks after 3 failed login attempts.',
    priority: 'High',
    type: 'Security',
    steps: '1. Attempt to login with incorrect credentials 3 times',
    expectedResults: 'Account should be temporarily locked and a notification message displayed.',
    status: 'Pending',
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18'),
  },
];

// Mock Test Executions
export const mockTestExecutions: TestExecution[] = [
  {
    id: '1',
    testCaseId: '1',
    status: 'Passed',
    actualResults: 'System correctly displayed validation errors for invalid email format and weak password.',
    executedBy: 'John Doe',
    executedAt: new Date('2024-04-15'),
  },
  {
    id: '2',
    testCaseId: '2',
    status: 'Failed',
    actualResults: 'Payment processing failed with a gateway timeout error when using Visa card.',
    notes: 'Issue reported to development team. Tracking with bug ID: BUG-2345',
    executedBy: 'Jane Smith',
    executedAt: new Date('2024-04-16'),
  },
  {
    id: '3',
    testCaseId: '3',
    status: 'Passed',
    actualResults: 'Search returned relevant products as expected.',
    executedBy: 'John Doe',
    executedAt: new Date('2024-04-13'),
  },
  {
    id: '4',
    testCaseId: '4',
    status: 'Passed',
    actualResults: 'Fund transfer completed successfully and account balances were updated correctly.',
    executedBy: 'Mike Johnson',
    executedAt: new Date('2024-03-20'),
  },
];

// Dashboard Statistics
export const dashboardStats = {
  totalProjects: mockProjects.length,
  activeProjects: mockProjects.filter(p => p.status === 'Active').length,
  totalTestCases: mockTestCases.length,
  testCasesByStatus: [
    { name: 'Passed', value: 3, color: '#22c55e' },
    { name: 'Failed', value: 1, color: '#ef4444' },
    { name: 'Pending', value: 1, color: '#f59e0b' },
  ],
  testCasesByPriority: [
    { name: 'Critical', value: 2, color: '#dc2626' },
    { name: 'High', value: 2, color: '#f97316' },
    { name: 'Medium', value: 1, color: '#22d3ee' },
    { name: 'Low', value: 0, color: '#60a5fa' },
  ],
  recentActivity: [
    { 
      id: '1', 
      action: 'Test Execution', 
      description: 'Payment Processing test case failed', 
      user: 'Jane Smith', 
      timestamp: new Date('2024-04-16') 
    },
    { 
      id: '2', 
      action: 'Test Execution', 
      description: 'User Registration Validation test case passed', 
      user: 'John Doe', 
      timestamp: new Date('2024-04-15') 
    },
    { 
      id: '3', 
      action: 'New Test Case', 
      description: 'Added "Mobile Responsiveness" test case', 
      user: 'Mike Johnson', 
      timestamp: new Date('2024-04-14') 
    },
  ]
};
