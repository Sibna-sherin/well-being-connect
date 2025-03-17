
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
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.data.role !== "doctor") {
          toast({
            title: "Login failed",
            description: "This account is not registered as a doctor.",
            variant: "destructive",
          });
          return false;
        }
  
        if (!data.data.approved) {
          toast({
            title: "Account pending approval",
            description: "Your account is awaiting admin approval.",
            variant: "destructive",
          });
          return false;
        }
  
        const doctorData: Doctor = {
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          specialty: "Psychologist", // Assuming this data should be stored
        };
  
        setDoctorData(doctorData);
        setIsAuthenticated(true);
        localStorage.setItem("doctorAuth", "true");
        localStorage.setItem("doctorData", JSON.stringify(doctorData));
        localStorage.setItem("token", data.data.token);
  
        toast({
          title: "Login successful",
          description: "Welcome to your MindEase doctor dashboard.",
        });
  
        return true;
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
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
