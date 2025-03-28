import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { User, Stethoscope } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("patient");
  const API = import.meta.env.VITE_API_URL_DEV;

  // Patient form state
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [patientConfirmPassword, setPatientConfirmPassword] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");

  const [mobile, setMobile] = useState("");
  // Doctor form state
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [doctorConfirmPassword, setDoctorConfirmPassword] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [doctorImage, setDoctorImage] = useState<File | null>(null);
  const [doctorSpecialtyId, setDoctorSpecialtyId] = useState("");
  const [doctorEducation, setDoctorEducation] = useState("");
  const [doctorExperience, setDoctorExperience] = useState("");
  const [doctorAbout, setDoctorAbout] = useState("");
  const [doctorImageUrl, setDoctorImageUrl] = useState<string | null>(null);

  // Check for role parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get("role");
    if (role === "doctor") {
      setActiveTab("doctor");
    }
  }, [location.search]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const specialties = [
    { title: "Psychologists", value: "psychologists" },
    { title: "Psychiatrists", value: "psychiatrists" },
    { title: "Therapists", value: "therapists" },
    { title: "Counselors", value: "counselors" },
    { title: "Child Psychologists", value: "child-psychologists" },
    { title: "Trauma Specialists", value: "trauma-specialists" },
    { title: "Addiction Specialists", value: "addiction-specialists" },
    { title: "CBT Therapists", value: "cbt-therapists" },
    { title: "Mindfulness Coaches", value: "mindfulness-coaches" },
    { title: "Life Coaches", value: "life-coaches" },
  ];

  const resetFields = () => {
    setPatientEmail("");
    setPatientConfirmPassword("");
    setPatientPassword("");
    setPatientFirstName("");
    setPatientLastName("");
    setMobile("");
    setDoctorEmail("");
    setDoctorPassword("");
    setDoctorConfirmPassword("");
    setDoctorName("");
    setDoctorSpecialty("");
    setDoctorLicense("");
    setDoctorImage(null);
    setDoctorSpecialtyId("");
    setDoctorEducation("");
    setDoctorExperience("");
    setDoctorAbout("");
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (patientPassword !== patientConfirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!patientEmail || !patientFirstName || !patientLastName) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Register the user with Firebase
      // Register the user with your API
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${patientFirstName} ${patientLastName}`,
          email: patientEmail,
          phoneNumber: mobile, // Add phone number if needed
          password: patientPassword,
          role: "user",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      toast({
        title: "Registration successful",
        description: "Your patient account has been created.",
      });

      // Log the user in automatically
      await signInWithEmailAndPassword(auth, patientEmail, patientPassword);
      resetFields();
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

  // Upload image to Cloudinary
  const handleImageUpload = async (file: File) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mindease"); // Using the same preset as in original code

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dvtcrhqhm/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Cloudinary Response:", data);

      return data.secure_url || null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDoctorImage(file);
      setDoctorImageUrl(URL.createObjectURL(file));
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (doctorPassword !== doctorConfirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    if (!doctorEmail || !doctorName || !doctorSpecialty || !doctorLicense) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (doctorImage) {
      const imageUrl = await handleImageUpload(doctorImage);
      if (imageUrl) {
        setDoctorImageUrl(imageUrl);
      } else {
        toast({
          title: "Image upload failed",
          description: "There was a problem uploading your image.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      // Register the doctor with Firebase
      // Register the doctor with your API
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: doctorName,
          email: doctorEmail,
          phoneNumber: mobile, // Add phone number if needed
          password: doctorPassword,
          role: "doctor",
          specialty: doctorSpecialty,
          license: doctorLicense,
          image: doctorImageUrl,
          specialtyId: doctorSpecialtyId,
          education: doctorEducation,
          experience: doctorExperience,
          about: doctorAbout,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register doctor");
      }

      toast({
        title: "Registration successful",
        description: "Your doctor account has been created.",
      });

      // Log the doctor in automatically
      await signInWithEmailAndPassword(auth, doctorEmail, doctorPassword);
      resetFields();
      // Navigate to doctor dashboard
      navigate("/doctor/dashboard");
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
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to create your MindEASE account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="patient"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Patient</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="doctor"
                    className="flex items-center gap-2"
                  >
                    <Stethoscope className="h-4 w-4" />
                    <span>Doctor</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="patient">
                  <form onSubmit={handlePatientSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={patientFirstName}
                            onChange={(e) =>
                              setPatientFirstName(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={patientLastName}
                            onChange={(e) => setPatientLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientEmail">Email</Label>
                        <Input
                          id="patientEmail"
                          type="email"
                          placeholder="john@example.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile</Label>
                        <Input
                          id="mobile"
                          placeholder="+91 1234567890"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientPassword">Password</Label>
                        <Input
                          id="patientPassword"
                          type="password"
                          value={patientPassword}
                          onChange={(e) => setPatientPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientConfirmPassword">
                          Confirm password
                        </Label>
                        <Input
                          id="patientConfirmPassword"
                          type="password"
                          value={patientConfirmPassword}
                          onChange={(e) =>
                            setPatientConfirmPassword(e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="patientTerms" required />
                        <label
                          htmlFor="patientTerms"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            className="text-mindease-primary hover:underline"
                          >
                            terms of service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            className="text-mindease-primary hover:underline"
                          >
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
                </TabsContent>

                <TabsContent value="doctor">
                  <form onSubmit={handleDoctorSubmit}>
                    <div className=" grid grid-cols-2 gap-10 w-full">
                      <div className="">
                        <Label htmlFor="doctorName">Full Name</Label>
                        <Input
                          id="doctorName"
                          placeholder="Dr. Jane Smith"
                          value={doctorName}
                          onChange={(e) => setDoctorName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="">
                        <Label htmlFor="mobile">Mobile</Label>
                        <Input
                          id="mobile"
                          placeholder="+91 1234567890"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          required
                        />
                      </div>
                      <div className="">
                        <Label htmlFor="doctorSpecialty">Specialty</Label>
                        <select
                          id="doctorSpecialty"
                          value={doctorSpecialty}
                          onChange={(e) => setDoctorSpecialty(e.target.value)}
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mindease-primary"
                          required
                        >
                          <option value="" disabled>
                            Select a specialty
                          </option>
                          {specialties.map((specialty) => (
                            <option
                              key={specialty.value}
                              value={specialty.value}
                            >
                              {specialty.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="">
                        <Label htmlFor="doctorLicense">License Number</Label>
                        <Input
                          id="doctorLicense"
                          placeholder="PSY12345"
                          value={doctorLicense}
                          onChange={(e) => setDoctorLicense(e.target.value)}
                          required
                        />
                      </div>

                      <div className="">
                        <Label htmlFor="doctorSpecialtyId">Specialty ID</Label>
                        <Input
                          id="doctorSpecialtyId"
                          placeholder="psychologists"
                          value={doctorSpecialtyId}
                          onChange={(e) => setDoctorSpecialtyId(e.target.value)}
                          required
                        />
                      </div>

                      <div className="">
                        <Label htmlFor="doctorEducation">Education</Label>
                        <Input
                          id="doctorEducation"
                          placeholder="PhD in Clinical Psychology, Stanford University"
                          value={doctorEducation}
                          onChange={(e) => setDoctorEducation(e.target.value)}
                          required
                        />
                      </div>
                      <div className="">
                        <Label htmlFor="doctorExperience">Experience</Label>
                        <Input
                          id="doctorExperience"
                          placeholder="15+ years in mental health counseling"
                          value={doctorExperience}
                          onChange={(e) => setDoctorExperience(e.target.value)}
                          required
                        />
                      </div>
                      <div className="">
                        <Label htmlFor="doctorAbout">About</Label>
                        <Input
                          id="doctorAbout"
                          placeholder="Dr. Richard James is a compassionate and experienced psychologist specializing in anxiety disorders, depression, and trauma recovery. He uses evidence-based approaches to help patients develop coping strategies and achieve mental wellness."
                          value={doctorAbout}
                          onChange={(e) => setDoctorAbout(e.target.value)}
                          required
                        />
                      </div>

                      <div className="">
                        <Label htmlFor="doctorImage">your Image </Label>
                        <Input
                          id="doctorImage"
                          type="file"
                          onChange={(e) => handleFileChange(e)}
                          required
                        />
                      </div>
                      {doctorImageUrl && (
                        <div className="mt-4">
                          <img
                            src={doctorImageUrl}
                            alt="Preview"
                            className="w-40 h-40 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div className="">
                        <Label htmlFor="doctorEmail">Email</Label>
                        <Input
                          id="doctorEmail"
                          type="email"
                          placeholder="doctor@mindease.com"
                          value={doctorEmail}
                          onChange={(e) => setDoctorEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="">
                        <Label htmlFor="doctorPassword">Password</Label>
                        <Input
                          id="doctorPassword"
                          type="password"
                          value={doctorPassword}
                          onChange={(e) => setDoctorPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="">
                        <Label htmlFor="doctorConfirmPassword">
                          Confirm password
                        </Label>
                        <Input
                          id="doctorConfirmPassword"
                          type="password"
                          value={doctorConfirmPassword}
                          onChange={(e) =>
                            setDoctorConfirmPassword(e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="flex w-full flex-col gap-4 col-span-2">
                        <div className="flex items-center space-x-2 w-full">
                          <Checkbox id="doctorTerms" required />
                          <label
                            htmlFor="doctorTerms"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the{" "}
                            <Link
                              to="/terms"
                              className="text-mindease-primary hover:underline"
                            >
                              terms of service
                            </Link>{" "}
                            and{" "}
                            <Link
                              to="/privacy"
                              className="text-mindease-primary hover:underline"
                            >
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
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  to={activeTab === "patient" ? "/login" : "/login?role=doctor"}
                  className="text-mindease-primary hover:underline"
                >
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
