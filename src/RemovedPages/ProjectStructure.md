// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import MainLayout from "@/components/layout/MainLayout";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,

// } from "@/components/ui/dialog";

// import { ArrowLeft, Folder, FileText, Plus, Edit, Trash2 } from "lucide-react";

// import { useProject } from "@/hooks/projects/useProject";
// import { useModules } from "@/hooks/modules/useModules";
// import { useTestSuites } from "@/hooks/testsuites/useTestSuites";
// import ModuleForm from "@/components/projects/ModuleForm";
// import TestSuiteForm from "@/components/projects/TestSuiteForm";

// const ProjectStructure = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("modules");
//   const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
//   const [testSuiteDialogOpen, setTestSuiteDialogOpen] = useState(false);
//   const [selectedModule, setSelectedModule] = useState<string | null>(null);

//   //const [newTestSuiteName, setNewTestSuiteName] = useState("");
//   //const [newTestSuiteDescription, setNewTestSuiteDescription] = useState("");

//   const { data } = useProject(id);
//   const project = data?.project;

//   const { data: modulesData } = useModules(id);
//   const projectModules = modulesData?.modules || [];

//   const { data: testSuitesData } = useTestSuites();
//   const projectTestSuites = testSuitesData?.testSuites || [];

//   console.log("Project Id", id);  
//   console.log("Project Modules", selectedModule);

//   if (!project) {
//     return (
//       <MainLayout>
//         <div className="text-center py-16">
//           <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
//           <Button onClick={() => navigate("/projects")}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Projects
//           </Button>
//         </div>
//       </MainLayout>
//     );
//   }

//   // const handleCreateTestSuite = () => {
//   //   console.log("Creating test suite:", {
//   //     name: newTestSuiteName,
//   //     description: newTestSuiteDescription,
//   //     moduleId: selectedModule,
//   //     id: id,
//   //   });
//   //   setTestSuiteDialogOpen(false);
//   //   setNewTestSuiteName("");
//   //   setNewTestSuiteDescription("");
//   // };

//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" onClick={() => navigate(`/projects/${id}`)}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Project
//           </Button>
//           <h1 className="text-2xl font-bold">
//             {project.name} - Project Structure
//           </h1>
//         </div>

//         <div className="flex justify-between items-center">
//           <p className="text-muted-foreground">
//             Organize your test cases into modules and test suites
//           </p>
//           <div className="flex gap-3">
//             <Button onClick={() => setModuleDialogOpen(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Module
//             </Button>
//           </div>
//         </div>

//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="space-y-4"
//         >
//           <TabsList>
//             <TabsTrigger value="modules">Modules</TabsTrigger>
//             <TabsTrigger value="test-suites">Test Suites</TabsTrigger>
//           </TabsList>

//           <TabsContent value="modules">
//             {projectModules.length === 0 ? (
//               <div className="bg-muted/40 rounded-lg p-8 text-center">
//                 <Folder className="h-12 w-12 mx-auto text-muted-foreground" />
//                 <h3 className="text-lg font-medium mt-4">No Modules Created</h3>
//                 <p className="text-muted-foreground mt-1">
//                   Create modules to organize your test cases
//                 </p>
//                 <Button
//                   className="mt-4"
//                   onClick={() => setModuleDialogOpen(true)}
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create First Module
//                 </Button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {projectModules.map((module) => (
//                   <Card key={module.id} className="overflow-hidden">
//                     <CardHeader className="pb-2">
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-center gap-2">
//                           <Folder className="h-5 w-5 text-blue-500" />
//                           <CardTitle>{module.name}</CardTitle>
//                         </div>
//                         <div className="flex gap-1">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-8 w-8 p-0"
//                           >
//                             <Edit className="h-4 w-4 text-muted-foreground" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-8 w-8 p-0"
//                           >
//                             <Trash2 className="h-4 w-4 text-muted-foreground" />
//                           </Button>
//                         </div>
//                       </div>
//                       <CardDescription className="mt-1">
//                         {module.description}
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="mt-2 flex justify-between">
//                         <span className="text-sm text-muted-foreground">
//                           {
//                             projectTestSuites.filter(
//                               (ts) => ts.moduleId === module.id
//                             ).length
//                           }{" "}
//                           test suites
//                         </span>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             setSelectedModule(module.id);
//                             setTestSuiteDialogOpen(true);
//                           }}
//                         >
//                           <Plus className="h-3 w-3 mr-1" />
//                           Add Test Suite
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="test-suites">
//             {projectTestSuites.filter((ts) => ts.id === id).length === 0 ? (
//               <div className="bg-muted/40 rounded-lg p-8 text-center">
//                 <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
//                 <h3 className="text-lg font-medium mt-4">
//                   No Test Suites Created
//                 </h3>
//                 <p className="text-muted-foreground mt-1">
//                   Create modules first, then add test suites to them
//                 </p>
//                 <Button
//                   className="mt-4"
//                   onClick={() => setActiveTab("modules")}
//                 >
//                   Go to Modules
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {projectModules.map((module) => {
//                   const moduleTestSuites = projectTestSuites.filter(
//                     (ts) => ts.moduleId === module.id
//                   );
//                   if (moduleTestSuites.length === 0) return null;

//                   return (
//                     <div key={module.id} className="space-y-3">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Folder className="h-5 w-5 text-blue-500" />
//                         <h3 className="font-medium">{module.name}</h3>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {moduleTestSuites.map((testSuite) => (
//                           <Card key={testSuite.id} className="overflow-hidden">
//                             <CardHeader className="pb-2">
//                               <div className="flex items-start justify-between">
//                                 <div className="flex items-center gap-2">
//                                   <FileText className="h-5 w-5 text-purple-500" />
//                                   <CardTitle>{testSuite.name}</CardTitle>
//                                 </div>
//                                 <div className="flex gap-1">
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-8 w-8 p-0"
//                                   >
//                                     <Edit className="h-4 w-4 text-muted-foreground" />
//                                   </Button>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-8 w-8 p-0"
//                                   >
//                                     <Trash2 className="h-4 w-4 text-muted-foreground" />
//                                   </Button>
//                                 </div>
//                               </div>
//                               <CardDescription className="mt-1">
//                                 {testSuite.description}
//                               </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                               <div className="mt-2 flex justify-between items-center">
//                                 <span className="text-sm text-muted-foreground">
//                                   0 test cases
//                                 </span>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() =>
//                                     navigate(
//                                       `/test-cases/new?suiteId=${testSuite.id}`
//                                     )
//                                   }
//                                 >
//                                   <Plus className="h-3 w-3 mr-1" />
//                                   Add Test Case
//                                 </Button>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Add Module Dialog
//       <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add New Module</DialogTitle>
//           </DialogHeader>
//           <ModuleForm
//             projectId={id!}
//             onSuccess={() => setModuleDialogOpen(false)}
//           />
//         </DialogContent>
//       </Dialog> */}

//       {/* Add Test Suite Dialog

//       <Dialog open={testSuiteDialogOpen} onOpenChange={setTestSuiteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add New Test Suite</DialogTitle>
//           </DialogHeader>
//           {selectedModule && id && (
//             <TestSuiteForm
//               moduleId={selectedModule}
//               projectId={id!}
//               onSuccess={() => {
//                 setTestSuiteDialogOpen(false);
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog> */}
//     </MainLayout>
//   );
// };

// export default ProjectStructure;
