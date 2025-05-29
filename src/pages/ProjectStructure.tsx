
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Folder, FileText, File, Plus, Edit, Trash2 } from 'lucide-react';
import { mockProjects } from '@/data/mockData';

// Mock data for modules and test suites
const mockModules = [
  {
    id: 'mod1',
    name: 'Authentication Module',
    description: 'User authentication and authorization tests',
    projectId: 'project1'
  },
  {
    id: 'mod2',
    name: 'Reporting Module',
    description: 'Report generation and export functionality tests',
    projectId: 'project1'
  }
];

const mockTestSuites = [
  {
    id: 'ts1',
    name: 'Login Suite',
    description: 'Tests for user login functionality',
    moduleId: 'mod1',
    projectId: 'project1'
  },
  {
    id: 'ts2',
    name: 'Registration Suite',
    description: 'Tests for user registration',
    moduleId: 'mod1',
    projectId: 'project1'
  },
  {
    id: 'ts3',
    name: 'Report Export Suite',
    description: 'Tests for exporting reports in different formats',
    moduleId: 'mod2',
    projectId: 'project1'
  }
];

const ProjectStructure = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('modules');
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [testSuiteDialogOpen, setTestSuiteDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [newTestSuiteName, setNewTestSuiteName] = useState('');
  const [newTestSuiteDescription, setNewTestSuiteDescription] = useState('');

  const project = mockProjects.find(p => p.id === id);
  const projectModules = mockModules.filter(m => m.projectId === id);

  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleCreateModule = () => {
    console.log('Creating module:', { name: newModuleName, description: newModuleDescription, projectId: id });
    setModuleDialogOpen(false);
    setNewModuleName('');
    setNewModuleDescription('');
  };

  const handleCreateTestSuite = () => {
    console.log('Creating test suite:', { 
      name: newTestSuiteName, 
      description: newTestSuiteDescription, 
      moduleId: selectedModule,
      projectId: id 
    });
    setTestSuiteDialogOpen(false);
    setNewTestSuiteName('');
    setNewTestSuiteDescription('');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`/projects/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Button>
          <h1 className="text-2xl font-bold">
            {project.name} - Project Structure
          </h1>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Organize your test cases into modules and test suites
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setModuleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="test-suites">Test Suites</TabsTrigger>
          </TabsList>

          <TabsContent value="modules">
            {projectModules.length === 0 ? (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <Folder className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">No Modules Created</h3>
                <p className="text-muted-foreground mt-1">Create modules to organize your test cases</p>
                <Button className="mt-4" onClick={() => setModuleDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Module
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectModules.map(module => (
                  <Card key={module.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Folder className="h-5 w-5 text-blue-500" />
                          <CardTitle>{module.name}</CardTitle>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="mt-1">{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {mockTestSuites.filter(ts => ts.moduleId === module.id).length} test suites
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedModule(module.id);
                            setTestSuiteDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Test Suite
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="test-suites">
            {mockTestSuites.filter(ts => ts.projectId === id).length === 0 ? (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">No Test Suites Created</h3>
                <p className="text-muted-foreground mt-1">
                  Create modules first, then add test suites to them
                </p>
                <Button className="mt-4" onClick={() => setActiveTab('modules')}>
                  Go to Modules
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {projectModules.map(module => {
                  const moduleTestSuites = mockTestSuites.filter(ts => ts.moduleId === module.id);
                  if (moduleTestSuites.length === 0) return null;
                  
                  return (
                    <div key={module.id} className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Folder className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">{module.name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {moduleTestSuites.map(testSuite => (
                          <Card key={testSuite.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-purple-500" />
                                  <CardTitle>{testSuite.name}</CardTitle>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Edit className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              </div>
                              <CardDescription className="mt-1">{testSuite.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="mt-2 flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  0 test cases
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/test-cases/new?suiteId=${testSuite.id}`)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Test Case
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Module Dialog */}
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Module</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Module Name</Label>
              <Input
                id="name"
                placeholder="Enter module name"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter module description"
                value={newModuleDescription}
                onChange={(e) => setNewModuleDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModuleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateModule} disabled={!newModuleName}>Create Module</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Test Suite Dialog */}
      <Dialog open={testSuiteDialogOpen} onOpenChange={setTestSuiteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Test Suite</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Test Suite Name</Label>
              <Input
                id="name"
                placeholder="Enter test suite name"
                value={newTestSuiteName}
                onChange={(e) => setNewTestSuiteName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter test suite description"
                value={newTestSuiteDescription}
                onChange={(e) => setNewTestSuiteDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestSuiteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTestSuite} disabled={!newTestSuiteName}>Create Test Suite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ProjectStructure;
