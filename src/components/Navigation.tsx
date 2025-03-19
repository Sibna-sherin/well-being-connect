import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const navigate = useNavigate();
  const { user, role, handleSignOut } = useAuth();

  const handleDahboard = () => {
    if (role === "user") {
      navigate("/dashboard", { replace: true });
    } else if (role === "doctor") {
      navigate("/doctor/dashboard", { replace: true });
    } else if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  };
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        {!user ? (
          <div className="flex items-center space-x-4">
            <Link to="/admin/login">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-mindease-primary hover:bg-mindease-primary/90">
                Register
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => handleDahboard()}>
              Dashboard
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
