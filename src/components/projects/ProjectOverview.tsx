
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';

interface ProjectOverviewProps {
  project: Project;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Project Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Test Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.testCaseCount}</div>
            <div className="text-muted-foreground text-sm mt-1">Total test cases</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.passRate}%</div>
            <div className="text-muted-foreground text-sm mt-1">Overall pass rate</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created Date</dt>
              <dd>{project.createdAt? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
              <dd>{project.updatedAt? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Test Cases</dt>
              <dd>{project.testCaseCount}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Progress</dt>
              <dd>{project.progress}%</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
