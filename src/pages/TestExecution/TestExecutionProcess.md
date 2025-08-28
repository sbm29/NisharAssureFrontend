## **Feature Overview: Test Execution Module**

This module allows users to:

* View all test runs under a project
* Create a new test run
* View detailed stats and test cases for a selected test run
* Execute or update test cases
* Track execution history

- - -

## 📁 **Key Components and Flow**

### 1. **TestExecutionMain.tsx**

* **Purpose:** Landing page for test execution.
* **Key Actions:**
    * Lists all projects (`mockProjects`).
    * Each project card has an **Execute** button → navigates to `/test-execution/:projectId`.

- - -

### 2. **ProjectTestRuns.tsx**

* **Purpose:** Shows **all test runs** related to a selected project.
* **Main Flow:**
    1. Gets `projectId` from URL.
    2. Filters `mockTestRuns` for the project.
    3. Renders test runs using `<TestRunList />` which uses individual `<TestRunCard />`.
    4. Allows adding a new test run via `<CreateTestRunDialog />`.

- - -

### 3. **CreateTestRunDialog.tsx**

* **Purpose:** Modal for creating a new test run.
* **Key Points:**
    * Uses `useState` for form inputs.
    * Uses `toast` for success/error messages.
    * Currently logs data to the console (replace with API call later).
    * On success: shows toast, clears form, closes modal.

- - -

### 4. **TestRunList.tsx** & **TestRunCard.tsx**

* **TestRunList.tsx**:
    * Iterates through test runs and displays them using `<TestRunCard />`.
* **TestRunCard.tsx**:
    * Displays summary (name, status badge, creator, pass rate).
    * **“View”** button navigates to `/test-runs/:id` for detailed view.

- - -

### 5\. TestRunDetail\.**tsx**

* **Purpose:** Shows full details of a selected test run.
* **Functionality:**
    * Tabs for: `Overview`, `Pending Execution`, and `Executed`.
    * Allows:
        * Updating test run status (via dropdown)
        * Adding test cases (checkbox + dialog)
        * Executing test cases (via modal form)
        * Viewing history of test case executions
* **State Management (locally scoped):**
    * `activeTab` – manages which tab is active
    * `addTestCasesDialogOpen`, `testExecutionDialogOpen`, `historyDialogOpen`
    * `selectedTestCase` for modals
* **Tabs Functionality:**
    * **Overview:** Summary stats & bar graph
    * **Pending:** Not executed test cases (execute button)
    * **Executed:** Shows results, actuals, notes, history button, update button