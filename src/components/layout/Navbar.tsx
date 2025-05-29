
/**
 * Navbar Component
 * 
 * Main navigation header for the application that includes:
 * - Project title & logo
 * - User profile menu with authentication options
 * - Theme toggle functionality
 * - Mobile-responsive menu handling
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

// This component renders the main navigation bar at the top of the application
const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect to add shadow to navbar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu open/closed
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu (useful for navigation actions)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle user logout
  const handleLogout = () => {
    logout();
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <nav 
      className={`fixed top-0 w-full bg-background z-50 border-b transition-all ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
            <span className="font-bold text-xl">Test Manager</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {user && <ThemeToggle />}
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2" 
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 px-2 space-y-3 border-t">
            {user ? (
              <>
                <div className="flex items-center space-x-3 py-2">
                  <Avatar>
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <Link 
                    to="/profile" 
                    className="block px-2 py-2 hover:bg-muted rounded-md"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-2 py-2 hover:bg-muted rounded-md"
                    onClick={closeMobileMenu}
                  >
                    Settings
                  </Link>
                  <button 
                    className="w-full text-left px-2 py-2 hover:bg-muted rounded-md text-destructive" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/login"
                  className="block px-2 py-2 hover:bg-muted rounded-md"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="block px-2 py-2 hover:bg-muted rounded-md"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
