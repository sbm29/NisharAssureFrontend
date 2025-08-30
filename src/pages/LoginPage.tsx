// /**
//  * LoginPage Component
//  *
//  * Handles user authentication.
//  * Provides form for users to enter credentials and log into the system.
//  * Redirects to the requested page after successful login.
//  *
//  * Connection to Backend:
//  * Connects to auth endpoints to authenticate users.
//  */

// import React, { useState } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { toast } from '@/hooks/use-toast';

// // Form validation schema using Zod
// const formSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// // TypeScript type derived from Zod schema
// type FormValues = z.infer<typeof formSchema>;

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   // Auth context for login functionality
//   const { login } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);

//   // Get the page user was trying to access, or default to home
//   const from = location.state?.from?.pathname || '/';

//   // Initialize form with validation
//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   /**
//    * Handle form submission
//    * Attempts to log in the user with provided credentials
//    */
//   const onSubmit = async (values: FormValues) => {
//     setIsLoading(true);
//     try {
//       // Call login from auth context
//       await login(values.email, values.password);
//       toast({
//         title: 'Login Successful',
//         description: 'Welcome back!',
//       });
//       // Redirect to original destination or home
//       navigate(from, { replace: true });
//     } catch (error) {
//       // Show error notification
//       toast({
//         title: 'Login Failed',
//         description: error instanceof Error ? error.message : 'An error occurred during login',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-md">
//         {/* App logo/name header */}
//         <div className="flex justify-center mb-8">
//           <h1 className="text-3xl text-yellow-400 font-bold text-primary">Nishar Assure 50</h1>
//         </div>

//         {/* Login form card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Login</CardTitle>
//             <CardDescription>
//               Enter your credentials to access your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 {/* Email field */}
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input placeholder="email@example.com" type="email" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 {/* Password field */}
//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl>
//                         <Input type="password" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 {/* Submit button */}
//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? 'Logging in...' : 'Login'}
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//           {/* Link to registration page */}
//           <CardFooter className="flex justify-center">
//             <p className="text-sm text-center text-muted-foreground">
//               Don't have an account?{' '}
//               <Link to="/register" className="text-primary hover:underline">
//                 Register
//               </Link>
//             </p>
//           </CardFooter>
//         </Card>

//         {/* Demo credentials section */}
//         <div className="mt-8 text-center">
//           <p className="text-sm text-muted-foreground">
//             Demo Credentials:
//           </p>
//           <p className="text-xs text-muted-foreground mt-1">
//             Admin: admin@example.com / password<br />
//             Test Manager: manager@example.com / password<br />
//             Test Engineer: engineer@example.com / password
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

//=========================================

/**
 * LoginPage Component
 *
 * Handles user authentication with a modern split-screen design.
 * Left side: Login form (responsive width)
 * Right side: App features and information (larger width on desktop)
 * Fully responsive design that adapts to all screen sizes.
 *
 * Connection to Backend:
 * Connects to auth endpoints to authenticate users.
 */

import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle,
  Shield,
  BarChart3,
  Users,
  FileText,
  Zap,
} from "lucide-react";

// Form validation schema using Zod
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// TypeScript type derived from Zod schema
type FormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Auth context for login functionality
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get the page user was trying to access, or default to home
  const from = location.state?.from?.pathname || "/";

  // Initialize form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Handle form submission
   * Attempts to log in the user with provided credentials
   */
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Call login from auth context
      await login(values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      // Redirect to original destination or home
      navigate(from, { replace: true });
    } catch (error) {
      // Show error notification
      toast({
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // App features for the right side
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      title: "Comprehensive Test Management",
      description:
        "Create, organize, and manage test cases with detailed documentation and execution tracking.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-green-600" />,
      title: "Advanced Analytics & Reporting",
      description:
        "Get insights into test coverage, execution trends, and team performance with detailed reports.",
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "Team Collaboration",
      description:
        "Enable seamless collaboration between test managers, engineers, and stakeholders.",
    },
    {
      icon: <Shield className="h-6 w-6 text-red-600" />,
      title: "Enterprise Security",
      description:
        "Role-based access control and secure data management for enterprise-grade testing.",
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      title: "Automated Workflows",
      description:
        "Streamline testing processes with automated test execution and result tracking.",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex flex-col justify-center w-full pt-4 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-sm mx-auto">
          {/* App logo/name header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Nishar Assure
            </h1>
            <p className="text-gray-600 text-lg">
              "Built for Our Team, by Our Team"
            </p>
          </div>

          {/* Login form card */}
          <Card className="border-2 border-primary p-4 shadow-none">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-semibold text-gray-900 text-center">
                Welcome back
              </CardTitle>
              {/* <CardDescription className="text-gray-600 text-center">
                Enter your credentials to access your account
              </CardDescription> */}
            </CardHeader>
            <CardContent className="px-0 pt-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  {/* Email field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            type="email"
                            className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Password field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Submit button */}
                  <Button
                    type="submit"
                    className="w-full h-10 pt-1 bg-primary hover:bg-cyan/80 text-gray-900 font-medium text-md rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </Form>

              {/* Link to registration page */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo credentials section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Demo Credentials (Beta Version) :
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <strong>Admin:</strong> admin@example.com / password
              </p>
              <p>
                <strong>Test Manager:</strong> manager@example.com / password
              </p>
              <p>
                <strong>Test Engineer:</strong> engineer@example.com / password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
