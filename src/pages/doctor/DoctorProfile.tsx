import { useState } from "react";
import DoctorNavigation from "@/components/DoctorNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { User, Mail, BookOpen, Award, Building } from "lucide-react";

const DoctorProfile = () => {
  const { userData } = useAuth();

  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: "+1 (555) 123-4567",
    specialty: userData?.specialty || "Psychologist",
    education: "Ph.D. in Psychology, Stanford University",
    experience: "10+ years in clinical psychology",
    about:
      "Experienced psychologist specializing in cognitive behavioral therapy, anxiety disorders, and depression. I believe in a holistic approach to mental health, combining evidence-based techniques with compassionate care.",
    address: "123 Medical Center Blvd, Suite 456, San Francisco, CA 94143",
    languages: "English, Spanish",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-mindease-background pb-12">
      <DoctorNavigation />

      <div className="container mx-auto px-4 pt-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Doctor Profile</h1>
            <p className="text-gray-600">
              Manage your professional information
            </p>
          </div>

          {/* <div className="mt-4 md:mt-0">
            <Button 
              onClick={handleSave}
              className="bg-mindease-primary hover:bg-mindease-primary/90"
            >
              Save Changes
            </Button>
          </div> */}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-mindease-primary flex items-center justify-center text-white text-3xl mb-4">
                  {formData.name.charAt(0)}
                </div>
                {/* <Button variant="outline" className="w-full">Change Photo</Button> */}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">{formData.email}</p>
                    <p className="text-sm text-gray-500">Email</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">{formData.phone}</p>
                    <p className="text-sm text-gray-500">Phone</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Building className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">{formData.address}</p>
                    <p className="text-sm text-gray-500">Office Address</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      disabled={true}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      disabled={true}
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      disabled={true}
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      disabled={true}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages</Label>
                    <Input
                      disabled={true}
                      id="languages"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                    <Input
                      disabled={true}
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-gray-500 mr-2" />
                    <Input
                      disabled={true}
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    disabled={true}
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
