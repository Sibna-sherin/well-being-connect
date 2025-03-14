
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

const UserProtectedRoute = () => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
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
