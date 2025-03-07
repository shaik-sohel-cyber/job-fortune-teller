
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    try {
      // In a real app, this would be an API call to validate credentials
      if (email && password) {
        // For demo, create mock user
        const mockUser = {
          name: email.split('@')[0], // Extract name from email
          email,
        };
        
        // Store user in localStorage for session persistence
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate("/");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    try {
      // In a real app, this would be an API call to create a new user
      if (name && email && password) {
        // For demo, create mock user
        const mockUser = {
          name,
          email,
        };
        
        // Store user in localStorage for session persistence
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        toast({
          title: "Account created successfully",
          description: "Welcome to Job Fortune!",
        });
        
        navigate("/");
      } else {
        throw new Error("Please fill all required fields");
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please check your information and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem("user");
    
    setUser(null);
    setIsAuthenticated(false);
    
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    });
    
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
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
