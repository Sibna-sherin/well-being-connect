
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { Menu, User, Calendar, LayoutGrid } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserNavigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-mindease-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-mindease-primary transition-colors">
              My Profile
            </Link>
            <Link to="/appointments" className="text-gray-700 hover:text-mindease-primary transition-colors">
              Book Appointment
            </Link>
            <Link to="/specialties" className="text-gray-700 hover:text-mindease-primary transition-colors">
              Categories
            </Link>
          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex items-center w-full">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/appointments" className="flex items-center w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Book Appointment</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/specialties" className="flex items-center w-full">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>Categories</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Button 
            variant="outline" 
            className="border-mindease-primary text-mindease-primary hover:bg-mindease-primary hover:text-white"
            onClick={() => console.log("Logout")}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default UserNavigation;
