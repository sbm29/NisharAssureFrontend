import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/user";
import axios from "axios";
import {BaseURL} from "@/lib/config";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (role: UserRole | UserRole[]) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Automatically attach token to requests
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Fetch user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await axios.get<User>(`${BaseURL}/api/auth/me`);
        setUser(res.data);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (err) {
        logout(); // Invalid token
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post<{ token: string, user: User }>(`${BaseURL}/api/auth/login`, {
        email,
        password,
      });
      const token = res.data.token;

      localStorage.setItem("auth_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Send registration request
      const res = await axios.post<{ token: string; user: User }>(
        `${BaseURL}/api/auth/register`,
        { name, email, password }
      );

      const token = res.data.token;

      // Save token and set default Authorization header
      localStorage.setItem("auth_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch user profile after registration
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      // Redirect to dashboard or homepage
    } catch (err: unknown) {
      setLoading(false);
      // Improve type safety and error message consistency
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Registration failed";
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred during registration");
    }
  };
  const logout = () => {
    localStorage.removeItem("auth_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
      };

  const hasPermission = (requiredRole: UserRole | UserRole[]) => {
    if (!user) return false;
    if (user.role === "admin") return true;

    return Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, hasPermission, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
