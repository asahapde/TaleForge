"use client";

import axios from "axios";
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

// Configure axios
axios.defaults.baseURL = "http://localhost:8080";
// Remove withCredentials as we're using JWT
// axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

// Add request interceptor for logging
axios.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    const token = localStorage.getItem("token");
    if (token) {
      // Ensure we're setting the Authorization header correctly
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Setting Authorization header with token");
    } else {
      console.log("No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response Error:", error.response.data);
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
      console.error("Request Config:", error.config);

      // Only handle 401 for auth-related endpoints
      if (
        error.response.status === 401 &&
        error.config.url &&
        !error.config.url.includes("/api/auth/")
      ) {
        // For non-auth endpoints, just reject the promise
        return Promise.reject(error.response.data);
      }

      // For auth endpoints or other errors, handle normally
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request Error:", error.request);
      return Promise.reject({
        message:
          "No response from server. Please check if the server is running.",
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

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
          // Set the token in axios headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          console.log("Set Authorization header with token");

          // Fetch user data
          console.log("Fetching user data...");
          const response = await axios.get("/api/auth/me");
          console.log("User data fetched successfully:", response.data);
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
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
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data;
      console.log("Login successful, received token and user data");

      // Store token
      localStorage.setItem("token", token);
      // Set the token in axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Token stored and header set:", token);

      // Verify token is set
      const storedToken = localStorage.getItem("token");
      console.log("Stored token:", storedToken);
      console.log("Current axios headers:", axios.defaults.headers.common);

      setUser(user);
      console.log("User state updated:", user);
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log("Starting registration process...");
      setError(null);
      const response = await axios.post("/api/auth/register", data);
      const { token, user } = response.data;
      console.log("Registration successful, received token and user data");

      // Store token
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Token stored and header set");

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
    delete axios.defaults.headers.common["Authorization"];
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
