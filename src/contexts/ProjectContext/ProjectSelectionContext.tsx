import React, { createContext, useContext, useState } from 'react';

interface ProjectSelectionContextProps {
  activeModuleId: string | null;
  setActiveModuleId: (id: string | null) => void;
  activeTestSuiteId: string | null;
  setActiveTestSuiteId: (id: string | null) => void;
}

const ProjectSelectionContext = createContext<ProjectSelectionContextProps | undefined>(undefined);

export const ProjectSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeTestSuiteId, setActiveTestSuiteId] = useState<string | null>(null);

  return (
    <ProjectSelectionContext.Provider
      value={{ activeModuleId, setActiveModuleId, activeTestSuiteId, setActiveTestSuiteId }}
    >
      {children}
    </ProjectSelectionContext.Provider>
  );
};

export const useProjectSelection = () => {
  const context = useContext(ProjectSelectionContext);
  if (!context) {
    throw new Error('useProjectSelection must be used within a ProjectSelectionProvider');
  }
  return context;
};
