
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const UserProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Using setTimeout to prevent the React setState warning during render
    setTimeout(() => {
      toast({
        title: "Authentication required",
        description: "Please login to access this feature.",
        variant: "destructive",
      });
    }, 0);
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;
