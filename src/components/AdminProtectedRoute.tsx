
import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const AdminProtectedRoute = () => {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
