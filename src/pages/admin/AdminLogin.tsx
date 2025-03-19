import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { Lock, AlertTriangle } from "lucide-react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (role === "user") {
        navigate("/dashboard", { replace: true });
      } else if (role === "doctor") {
        navigate("/doctor/dashboard", { replace: true });
      } else if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        // Handle unexpected roles (e.g., redirect to a default page or show an error)
        console.error("Unknown role:", role);
        alert("You do not have a valid role. Please contact support.");
        signOut(auth); // Sign out the user if their role is invalid
      }
    }
  }, [user, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await signInWithEmailAndPassword(auth, email, password);

      const user = success.user;

      if (user) {
        // Get the user's ID token to check their role
        const idTokenResult = await user.getIdTokenResult();
        const userRole = idTokenResult.claims.role; // Assuming the role is stored in the token claims

        // Redirect based on the user's role
        if (userRole === "user") {
          navigate("/dashboard", { replace: true });
        } else if (userRole === "doctor") {
          navigate("/doctor/dashboard", { replace: true });
        } else if (userRole === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          // Handle unexpected roles (e.g., redirect to a default page or show an error)
          console.error("Unknown role:", userRole);
          alert("You do not have a valid role. Please contact support.");
          await signOut(auth); // Sign out the user if their role is invalid
        }
      }

      if (success) {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials. Please check your email and password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mindease-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-semibold text-mindease-primary">
                Admin
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mindease.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
              {isLoading ? "Authenticating..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-6 flex items-center justify-center">
            <Lock className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground">
              Secure admin access only
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
