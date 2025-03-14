
import { useState, useEffect } from "react";
import AdminNavigation from "@/components/AdminNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  Database, 
  Server, 
  BarChart, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Shield,
  RefreshCw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for charts
const performanceData = {
  cpu: [65, 72, 45, 80, 50, 68, 55, 63, 75, 42, 58, 69],
  memory: [45, 52, 60, 41, 58, 63, 48, 55, 70, 62, 49, 57],
  storage: [25, 28, 32, 30, 34, 27, 29, 33, 31, 26, 28, 30],
  network: [120, 180, 90, 210, 150, 135, 160, 195, 140, 110, 170, 155],
};

const recentIssues = [
  { id: 1, type: "error", title: "Payment Gateway Error", message: "Timeout occurred during payment processing", time: "2 hours ago", resolved: false },
  { id: 2, type: "warning", title: "High Server Load", message: "Server load exceeded 80% for 15 minutes", time: "4 hours ago", resolved: true },
  { id: 3, type: "error", title: "Database Connection Failed", message: "Temporary connection lost to user database", time: "8 hours ago", resolved: true },
  { id: 4, type: "error", title: "File Storage Error", message: "Cannot write to file storage - permission denied", time: "1 day ago", resolved: true },
  { id: 5, type: "warning", title: "Low Disk Space", message: "System storage approaching capacity limit", time: "2 days ago", resolved: false },
];

