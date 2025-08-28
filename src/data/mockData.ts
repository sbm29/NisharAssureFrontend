// mockData.ts

export const mockProjects = [
  {
    id: "proj1",
    name: "E-commerce Platform",
    description: "Handles online shopping and payment.",
    createdBy: "John Doe",
    createdAt: new Date("2023-10-01")
  },
  {
    id: "proj2",
    name: "CRM System",
    description: "Manages customer relationships and workflows.",
    createdBy: "Jane Smith",
    createdAt: new Date("2023-10-05")
  }
];

export const mockTestCases = [
  {
    id: "tc1",
    title: "Verify Login with Valid Credentials",
    description: "Ensure user can login with valid credentials",
    steps: "1. Navigate to login\n2. Enter credentials\n3. Submit",
    expectedResults: "User dashboard should load",
    priority: "High",
    type: "Functional",
    projectId: "proj1"
  },
  {
    id: "tc2",
    title: "Validate Signup Flow",
    description: "Test user registration with valid data",
    steps: "1. Go to signup\n2. Fill form\n3. Submit",
    expectedResults: "User account should be created",
    priority: "Medium",
    type: "Functional",
    projectId: "proj1"
  },
  {
    id: "tc3",
    title: "Add Product to Cart",
    description: "Check cart functionality for adding product",
    steps: "1. Browse product\n2. Click add to cart",
    expectedResults: "Product should be visible in cart",
    priority: "High",
    type: "Integration",
    projectId: "proj1"
  },
  {
    id: "tc4",
    title: "Verify Password Reset",
    description: "Ensure password reset via email works",
    steps: "1. Click forgot password\n2. Check email",
    expectedResults: "Password reset link should be sent",
    priority: "Low",
    type: "Security",
    projectId: "proj2"
  },
  {
    id: "tc5",
    title: "Create New Contact",
    description: "Validate new contact creation in CRM",
    steps: "1. Click Add Contact\n2. Fill form\n3. Submit",
    expectedResults: "Contact should be saved in list",
    priority: "Medium",
    type: "Functional",
    projectId: "proj2"
  }
];

export const mockTestRuns = [
  {
    id: "tr1",
    name: "Regression Test - v1.2",
    description: "Full regression test for version 1.2",
    projectId: "proj1",
    status: "In Progress",
    createdBy: "John Doe",
    createdAt: new Date("2023-11-15"),
    testCases: [
      {
        ...mockTestCases[0],
        status: "Not Executed",
        history: []
      },
      {
        ...mockTestCases[1],
        status: "Passed",
        executedBy: "Alice",
        executedAt: new Date("2023-11-16"),
        actualResults: "Dashboard loaded successfully",
        notes: "",
        history: []
      }
    ]
  },
  {
    id: "tr2",
    name: "Smoke Test - v1.3",
    description: "Quick smoke test for version 1.3",
    projectId: "proj2",
    status: "Completed",
    createdBy: "Jane Smith",
    createdAt: new Date("2023-11-10"),
    testCases: [
      {
        ...mockTestCases[3],
        status: "Failed",
        executedBy: "Bob",
        executedAt: new Date("2023-11-11"),
        actualResults: "Email not received",
        notes: "SMTP server was down",
        history: [
          {
            status: "Failed",
            actualResults: "No reset email received",
            notes: "Issue with SMTP",
            executedBy: "Bob",
            executedAt: new Date("2023-11-11")
          }
        ]
      }
    ]
  }
];
