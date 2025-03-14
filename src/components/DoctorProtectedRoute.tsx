
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDoctor } from "@/contexts/DoctorContext";
import { toast } from "@/hooks/use-toast";

const DoctorProtectedRoute = () => {
  const { isAuthenticated } = useDoctor();
  const location = useLocation();

  if (!isAuthenticated) {
    // Using setTimeout to prevent the React setState warning during render
    setTimeout(() => {
      toast({
        title: "Authentication required",
        description: "Please login as a doctor to access this feature.",
        variant: "destructive",
      });
    }, 0);
    
    return <Navigate to="/login?role=doctor" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default DoctorProtectedRoute;
