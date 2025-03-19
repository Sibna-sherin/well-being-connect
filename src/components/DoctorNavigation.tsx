
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  ClipboardList, 
  Clock, 
  User, 
  Settings, 
  LogOut 
} from "lucide-react";

const DoctorNavigation = () => {
  const { user,userData , handleSignOut} = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <span className="ml-2 text-mindease-primary font-semibold">Doctor Portal</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <Link to="/doctor/appointments">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </Button>
          </Link>
          
          <Link to="/doctor/patients">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              <span>Patient Records</span>
            </Button>
          </Link>
          
          <Link to="/doctor/availability">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Availability</span>
            </Button>
          </Link>
          
          <Link to="/doctor/profile">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium hidden md:block">
            {userData?.name || 'Doctor'}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              onClick={handleSignOut} 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavigation;
