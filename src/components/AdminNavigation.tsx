
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Activity, 
  FileCheck, 
  Home, 
  LogOut, 
  Menu, 
  Settings, 
  UserCheck,
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

const AdminNavigation = () => {
  const { handleSignOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Doctor Registrations", href: "/admin/doctors", icon: UserCheck },
    { name: "System Monitoring", href: "/admin/monitoring", icon: Activity },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <span className="ml-2 text-lg font-semibold text-mindease-primary">Admin</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-2 text-sm ${
                isActive(item.href)
                  ? "text-mindease-primary font-medium"
                  : "text-gray-600 hover:text-mindease-primary"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-destructive flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full py-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Logo />
                    <span className="ml-2 font-bold text-mindease-primary">Admin</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-2 py-2 rounded-md ${
                        isActive(item.href)
                          ? "bg-mindease-primary/10 text-mindease-primary font-medium"
                          : "text-gray-600 hover:bg-gray-100 hover:text-mindease-primary"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 px-2 py-2 rounded-md justify-start font-normal hover:bg-gray-100 text-gray-600 hover:text-destructive"
                    onClick={() => {
                      setOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
