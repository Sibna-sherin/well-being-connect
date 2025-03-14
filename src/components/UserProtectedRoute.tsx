
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

const UserProtectedRoute = () => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "Please login to access this feature.",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;
