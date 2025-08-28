import MainLayout from "@/components/layout/MainLayout";

// const ReleaseNotes = () => {
//   return (
//     <MainLayout>
//       <div>
//         <h1>Release Notes</h1>
//       </div>
//     </MainLayout>
//   );
// };

// export default ReleaseNotes;

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ReleaseNotes = () => {
  const release = {
    version: "v0.9.0-beta",
    date: "01 Aug 2025",
    highlights: [
      "Project & Test Case Management (CRUD).",
      "Test Run creation with execution tracking.",
      "Basic dashboard with pass rate.",
      "Role-based access control.",
    ],
    knownIssues: [
      "UI polish in progress.",
      "Some API responses not optimized.",
      "Some mobile-first optimizations in progress.",
    ],
    nextSteps: ["Collect beta feedback", "Fix critical bugs & UX issues"],
  };

  return (
    <MainLayout>
      <div className="space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Release Notes</span>
              <Badge variant="secondary">{release.version}</Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Released on {release.date}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm">🚀 Highlights</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {release.highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm">⚠️ Known Issues</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {release.knownIssues.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm">📌 Next Steps</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {release.nextSteps.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ReleaseNotes;
