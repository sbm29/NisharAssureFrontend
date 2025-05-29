
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp, Folder, FolderOpen } from 'lucide-react';
import { Module, TestSuite } from '@/types/projectStructure';
import { TestCase } from '@/types/testCase';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TestCaseSelectionTreeProps {
  projectId: string;
  modules: Module[];
  testSuites: TestSuite[];
  testCases: TestCase[];
  selectedTestCases: string[];
  onToggleSelection: (testCaseId: string) => void;
  excludeIds?: string[];
}

/**
 * TestCaseSelectionTree Component
 * 
 * A hierarchical tree view of test cases organized by modules and test suites.
 * Allows for selecting/deselecting test cases at any level in the hierarchy.
 * 
 * @param projectId - The ID of the current project
 * @param modules - List of modules in the project
 * @param testSuites - List of test suites in the project
 * @param testCases - List of test cases in the project
 * @param selectedTestCases - Currently selected test case IDs
 * @param onToggleSelection - Callback for when a test case is selected/deselected
 * @param excludeIds - Optional list of test case IDs to exclude from the tree
 */
const TestCaseSelectionTree: React.FC<TestCaseSelectionTreeProps> = ({
  projectId,
  modules,
  testSuites,
  testCases,
  selectedTestCases,
  onToggleSelection,
  excludeIds = []
}) => {
  // Track expanded state for modules and test suites
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [expandedTestSuites, setExpandedTestSuites] = useState<Record<string, boolean>>({});
  
  // Filter out excluded test cases
  const availableTestCases = testCases.filter(tc => !excludeIds.includes(tc.id));

  // Initialize with all modules expanded
  useEffect(() => {
    const initialExpandedModules: Record<string, boolean> = {};
    modules.forEach(module => {
      initialExpandedModules[module.id] = true;
    });
    setExpandedModules(initialExpandedModules);
  }, [modules]);

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    setExpandedModules({
      ...expandedModules,
      [moduleId]: !expandedModules[moduleId]
    });
  };

  // Toggle test suite expansion
  const toggleTestSuite = (suiteId: string) => {
    setExpandedTestSuites({
      ...expandedTestSuites,
      [suiteId]: !expandedTestSuites[suiteId]
    });
  };

  // Select all test cases in a test suite
  const selectAllInTestSuite = (suiteId: string) => {
    const suiteTestCases = availableTestCases.filter(tc => tc.testSuiteId === suiteId);
    const allSelected = suiteTestCases.every(tc => selectedTestCases.includes(tc.id));
    
    suiteTestCases.forEach(tc => {
      if (allSelected && selectedTestCases.includes(tc.id)) {
        onToggleSelection(tc.id); // Deselect
      } else if (!allSelected && !selectedTestCases.includes(tc.id)) {
        onToggleSelection(tc.id); // Select
      }
    });
  };

  // Select all test cases in a module
  const selectAllInModule = (moduleId: string) => {
    const moduleTestCases = availableTestCases.filter(tc => tc.moduleId === moduleId);
    const allSelected = moduleTestCases.every(tc => selectedTestCases.includes(tc.id));
    
    moduleTestCases.forEach(tc => {
      if (allSelected && selectedTestCases.includes(tc.id)) {
        onToggleSelection(tc.id); // Deselect
      } else if (!allSelected && !selectedTestCases.includes(tc.id)) {
        onToggleSelection(tc.id); // Select
      }
    });
  };

  // Check if all test cases in a test suite are selected
  const areAllTestCasesInSuiteSelected = (suiteId: string) => {
    const suiteTestCases = availableTestCases.filter(tc => tc.testSuiteId === suiteId);
    return suiteTestCases.length > 0 && 
           suiteTestCases.every(tc => selectedTestCases.includes(tc.id));
  };

  // Check if some test cases in a test suite are selected
  const areSomeTestCasesInSuiteSelected = (suiteId: string) => {
    const suiteTestCases = availableTestCases.filter(tc => tc.testSuiteId === suiteId);
    return suiteTestCases.some(tc => selectedTestCases.includes(tc.id)) && 
           !suiteTestCases.every(tc => selectedTestCases.includes(tc.id));
  };

  // Check if all test cases in a module are selected
  const areAllTestCasesInModuleSelected = (moduleId: string) => {
    const moduleTestCases = availableTestCases.filter(tc => tc.moduleId === moduleId);
    return moduleTestCases.length > 0 && 
           moduleTestCases.every(tc => selectedTestCases.includes(tc.id));
  };

  // Check if some test cases in a module are selected
  const areSomeTestCasesInModuleSelected = (moduleId: string) => {
    const moduleTestCases = availableTestCases.filter(tc => tc.moduleId === moduleId);
    return moduleTestCases.some(tc => selectedTestCases.includes(tc.id)) && 
           !moduleTestCases.every(tc => selectedTestCases.includes(tc.id));
  };

  return (
    <div className="overflow-y-auto h-full">
      {modules.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No modules found in this project.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {modules.map(module => {
            // Get test suites for this module
            const moduleSuites = testSuites.filter(suite => suite.moduleId === module.id);
            // Get test cases count for this module
            const moduleTestCasesCount = availableTestCases.filter(tc => tc.moduleId === module.id).length;
            
            return moduleTestCasesCount > 0 ? (
              <div key={module.id} className="border rounded-md mb-2 overflow-hidden">
                <div 
                  className="flex items-center justify-between p-2 bg-muted/30 cursor-pointer"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center gap-2">
                    {expandedModules[module.id] ? (
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Folder className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{module.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({moduleTestCasesCount} test cases)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div 
                      className="p-1 hover:bg-muted rounded cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAllInModule(module.id);
                      }}
                    >
                      <div className={cn(
                        "h-4 w-4 border rounded flex items-center justify-center",
                        areAllTestCasesInModuleSelected(module.id) && "bg-primary border-primary text-primary-foreground",
                        areSomeTestCasesInModuleSelected(module.id) && "bg-primary/50 border-primary/50"
                      )}>
                        {(areAllTestCasesInModuleSelected(module.id) || areSomeTestCasesInModuleSelected(module.id)) && 
                          <Check className="h-3 w-3" />
                        }
                      </div>
                    </div>
                    {expandedModules[module.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
                
                {expandedModules[module.id] && (
                  <div className="pl-4 border-t">
                    {moduleSuites.map(suite => {
                      // Get test cases for this suite
                      const suiteTestCases = availableTestCases.filter(tc => tc.testSuiteId === suite.id);
                      
                      return suiteTestCases.length > 0 ? (
                        <div key={suite.id} className="border-b last:border-b-0">
                          <div 
                            className="flex items-center justify-between p-2 cursor-pointer hover:bg-muted/20"
                            onClick={() => toggleTestSuite(suite.id)}
                          >
                            <div className="flex items-center gap-2">
                              {expandedTestSuites[suite.id] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                              <span>{suite.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({suiteTestCases.length} test cases)
                              </span>
                            </div>
                            <div 
                              className="p-1 hover:bg-muted rounded cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                selectAllInTestSuite(suite.id);
                              }}
                            >
                              <div className={cn(
                                "h-4 w-4 border rounded flex items-center justify-center",
                                areAllTestCasesInSuiteSelected(suite.id) && "bg-primary border-primary text-primary-foreground",
                                areSomeTestCasesInSuiteSelected(suite.id) && "bg-primary/50 border-primary/50"
                              )}>
                                {(areAllTestCasesInSuiteSelected(suite.id) || areSomeTestCasesInSuiteSelected(suite.id)) && 
                                  <Check className="h-3 w-3" />
                                }
                              </div>
                            </div>
                          </div>
                          
                          {expandedTestSuites[suite.id] && (
                            <div className="pl-6 py-1">
                              {suiteTestCases.map(testCase => (
                                <div 
                                  key={testCase.id} 
                                  className="flex items-center justify-between py-1 px-2 hover:bg-muted/10 cursor-pointer"
                                  onClick={() => onToggleSelection(testCase.id)}
                                >
                                  <div className="flex-1">
                                    <div className="text-sm">{testCase.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {testCase.priority} • {testCase.type}
                                    </div>
                                  </div>
                                  <div className={cn(
                                    "h-4 w-4 border rounded flex items-center justify-center",
                                    selectedTestCases.includes(testCase.id) && "bg-primary border-primary text-primary-foreground"
                                  )}>
                                    {selectedTestCases.includes(testCase.id) && 
                                      <Check className="h-3 w-3" />
                                    }
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default TestCaseSelectionTree;
