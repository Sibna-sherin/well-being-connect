
import DoctorNavigation from "@/components/DoctorNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDoctor } from "@/contexts/DoctorContext";
import { Calendar, Clock, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const { doctorData } = useDoctor();

  return (
    <div className="min-h-screen bg-mindease-background pb-12">
      <DoctorNavigation />
      
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-2">Welcome, Dr. {doctorData?.name}</h1>
        <p className="text-gray-600 mb-8">Here's your dashboard overview</p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-mindease-primary" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-gray-500 mt-1">2 upcoming</p>
              <Button asChild className="w-full mt-4 bg-mindease-primary hover:bg-mindease-primary/90">
                <Link to="/doctor/appointments">View Schedule</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-mindease-primary" />
                Active Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
              <p className="text-sm text-gray-500 mt-1">3 new this week</p>
              <Button asChild className="w-full mt-4 bg-mindease-primary hover:bg-mindease-primary/90">
                <Link to="/doctor/patients">View Patients</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5 text-mindease-primary" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">Mon-Fri</p>
              <p className="text-sm text-gray-500 mt-1">9:00 AM - 5:00 PM</p>
              <Button asChild className="w-full mt-4 bg-mindease-primary hover:bg-mindease-primary/90">
                <Link to="/doctor/availability">Manage Hours</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-mindease-primary" />
                Consultation Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$150</p>
              <p className="text-sm text-gray-500 mt-1">Per session</p>
              <Button asChild className="w-full mt-4 bg-mindease-primary hover:bg-mindease-primary/90">
                <Link to="/doctor/profile">Update Fees</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
