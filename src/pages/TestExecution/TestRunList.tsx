// components/test-execution/TestRunList.tsx
import React from "react";
import TestRunCard from "./TestRunCard";

interface TestRunListProps {
  testRuns: any[];
}

const TestRunList: React.FC<TestRunListProps> = ({ testRuns = [] }) => {
  console.log("🔍 Rendering TestRunList with testRuns:", testRuns);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testRuns.map((run) => (
        <TestRunCard key={run.id} testRun={run} />
      ))}
    </div>
  );
};

export default TestRunList;
