/**
 * ThemeToggle Component
 *
 * This component provides a dropdown menu for theme selection.
 * - Allows users to switch between light, dark, and cupcake themes
 * - Uses icons to visually represent theme options
 * - Integrated with the ThemeContext for state management
 */

import React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";

// Theme selector dropdown component
export function ThemeToggle() {
  // Get theme state and setter from context
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* Sun icon shown in light mode, hidden in dark */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {/* Moon icon hidden in light mode, shown in dark */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Light theme option */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        {/* Dark theme option */}
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        {/* Cupcake theme option
        <DropdownMenuItem onClick={() => setTheme("cupcake")}>
          <Palette className="mr-2 h-4 w-4" />
          <span>Cupcake</span>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Make sure we're exporting the ThemeToggle as a named export
