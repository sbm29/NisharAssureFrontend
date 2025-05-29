
/**
 * TestExecutionHistory Component
 * 
 * Displays the execution history of a test case, including current status and previous executions.
 * This component shows the progression of test case statuses, actual results, and notes over time.
 */

import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestCase } from '@/types/testCase';
import { Separator } from '@/components/ui/separator';

// Define the props interface for the component
interface TestExecutionHistoryProps {
  testCase: TestCase & {
    history?: {
      status: string;
      actualResults?: string;
      notes?: string;
      executedBy?: string;
      executedAt: Date;
    }[];
  };
}

/**
 * TestExecutionHistory component displays the complete history of a test case's execution
 * Features:
 * - Current execution status with details
 * - Previous execution history records
 * - Color-coded status indicators
 * - Formatted timestamps
 */
const TestExecutionHistory: React.FC<TestExecutionHistoryProps> = ({ testCase }) => {
  // If no history, show the current execution as the only item
  const history = testCase.history || [];
  
  /**
   * Returns a color-coded badge component based on test status
   * Visual indication of test case status (Passed, Failed, Blocked, etc.)
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Passed':
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'Blocked':
        return <Badge className="bg-amber-100 text-amber-800">Blocked</Badge>;
      case 'Rejected':
        return <Badge className="bg-purple-100 text-purple-800">Rejected</Badge>;
      case 'Not Executed':
        return <Badge className="bg-gray-100 text-gray-800">Not Executed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  /**
   * Format date in a human-readable format
   */
  const formatDate = (date: Date) => {
    if (!date) return 'Unknown';
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="space-y-4">
      {/* Current status section - shows the most recent execution status */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Current Status</h3>
          <span className="text-xs text-muted-foreground">
            {testCase.status && testCase.executedAt ? formatDate(testCase.executedAt) : 'Not executed yet'}
          </span>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusBadge(testCase.status || 'Not Executed')}
                {testCase.executedBy && (
                  <span className="text-sm text-muted-foreground">
                    by {testCase.executedBy}
                  </span>
                )}
              </div>
            </div>
            {/* Display actual results if available */}
            {testCase.actualResults && (
              <div className="mt-2">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Actual Results</h4>
                <p className="text-sm">{testCase.actualResults}</p>
              </div>
            )}
            {/* Display notes if available */}
            {testCase.notes && (
              <div className="mt-2">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Notes</h4>
                <p className="text-sm">{testCase.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Previous executions section - shows historical test execution records */}
      {history.length > 0 && (
        <>
          <Separator />
          <h3 className="text-sm font-medium">Previous Executions</h3>
          
          {/* Map through history records and display each one */}
          {history.map((historyItem, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(historyItem.status)}
                    {historyItem.executedBy && (
                      <span className="text-sm text-muted-foreground">
                        by {historyItem.executedBy}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(historyItem.executedAt)}
                  </span>
                </div>
                {/* Display historical actual results if available */}
                {historyItem.actualResults && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Actual Results</h4>
                    <p className="text-sm">{historyItem.actualResults}</p>
                  </div>
                )}
                {/* Display historical notes if available */}
                {historyItem.notes && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Notes</h4>
                    <p className="text-sm">{historyItem.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default TestExecutionHistory;
