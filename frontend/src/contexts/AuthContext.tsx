"use client";

import api from "@/config/api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  enabled: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  bio?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Starting auth initialization...");
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      if (token) {
        try {
          // Fetch user data
          console.log("Fetching user data...");
          const response = await api.get("/auth/me");
          console.log("User data fetched successfully:", response.data);
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
        }
      } else {
        console.log("No token found in localStorage");
      }
      console.log("Auth initialization complete");
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Starting login process...");
      setError(null);
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      console.log("Login successful, received token and user data");

      // Store token
      localStorage.setItem("token", token);
      console.log("Token stored:", token);

      setUser(user);
      console.log("User state updated:", user);
    } catch (err: any) {
      console.error("Login error:", err);
      // Extract error message from the response
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log("Starting registration process...");
      setError(null);
      const response = await api.post("/auth/register", data);
      const { token, user } = response.data;
      console.log("Registration successful, received token and user data");

      // Store token
      localStorage.setItem("token", token);
      console.log("Token stored:", token);

      setUser(user);
      console.log("User state updated:", user);
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    console.log("Starting logout process...");
    localStorage.removeItem("token");
    setUser(null);
    console.log("Logout complete");
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
