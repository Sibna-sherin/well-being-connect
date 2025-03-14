
import { useEffect, useState } from "react";
import AdminNavigation from "@/components/AdminNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Users, 
  Calendar,
  ArrowUpRight, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle 
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendValue?: string;
  trendDirection?: "up" | "down" | "neutral";
}

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendValue, 
  trendDirection = "neutral" 
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-full text-primary">{icon}</div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && trendValue && (
          <div className="flex items-center mt-2">
            <span 
              className={`text-xs mr-1 ${
                trendDirection === "up" 
                  ? "text-green-500" 
                  : trendDirection === "down" 
                  ? "text-red-500" 
                  : "text-gray-500"
              }`}
            >
              {trendValue}
            </span>
            <span className="text-xs text-muted-foreground">{trend}</span>
            {trendDirection === "up" && <ArrowUpRight className="h-3 w-3 text-green-500 ml-1" />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Mock data - in a real application, this would be fetched from an API
const recentDoctorRegistrations = [
  { id: 1, name: "Dr. Emily Wilson", specialty: "Psychologist", status: "pending", date: "2023-06-15" },
  { id: 2, name: "Dr. James Rodriguez", specialty: "Psychiatrist", status: "approved", date: "2023-06-14" },
  { id: 3, name: "Dr. Sarah Chen", specialty: "Therapist", status: "pending", date: "2023-06-13" },
  { id: 4, name: "Dr. Michael Brown", specialty: "Counselor", status: "rejected", date: "2023-06-12" },
  { id: 5, name: "Dr. Lisa Taylor", specialty: "Child Psychologist", status: "approved", date: "2023-06-11" },
];

const recentAlerts = [
  { id: 1, type: "error", message: "Payment gateway timeout at 14:35", time: "2 hours ago" },
  { id: 2, type: "warning", message: "High server load detected", time: "4 hours ago" },
  { id: 3, type: "success", message: "Database backup completed successfully", time: "6 hours ago" },
  { id: 4, type: "error", message: "Failed login attempts from IP 192.168.1.123", time: "12 hours ago" },
  { id: 5, type: "warning", message: "System storage at 85% capacity", time: "1 day ago" },
];

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case "approved":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case "rejected":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-mindease-background">
      <AdminNavigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Monitor platform activity and manage operations</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value="2,843"
            description="Active platform users"
            icon={<Users className="h-4 w-4" />}
            trend="from last month"
            trendValue="+12.5%"
            trendDirection="up"
          />
          <StatCard
            title="Doctor Registrations"
            value="156"
            description="Verified healthcare providers"
            icon={<UserCheck className="h-4 w-4" />}
            trend="from last month"
            trendValue="+8.2%"
            trendDirection="up"
          />
          <StatCard
            title="Appointments"
            value="1,248"
            description="Total sessions booked"
            icon={<Calendar className="h-4 w-4" />}
            trend="from last month"
            trendValue="+15.3%"
            trendDirection="up"
          />
          <StatCard
            title="System Health"
            value="98.7%"
            description="Platform uptime"
            icon={<Activity className="h-4 w-4" />}
            trend="from last week"
            trendValue="+0.3%"
            trendDirection="up"
          />
        </div>
        
        <Tabs defaultValue="registrations" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="registrations">Doctor Registrations</TabsTrigger>
            <TabsTrigger value="system">System Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Doctor Registrations</CardTitle>
                <CardDescription>
                  Review and manage new healthcare provider sign-ups
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse text-center">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2.5"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Specialty</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentDoctorRegistrations.map((doctor) => (
                          <tr key={doctor.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{doctor.name}</td>
                            <td className="py-3 px-4">{doctor.specialty}</td>
                            <td className="py-3 px-4">{doctor.date}</td>
                            <td className="py-3 px-4">{getStatusBadge(doctor.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>
                  Recent system activity and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse text-center">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2.5"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start p-3 rounded-md bg-muted/40">
                        <div className="mr-3 mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
