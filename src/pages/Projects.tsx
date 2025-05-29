
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProjectCard from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import ProjectForm from '@/components/projects/ProjectForm';
import { BaseURL } from '@/lib/config';
import { Plus, Search } from 'lucide-react';
import axios from 'axios';

const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');


// Fetch all projects from the backend
useEffect(() => {
  const fetchAllProjects = async () => {
    try {
      const res = await axios.get(`${BaseURL}/api/projects/allprojects`); // Update with your actual API URL
      console.log('Fetched projects:', res.data);
      setProjects(res.data);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
      setIsLoading(false);
    }
  };

  fetchAllProjects();
}, []);


  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (data: any) => {
    console.log('Create project with data:', data);
    setIsDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your test projects</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <ProjectForm onSubmit={handleCreateProject} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            defaultValue="all" 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-muted/40 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {filteredProjects.map((project) => (
              console.log("project",project),
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Projects;


