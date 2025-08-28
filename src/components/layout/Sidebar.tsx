// /**
//  * Sidebar Component
//  *
//  * Main navigation sidebar for the application.
//  * Provides links to different sections based on user's role and permissions.
//  * Features a collapsible design to save space on smaller screens.
//  */

// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import {
//   Folder,
//   List,
//   CheckSquare,
//   BarChart,
//   Settings,
//   Users,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { UserRole } from '@/types/user';

// const Sidebar = () => {
//   // State for collapsed/expanded sidebar
//   const [collapsed, setCollapsed] = useState(false);
//   const location = useLocation();
//   // Auth context provides role-based permission checking
//   const { hasPermission, isAuthenticated } = useAuth();

//   /**
//    * Check if the current route matches the navigation item path
//    * Used for highlighting the active navigation item
//    */
//   const isActive = (path: string) => {
//     return location.pathname===path;
//   };

//   /**
//    * Navigation items with role-based permissions
//    * Each item specifies which user roles can access it
//    */
//   const navItems = [
//     {
//       name: 'Dashboard',
//       path: '/',
//       icon: BarChart,
//       allowedRoles: ['admin', 'test_manager', 'test_engineer'] as UserRole[]
//     },
//     {
//       name: 'Projects',
//       path: '/projects',
//       icon: Folder,
//       allowedRoles: ['admin', 'test_manager', 'test_engineer'] as UserRole[]
//     },
//     {
//       name: 'Test Cases',
//       path: '/test-cases',
//       icon: List,
//       allowedRoles: ['admin', 'test_manager', 'test_engineer'] as UserRole[]
//     },
//     {
//       name: 'Test Execution',
//       path: '/test-execution',
//       icon: CheckSquare,
//       allowedRoles: ['admin', 'test_manager', 'test_engineer'] as UserRole[]
//     },
//     {
//       name: 'User Management',
//       path: '/user-management',
//       icon: Users,
//       allowedRoles: ['admin'] as UserRole[]
//     },
//     {
//       name: 'Release Notes',
//       path: '/release-notes',
//       icon: Users,
//       allowedRoles: ['admin', 'test_manager', 'test_engineer'] as UserRole[]
//     },

//   ];

//   // Filter navigation items based on user permissions
//   const filteredNavItems = navItems.filter(item => {
//     return isAuthenticated && hasPermission(item.allowedRoles);
//   });

//   return (
//     <div
//       className={cn(
//         "h-full bg-white border-r border-border transition-all duration-300 flex flex-col",
//         collapsed ? "w-16" : "w-64"
//       )}
//     >
//       {/* Header with logo and collapse button */}
//       <div className=" flex items-center justify-between h-[88px] px-4 border-b border-border">
//         {!collapsed && (
//           <Link to="/" className="flex items-center">
//             <span className="font-bold text-xl text-primary">Nishar Assure (Beta) </span>
//           </Link>
//         )}
//         <Button
//           variant="ghost"
//           size="icon"
//           className="ml-auto"
//           onClick={() => setCollapsed(!collapsed)}
//         >
//           {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//         </Button>
//       </div>

//       {/* Navigation menu */}
//       <nav className="flex-1 py-4">
//         <ul className="space-y-1 px-2">
//           {filteredNavItems.map((item) => (
//             <li key={item.path}>
//               <Link
//                 to={item.path}
//                 className={cn(
//                   "flex items-center py-2 px-3 rounded-md transition-colors",
//                   isActive(item.path)
//                     ? "bg-primary text-primary-foreground"
//                     : "text-muted-foreground hover:bg-muted hover:text-foreground"
//                 )}
//               >
//                 <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
//                 {!collapsed && <span>{item.name}</span>}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Footer with version info */}
//       <div className="p-4 border-t border-border">
//         <div className="flex items-center">
//           {!collapsed && (
//             <div className="flex-1">
//               <p className="text-xs text-muted-foreground">Nishar Assure v1.0</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Folder,
  List,
  CheckSquare,
  BarChart,
  Settings,
  ScrollTextIcon,
  Users,
  ChevronLeft,
  ChevronRight,
  Megaphone,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { hasPermission, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems: {
    name: string;
    path: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    allowedRoles: UserRole[];
  }[] = [
    {
      name: "Dashboard",
      path: "/",
      icon: BarChart,
      allowedRoles: ["admin", "test_manager", "test_engineer"],
    },
    {
      name: "Projects",
      path: "/projects",
      icon: Folder,
      allowedRoles: ["admin", "test_manager", "test_engineer"],
    },
    {
      name: "Test Cases",
      path: "/test-cases",
      icon: List,
      allowedRoles: ["admin", "test_manager", "test_engineer"],
    },
    {
      name: "Test Execution",
      path: "/test-execution",
      icon: CheckSquare,
      allowedRoles: ["admin", "test_manager", "test_engineer"],
    },
    {
      name: "User Management",
      path: "/user-management",
      icon: Users,
      allowedRoles: ["admin"],
    },
    {
      name: "Release Notes",
      path: "/release-notes",
      icon: ScrollTextIcon,
      allowedRoles: ["admin", "test_manager", "test_engineer"],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => isAuthenticated && hasPermission(item.allowedRoles)
  );

  return (
    <aside
      className={cn(
        "h-full bg-background text-foreground border-r border-border transition-[width] duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-[88px] px-4 border-b border-border">
        {!collapsed && (
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl text-primary">
              Nishar Assure (Beta)
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      collapsed ? "mx-auto" : "mr-3"
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed && (
          <p className="text-xs text-muted-foreground">Nishar Assure v1.0</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
