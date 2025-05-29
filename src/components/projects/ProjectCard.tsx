
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { id, name, description, status, progress, testCaseCount, passRate } = project;
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on hold': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">
            <Link to={`/projects/${id}`} className="hover:text-primary transition-colors">
              {name}
            </Link>
          </CardTitle>
          <Badge className={getStatusColor(status)}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{description}</p>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Test Cases: {testCaseCount}</span>
            <span className="font-medium">
              Pass Rate: <span className={passRate >= 70 ? 'text-green-600' : 'text-amber-600'}>
                {passRate}%
              </span>
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground">
        Updated: {new Date().toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