const SystemMonitoring = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    overall: "healthy", // healthy, warning, critical
    services: {
      website: "healthy",
      api: "healthy",
      database: "healthy",
      storage: "warning",
      auth: "healthy",
      payments: "warning",
    },
    metrics: {
      uptime: "99.8%",
      responseTime: "248ms",
      errorRate: "0.3%",
      userSessions: "843",
      cpuUsage: "42%",
      memoryUsage: "58%",
    }
  });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "System data refreshed",
        description: "All monitoring information has been updated.",
      });
    }, 2000);
  };

  const handleResolveIssue = (issueId: number) => {
    // In a real application, this would call an API to resolve the issue
    toast({
      title: "Issue marked as resolved",
      description: "The issue has been marked as resolved and is now being tracked in history.",
    });
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium text-green-700">Healthy</span>
          </div>
        );
      case "warning":
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm font-medium text-yellow-700">Warning</span>
          </div>
        );
      case "critical":
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm font-medium text-red-700">Critical</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-mindease-background">
      <AdminNavigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Monitoring</h1>
            <p className="text-gray-600">Monitor performance and resolve issues</p>
          </div>
          <Button 
            onClick={handleRefresh} 
            className="mt-4 sm:mt-0"
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className={`border-l-4 ${
            systemStatus.overall === 'healthy' 
              ? 'border-l-green-500' 
              : systemStatus.overall === 'warning' 
              ? 'border-l-yellow-500' 
              : 'border-l-red-500'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Server className="mr-2 h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize mb-1">{systemStatus.overall}</div>
              <p className="text-sm text-muted-foreground">
                Last checked: {new Date().toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatus.metrics.responseTime}</div>
              <p className="text-sm text-muted-foreground">
                Average API response time
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Error Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatus.metrics.errorRate}</div>
              <p className="text-sm text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="services" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Health</CardTitle>
                <CardDescription>
                  Current status of all platform services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(systemStatus.services).map(([service, status]) => (
                        <div key={service} className="flex justify-between items-center p-3 border rounded">
                          <div className="flex items-center">
                            {service === 'website' && <Globe className="h-5 w-5 mr-3 text-gray-500" />}
                            {service === 'api' && <Server className="h-5 w-5 mr-3 text-gray-500" />}
                            {service === 'database' && <Database className="h-5 w-5 mr-3 text-gray-500" />}
                            {service === 'storage' && <HardDrive className="h-5 w-5 mr-3 text-gray-500" />}
                            {service === 'auth' && <Lock className="h-5 w-5 mr-3 text-gray-500" />}
                            {service === 'payments' && <CreditCard className="h-5 w-5 mr-3 text-gray-500" />}
                            <span className="capitalize">{service}</span>
                          </div>
                          {getStatusIndicator(status)}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">System Metrics</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-muted/40 p-4 rounded">
                          <div className="text-sm text-muted-foreground mb-1">Uptime</div>
                          <div className="text-xl font-semibold">{systemStatus.metrics.uptime}</div>
                        </div>
                        <div className="bg-muted/40 p-4 rounded">
                          <div className="text-sm text-muted-foreground mb-1">CPU Usage</div>
                          <div className="text-xl font-semibold">{systemStatus.metrics.cpuUsage}</div>
                        </div>
                        <div className="bg-muted/40 p-4 rounded">
                          <div className="text-sm text-muted-foreground mb-1">Memory Usage</div>
                          <div className="text-xl font-semibold">{systemStatus.metrics.memoryUsage}</div>
                        </div>
                        <div className="bg-muted/40 p-4 rounded">
                          <div className="text-sm text-muted-foreground mb-1">Active Users</div>
                          <div className="text-xl font-semibold">{systemStatus.metrics.userSessions}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  System resource utilization over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-8">
                    <div className="h-48 bg-gray-200 rounded w-full"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-muted/40 p-6 rounded-lg">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <BarChart className="mr-2 h-5 w-5" />
                        Resource Usage (Last 12 Hours)
                      </h3>
                      <div className="h-64 w-full">
                        {/* This would be a recharts component in a real application */}
                        <div className="h-full w-full flex items-end justify-between gap-1">
                          {performanceData.cpu.map((value, index) => (
                            <div 
                              key={index} 
                              className="bg-mindease-primary/80 rounded-t w-full"
                              style={{ height: `${value}%` }}
                              title={`CPU Usage: ${value}%`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-mindease-primary/80 mr-2"></div>
                          <span className="text-sm">CPU Usage</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-400 mr-2"></div>
                          <span className="text-sm">Memory Usage</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-amber-400 mr-2"></div>
                          <span className="text-sm">Storage I/O</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-400 mr-2"></div>
                          <span className="text-sm">Network Traffic</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-muted/40 p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Peak Times (Users)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Morning (8AM - 12PM)</span>
                            <span className="text-sm font-medium">32%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-mindease-primary h-2 rounded-full" style={{ width: "32%" }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm">Afternoon (12PM - 5PM)</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-mindease-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm">Evening (5PM - 10PM)</span>
                            <span className="text-sm font-medium">68%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-mindease-primary h-2 rounded-full" style={{ width: "68%" }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm">Night (10PM - 8AM)</span>
                            <span className="text-sm font-medium">21%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-mindease-primary h-2 rounded-full" style={{ width: "21%" }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/40 p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Response Time Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">API Endpoints</span>
                            <span className="text-sm font-medium">120ms</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm">Database Queries</span>
                            <span className="text-sm font-medium">85ms</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm">Authentication</span>
                            <span className="text-sm font-medium">25ms</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm">External Services</span>
                            <span className="text-sm font-medium">54ms</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>System Issues</CardTitle>
                <CardDescription>
                  Active and recently resolved system issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded w-full"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Active Issues</h3>
                    <div className="space-y-3">
                      {recentIssues
                        .filter(issue => !issue.resolved)
                        .map(issue => (
                          <div key={issue.id} className="border rounded-md p-4 relative">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                {issue.type === "error" ? (
                                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                )}
                                <div>
                                  <h4 className="font-medium">{issue.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{issue.message}</p>
                                  <div className="text-xs text-gray-500 mt-2">Detected {issue.time}</div>
                                </div>
                              </div>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => handleResolveIssue(issue.id)}
                              >
                                Mark Resolved
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                      {recentIssues.filter(issue => !issue.resolved).length === 0 && (
                        <div className="text-center py-6">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                          <h4 className="text-lg font-medium">All Clear!</h4>
                          <p className="text-sm text-muted-foreground mt-1">No active issues at the moment</p>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-medium">Recently Resolved</h3>
                    <div className="space-y-3">
                      {recentIssues
                        .filter(issue => issue.resolved)
                        .map(issue => (
                          <div key={issue.id} className="border border-muted rounded-md p-4 bg-muted/20">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium">{issue.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{issue.message}</p>
                                <div className="text-xs text-gray-500 mt-2">Resolved {issue.time}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
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

// Additional icons for the services section
const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const HardDrive = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="12" x2="2" y2="12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    <line x1="6" y1="16" x2="6.01" y2="16" />
    <line x1="10" y1="16" x2="10.01" y2="16" />
  </svg>
);

const Lock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CreditCard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

export default SystemMonitoring;
