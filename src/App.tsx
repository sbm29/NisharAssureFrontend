
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectStructure from "./pages/ProjectStructure";
import TestCases from "./pages/TestCases";
import TestCaseView from "./pages/TestCaseView";
import TestExecution from "./pages/TestExecution";
import TestRuns from "./pages/TestRuns";
import TestRunDetail from "./pages/TestRunDetail";
import UserManagement from "./pages/UserManagement";
import EditUser from "./pages/EditUser";
import ProfilePage from "./pages/ProfilePage"; // Add the import
import NotFound from "./pages/NotFound";
import ProjectDashboard from "./pages/ProjectDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Create a client for React Query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          {/* Global toast notifications */}
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Authentication Routes - Public */}
              
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Application Routes - Protected */}
              
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProtectedRoute children={<Projects />} />} />
              <Route path="/projects/:projectId" element={<ProtectedRoute children={<ProjectDetail />} />} />
              <Route path="/projects/:id/dashboard" element={<ProtectedRoute children={<ProjectDashboard />} />} />
              <Route path="/projects/:id/structure" element={<ProtectedRoute children={<ProjectStructure />} />} />
              <Route path="/test-cases" element={<ProtectedRoute children={<TestCases />} />} />
              <Route path="/test-cases/:id" element={<ProtectedRoute children={<TestCaseView />} />} />
              <Route path="/test-cases/:id/edit" element={<ProtectedRoute children={<TestCaseView isEditing />} />} />
              <Route path="/test-execution" element={<ProtectedRoute children={<TestExecution />} />} />
              <Route path="/test-execution/:id" element={<ProtectedRoute children={<TestExecution />} />} />
              <Route path="/test-runs" element={<ProtectedRoute children={<TestRuns />} />} />
              <Route path="/test-runs/:id" element={<ProtectedRoute children={<TestRunDetail />} />} />
              <Route path="/user-management" element={<ProtectedRoute children={<UserManagement />} />} />
              <Route path="/user-management/edit/:id" element={<ProtectedRoute children={<EditUser />} />} />
              <Route path="/profile" element={<ProtectedRoute children={<ProfilePage />} />} /> {/* Add the new route */}
            
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
