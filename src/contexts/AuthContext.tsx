
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getAllUsers: () => User[];
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin: string;
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
      // Get all registered users
      const usersString = localStorage.getItem("registeredUsers");
      const users = usersString ? JSON.parse(usersString) : [];
      
      // Find the user with matching credentials
      const foundUser = users.find((u: User) => u.email === email);
      
      if (foundUser) {
        // Update last login time
        foundUser.lastLogin = new Date().toISOString();
        
        // Update user in the registered users list
        const updatedUsers = users.map((u: User) => 
          u.email === email ? foundUser : u
        );
        
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
        localStorage.setItem("user", JSON.stringify(foundUser));
        
        setUser(foundUser);
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
      if (name && email && password) {
        // Get existing users
        const usersString = localStorage.getItem("registeredUsers");
        const existingUsers = usersString ? JSON.parse(usersString) : [];
        
        // Check if user already exists
        if (existingUsers.some((u: User) => u.email === email)) {
          throw new Error("User with this email already exists");
        }
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        // Add to registered users
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
        
        // Set as current user
        localStorage.setItem("user", JSON.stringify(newUser));
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        toast({
          title: "Account created successfully",
          description: "Welcome to JobGenisis!",
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
  
  // Function to get all registered users
  const getAllUsers = () => {
    const usersString = localStorage.getItem("registeredUsers");
    return usersString ? JSON.parse(usersString) : [];
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, getAllUsers }}>
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
