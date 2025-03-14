
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Simulate registration - in a real app this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      // Log the user in automatically
      await login(email, password);
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was a problem creating your account.",
        variant: "destructive",
      });
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
              <CardTitle className="text-2xl text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your information to create your MindEASE account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
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
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-mindease-primary hover:underline">
                        terms of service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-mindease-primary hover:underline">
                        privacy policy
                      </Link>
                    </label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-mindease-primary hover:bg-mindease-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-mindease-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
