import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase"; // Adjust the path accordingly
import AdminNavigation from "@/components/AdminNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Users, 
  Calendar,
  ArrowUpRight, 
  ArrowDownRight,
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
            {trendDirection === "down" && <ArrowDownRight className="h-3 w-3 text-red-500 ml-1" />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recentDoctorRegistrations, setRecentDoctorRegistrations] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    doctorCount: 0,
    appointmentCount: 0,
    systemHealth: 98.7,
    userGrowth: 0,
    doctorGrowth: 0,
    appointmentGrowth: 0
  });

  // Function to get data from the previous month
  const getPreviousMonthData = async (collectionName, roleFilter = null) => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
    
    const q = roleFilter ? 
      query(
        collection(db, collectionName), 
        where("createdAt", ">=", startOfLastMonth),
        where("createdAt", "<=", endOfLastMonth),
        where("role", "==", roleFilter)
      ) : 
      query(
        collection(db, collectionName), 
        where("createdAt", ">=", startOfLastMonth),
        where("createdAt", "<=", endOfLastMonth)
      );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get recent doctor registrations
        const doctorsSnapshot = await getDocs(collection(db, "users"));
        const userDocs = doctorsSnapshot.docs;
        
        // Filter doctor users
        const doctorDocs = userDocs
          .filter(doc => doc.data().role === "doctor")
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentDoctorRegistrations(doctorDocs);
        
        // Get system alerts
        const alertsSnapshot = await getDocs(collection(db, "alerts"));
        const alertsData = alertsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentAlerts(alertsData);
        
        // Get counts for dashboard stats
        const totalUsers = userDocs.filter(doc => doc.data().role === "user").length;
        const doctorCount = doctorDocs.length;
        
        const appointmentsSnapshot = await getDocs(collection(db, "appointments"));
        const appointmentCount = appointmentsSnapshot.size;
        
        // Set stats directly with static growth values or remove them
        setStats({
          totalUsers,
          doctorCount,
          appointmentCount,
          systemHealth: 98.7,
          userGrowth: 12.5, // Static value or you can remove these
          doctorGrowth: 8.2, // Static value or you can remove these
          appointmentGrowth: 15.3 // Static value or you can remove these
        });
        
        console.log("Stats updated:", {
          totalUsers,
          doctorCount,
          appointmentCount
        });
        
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
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

  const getAlertIcon = (type) => {
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

  // Helper function to format date or return placeholder
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    
    // If timestamp is a Firestore timestamp, use toDate()
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
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
            value={isLoading ? "Loading..." : stats.totalUsers.toLocaleString()}
            description="Active platform users"
            icon={<Users className="h-4 w-4" />}
            trend="from last month"
            trendValue={`${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}%`}
            trendDirection={stats.userGrowth > 0 ? "up" : stats.userGrowth < 0 ? "down" : "neutral"}
          />
          <StatCard
            title="Doctor Registrations"
            value={isLoading ? "Loading..." : stats.doctorCount.toLocaleString()}
            description="Verified healthcare providers"
            icon={<UserCheck className="h-4 w-4" />}
            trend="from last month"
            trendValue={`${stats.doctorGrowth > 0 ? '+' : ''}${stats.doctorGrowth}%`}
            trendDirection={stats.doctorGrowth > 0 ? "up" : stats.doctorGrowth < 0 ? "down" : "neutral"}
          />
          <StatCard
            title="Appointments"
            value={isLoading ? "Loading..." : stats.appointmentCount.toLocaleString()}
            description="Total sessions booked"
            icon={<Calendar className="h-4 w-4" />}
            trend="from last month"
            trendValue={`${stats.appointmentGrowth > 0 ? '+' : ''}${stats.appointmentGrowth}%`}
            trendDirection={stats.appointmentGrowth > 0 ? "up" : stats.appointmentGrowth < 0 ? "down" : "neutral"}
          />
          <StatCard
            title="System Health"
            value={`${stats.systemHealth}%`}
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
                ) : recentDoctorRegistrations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No doctor registrations found</p>
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
                            <td className="py-3 px-4">{doctor.name || "N/A"}</td>
                            <td className="py-3 px-4">{doctor.specialty || "N/A"}</td>
                            <td className="py-3 px-4">{formatDate(doctor.createdAt)}</td>
                            <td className="py-3 px-4">{getStatusBadge(doctor.status || "pending")}</td>
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
                ) : recentAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No system alerts found</p>
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
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(alert.createdAt) || alert.time || "N/A"}</p>
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