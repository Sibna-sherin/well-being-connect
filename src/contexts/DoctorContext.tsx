
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
}

interface DoctorContextType {
  isAuthenticated: boolean;
  doctorData: Doctor | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const navigate = useNavigate();

  // Check if doctor is already logged in on mount
  useEffect(() => {
    const doctorAuth = localStorage.getItem('doctorAuth');
    if (doctorAuth === 'true') {
      setIsAuthenticated(true);
      
      // Get doctor data from localStorage
      const storedDoctorData = localStorage.getItem('doctorData');
      if (storedDoctorData) {
        setDoctorData(JSON.parse(storedDoctorData));
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in a real app, this would verify credentials with a backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, accept any valid email/password
        if (email && password) {
          // Mock doctor data - in a real app, this would come from the backend
          const mockDoctorData: Doctor = {
            id: 1,
            name: email.split('@')[0].replace(/\./g, ' ').replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase()),
            email: email,
            specialty: "Psychologist"
          };
          
          setDoctorData(mockDoctorData);
          setIsAuthenticated(true);
          localStorage.setItem('doctorAuth', 'true');
          localStorage.setItem('doctorData', JSON.stringify(mockDoctorData));
          
          toast({
            title: "Login successful",
            description: "Welcome to your MindEASE doctor dashboard."
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
    setDoctorData(null);
    localStorage.removeItem('doctorAuth');
    localStorage.removeItem('doctorData');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    
    navigate("/login");
  };

  return (
    <DoctorContext.Provider value={{ isAuthenticated, doctorData, login, logout }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = (): DoctorContextType => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error("useDoctor must be used within a DoctorProvider");
  }
  return context;
};
