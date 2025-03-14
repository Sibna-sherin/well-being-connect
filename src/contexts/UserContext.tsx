
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface UserContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const userAuth = localStorage.getItem('userAuth');
    if (userAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in a real app, this would verify credentials with a backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, accept any non-empty credentials
        if (email && password) {
          setIsAuthenticated(true);
          localStorage.setItem('userAuth', 'true');
          toast({
            title: "Login successful",
            description: "Welcome to MindEASE."
          });
          resolve(true);
        } else {
          toast({
            title: "Login failed",
            description: "Invalid credentials. Please try again.",
            variant: "destructive"
          });
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('userAuth');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
