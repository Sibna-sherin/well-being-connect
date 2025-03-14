
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Specialties from "./pages/Specialties";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import DoctorDetails from "./pages/DoctorDetails";
import DoctorsList from "./pages/DoctorsList";
import { AdminProvider } from "./contexts/AdminContext";
import { UserProvider } from "./contexts/UserContext";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorManagement from "./pages/admin/DoctorManagement";
import SystemMonitoring from "./pages/admin/SystemMonitoring";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background antialiased">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdminProvider>
            <UserProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected User Routes */}
                <Route element={<UserProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/doctors" element={<DoctorsList />} />
                  <Route path="/doctors/:specialty" element={<DoctorsList />} />
                  <Route path="/doctor/:id" element={<DoctorDetails />} />
                </Route>
                
                <Route path="/specialties" element={<Specialties />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/doctors" element={<DoctorManagement />} />
                  <Route path="/admin/monitoring" element={<SystemMonitoring />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserProvider>
          </AdminProvider>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
