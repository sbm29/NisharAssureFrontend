// import React, { createContext, useContext, useState, useEffect } from "react";
// import { User, UserRole } from "@/types/user";
// import axios from "axios";
// import {BaseURL} from "@/lib/config";

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
//   hasPermission: (role: UserRole | UserRole[]) => boolean;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Automatically attach token to requests
//   useEffect(() => {
//     const token = localStorage.getItem("auth_token");
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     }
//   }, []);

//   // Fetch user if token exists
//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("auth_token");
//       if (!token) return;

//       try {
//         const res = await axios.get<User>(`${BaseURL}/api/auth/me`);
//         setUser(res.data);
//         setIsAuthenticated(true);
//         setLoading(false);
//       } catch (err) {
//         logout(); // Invalid token
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const res = await axios.post<{ token: string, user: User }>(`${BaseURL}/api/auth/login`, {
//         email,
//         password,
//       });
//       const token = res.data.token;

//       localStorage.setItem("auth_token", token);
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//       setUser(res.data.user);
//       setIsAuthenticated(true);
//       setLoading(false);
//     } catch (err: any) {
//       setLoading(false);
//       throw new Error(err.response?.data?.message || "Login failed");
//     }
//   };

//   const register = async (name: string, email: string, password: string) => {
//     try {
//       // Send registration request
//       const res = await axios.post<{ token: string; user: User }>(
//         `${BaseURL}/api/auth/register`,
//         { name, email, password }
//       );

//       const token = res.data.token;

//       // Save token and set default Authorization header
//       localStorage.setItem("auth_token", token);
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//       // Fetch user profile after registration
//       setUser(res.data.user);
//       setIsAuthenticated(true);
//       setLoading(false);
//       // Redirect to dashboard or homepage
//     } catch (err: unknown) {
//       setLoading(false);
//       // Improve type safety and error message consistency
//       if (axios.isAxiosError(err)) {
//         const errorMessage =
//           err.response?.data?.message || "Registration failed";
//         throw new Error(errorMessage);
//       }
//       throw new Error("An unexpected error occurred during registration");
//     }
//   };
//   const logout = () => {
//     localStorage.removeItem("auth_token");
//     delete axios.defaults.headers.common["Authorization"];
//     setUser(null);
//     setIsAuthenticated(false);
//       };

//   const hasPermission = (requiredRole: UserRole | UserRole[]) => {
//     if (!user) return false;
//     if (user.role === "admin") return true;

//     return Array.isArray(requiredRole)
//       ? requiredRole.includes(user.role)
//       : user.role === requiredRole;
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, isAuthenticated, login, register, logout, hasPermission, loading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

//==============================

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { User, UserRole } from "@/types/user";
// import axios from "axios";
// import { BaseURL } from "@/lib/config";

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   hasPermission: (role: UserRole | UserRole[]) => boolean;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Always send cookies with axios requests
//   axios.defaults.withCredentials = true;

//   useEffect(() => {
//     if (user) {
//       console.log("AuthContext user updated:", user);
//       //setUser(user);
//     }
//   }, [user]);

//   // Sync user changes to localStorage
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//     }
//   }, [user]);

//   // Load user from localStorage on startup
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//       setIsAuthenticated(true);
//     }
//   }, []);

//   // Validate cookie session with backend
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get<{ user: User }>(`${BaseURL}/api/auth/me`);
//         setUser(res.data.user);
//         setIsAuthenticated(true);
//       } catch {
//         setUser(null);
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.post<{ user: User }>(
//         `${BaseURL}/api/auth/login`,
//         { email, password }
//       );
//       setUser(res.data.user);
//       console.log("Logged in user:", res.data.user);
//       console.log("State User:", user);
//       setIsAuthenticated(true);
//     } catch (err: any) {
//       throw new Error(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (name: string, email: string, password: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.post<{ user: User }>(
//         `${BaseURL}/api/auth/register`,
//         { name, email, password }
//       );
//       setUser(res.data.user);
//       setIsAuthenticated(true);
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         throw new Error(err.response?.data?.message || "Registration failed");
//       }
//       throw new Error("Unexpected error during registration");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post(`${BaseURL}/api/auth/logout`, {});
//     } catch {
//       // ignore backend error, clear client state anyway
//     } finally {
//       setUser(null);
//       setIsAuthenticated(false);
//       localStorage.removeItem("user");
//     }
//   };

//   const hasPermission = (requiredRole: UserRole | UserRole[]) => {
//     if (!user) return false;
//     if (user.role === "admin") return true;

//     return Array.isArray(requiredRole)
//       ? requiredRole.includes(user.role)
//       : user.role === requiredRole;
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         login,
//         register,
//         logout,
//         hasPermission,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { BaseURL } from "@/lib/config";
import { User, UserRole } from "@/types/user";

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
  hasPermission: (role: UserRole | UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios defaults
axios.defaults.withCredentials = true; // Enable sending cookies for cross-origin requests
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add axios response interceptor to handle auth errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth state on auth errors
      localStorage.removeItem("auth_user");
    }
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage if available
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Set initial authenticated state based on user presence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  // Start loading only if we need to validate the session
  const [loading, setLoading] = useState<boolean>(!!user);

  // Sync user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  // Fetch /me and sync state
  const fetchUser = useCallback(async () => {
    try {
      // Get stored user data
      const storedUser = localStorage.getItem("auth_user");

      // If we have stored data, use it immediately
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Failed to parse stored user data:", e);
        }
      }

      // Always validate with backend
      const res = await axios.get<{ user: User }>(`${BaseURL}/api/auth/me`);

      if (res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        localStorage.setItem("auth_user", JSON.stringify(res.data.user));
      } else {
        throw new Error("No user data received from server");
      }
    } catch (err) {
      console.error("Auth validation error:", err);

      if (axios.isAxiosError(err)) {
        // Only clear on auth errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("auth_user");
        } else {
          // For other errors (network etc), keep existing state
          console.warn("Non-auth error during session validation:", err);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, validate session (handles new tabs)
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Public API: login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post<{ user: User }>(
        `${BaseURL}/api/auth/login`,
        { email, password }
      );
      // backend sets HttpOnly cookie; frontend receives user in body
      const userData = res.data.user;
      setUser(userData);
      setIsAuthenticated(true);
      // Store in localStorage for persistence across tabs
      localStorage.setItem("auth_user", JSON.stringify(userData));
    } catch (err: any) {
      // rethrow so UI can show error
      throw new Error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Public API: register
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post<{ user: User }>(
        `${BaseURL}/api/auth/register`,
        { name, email, password }
      );
      // backend sets HttpOnly cookie; frontend receives user in body
      const userData = res.data.user;
      setUser(userData);
      setIsAuthenticated(true);
      // Store in localStorage for persistence across tabs
      localStorage.setItem("auth_user", JSON.stringify(userData));
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Public API: logout
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${BaseURL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      // ignore errors from backend but still clear client state
      console.error("Logout request failed", err);
    } finally {
      // Clear all auth state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("auth_user");
      setLoading(false);
    }
  };

  // Refresh user (exposed for manual revalidation)
  const refreshUser = async () => {
    setLoading(true);
    try {
      await fetchUser();
    } finally {
      setLoading(false);
    }
  };

  // Update user locally (useful after profile edit)
  const updateUser = (partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...partial } as User;
    });
  };

  // Role check helper
  const hasPermission = (requiredRole: UserRole | UserRole[]) => {
    if (!user) return false;
    if (user.role === "admin") return true; // admin shortcut

    return Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
