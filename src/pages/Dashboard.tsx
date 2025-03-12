
import UserNavigation from "@/components/UserNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User as UserIcon, Edit } from "lucide-react";
import { useState } from "react";

// Mock data for the dashboard
const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    speciality: "Psychologist",
    date: "2023-12-10",
    time: "10:00 AM",
    status: "confirmed"
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    speciality: "Psychiatrist",
    date: "2023-12-15",
    time: "2:30 PM",
    status: "pending"
  }
];

const pastAppointments = [
  {
    id: 3,
    doctor: "Dr. Emily Roberts",
    speciality: "Therapist",
    date: "2023-11-28",
    time: "11:00 AM",
    status: "completed",
    notes: "Follow-up in two weeks"
  },
  {
    id: 4,
    doctor: "Dr. James Wilson",
    speciality: "CBT Therapist",
    date: "2023-11-20",
    time: "3:00 PM",
    status: "completed",
    notes: "Recommended daily mindfulness practice"
  }
];

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8901",
    dob: "1990-05-15",
    address: "123 Main St, Anytown, USA"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(userProfile);
  
  const handleProfileSave = () => {
    setUserProfile(editableProfile);
    setIsEditing(false);
    // In a real app, you would make an API call here
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="min-h-screen bg-mindease-background pb-12">
      <UserNavigation />
      
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Welcome, {userProfile.name}</h1>
        
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="appointments">My Appointments</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-mindease-primary" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>Your scheduled sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map(appointment => (
                      <div key={appointment.id} className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{appointment.doctor}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{appointment.speciality}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-3">{appointment.date}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-mindease-primary border-mindease-primary hover:bg-mindease-primary hover:text-white"
                          >
                            Reschedule
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No upcoming appointments</p>
                      <Button className="mt-4 bg-mindease-primary hover:bg-mindease-primary/90">
                        Book an Appointment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Past Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-mindease-primary" />
                    Past Appointments
                  </CardTitle>
                  <CardDescription>Your appointment history</CardDescription>
                </CardHeader>
                <CardContent>
                  {pastAppointments.length > 0 ? (
                    pastAppointments.map(appointment => (
                      <div key={appointment.id} className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{appointment.doctor}</h3>
                          <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                            {appointment.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{appointment.speciality}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-3">{appointment.date}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{appointment.time}</span>
                        </div>
                        {appointment.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                            <strong>Notes:</strong> {appointment.notes}
                          </div>
                        )}
                        <div className="mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-mindease-primary border-mindease-primary hover:bg-mindease-primary hover:text-white"
                          >
                            Book Follow-up
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No past appointments</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <UserIcon className="mr-2 h-5 w-5 text-mindease-primary" />
                    Personal Information
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-mindease-primary"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
                <CardDescription>Manage your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editableProfile.name}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editableProfile.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={editableProfile.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          value={editableProfile.dob}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={editableProfile.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mt-1"
                      />
                    </div>
                    <Button 
                      onClick={handleProfileSave}
                      className="mt-2 bg-mindease-primary hover:bg-mindease-primary/90"
                    >
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p>{userProfile.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p>{userProfile.email}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                        <p>{userProfile.phone}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                        <p>{userProfile.dob}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p>{userProfile.address}</p>
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

export default Dashboard;
