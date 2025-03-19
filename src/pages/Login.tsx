
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Stethoscope } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<string>("patient");

  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from?.pathname || 
    (activeTab === "patient" ? "/dashboard" : "/doctor/dashboard");

  // Check for role parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role');
    if (role === 'doctor') {
      setActiveTab('doctor');
    }
  }, [location.search]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let success;
      
      if (activeTab === "patient") {
        // success = await userLogin(email, password);
         //if (success) {
          //navigate("/dashboard", { replace: true });
       // }
      } else {
        // success = await doctorLogin(email, password);
        if (success) {
          navigate("/doctor/dashboard", { replace: true });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mindease-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="patient" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Patient</span>
                  </TabsTrigger>
                  <TabsTrigger value="doctor" className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    <span>Doctor</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="patient">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="john@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link to="/forgot-password" className="text-sm text-mindease-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <Input 
                          id="password" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-mindease-primary hover:bg-mindease-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign in"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="doctor">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-email">Email</Label>
                        <Input 
                          id="doctor-email" 
                          type="email" 
                          placeholder="doctor@mindease.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="doctor-password">Password</Label>
                          <Link to="/forgot-password" className="text-sm text-mindease-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <Input 
                          id="doctor-password" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-mindease-primary hover:bg-mindease-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign in"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link to={activeTab === "patient" ? "/register" : "/register?role=doctor"} className="text-mindease-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
