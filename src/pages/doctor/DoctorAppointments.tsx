import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import DoctorNavigation from "@/components/DoctorNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Check, X, Clock, Calendar } from "lucide-react";

interface Appointment {
  id: string; // Firestore document ID
  patient: string;
  date: string;
  time: string;
  reason: string;
  status: "pending" | "confirmed" | "canceled" | "completed";
}

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments for the logged-in doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      try {
        const appointmentsCollection = collection(db, "appointments");
        const q = query(
          appointmentsCollection,
          where("doctorId", "==", user.uid) // Filter by doctorId
        );
        const querySnapshot = await getDocs(q);

        const appointmentsData: Appointment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          appointmentsData.push({
            id: doc.id,
            patient: data.patientName,
            date: data.date,
            time: data.time,
            reason: data.reason,
            status: data.status,
          });
        });

        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: "Failed to fetch appointments. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  // Update appointment status in Firestore
  const handleStatusChange = async (id: string, newStatus: "confirmed" | "canceled" | "completed") => {
    try {
      const appointmentRef = doc(db, "appointments", id);
      await updateDoc(appointmentRef, { status: newStatus });

      // Update local state
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? { ...appointment, status: newStatus } : appointment
        )
      );

      const patient = appointments.find((a) => a.id === id)?.patient;
      let message = "";
      if (newStatus === "confirmed") {
        message = `Appointment with ${patient} has been confirmed`;
      } else if (newStatus === "canceled") {
        message = `Appointment with ${patient} has been canceled`;
      } else if (newStatus === "completed") {
        message = `Appointment with ${patient} has been marked as completed`;
      }

      toast({
        title: "Appointment Updated",
        description: message,
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge based on appointment status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Confirmed
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Canceled
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mindease-background pb-12">
        <DoctorNavigation />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mindease-background pb-12">
      <DoctorNavigation />

      <div className="container mx-auto px-4 pt-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Appointments</h1>
            <p className="text-gray-600">Manage your patient appointments</p>
          </div>

          <div className="mt-4 md:mt-0">
            <Button className="flex items-center gap-2 bg-mindease-primary hover:bg-mindease-primary/90">
              <Calendar className="h-4 w-4" />
              Set Availability
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="space-y-4">
              {appointments
                .filter(
                  (app) =>
                    app.status === "confirmed" && new Date(app.date) >= new Date()
                )
                .map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{appointment.patient}</h3>
                              <p className="text-sm text-gray-500">
                                {formatDate(appointment.date)} at {appointment.time}
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>
                          <p className="mt-4 text-gray-700">{appointment.reason}</p>

                          <div className="mt-6 flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, "completed")}
                              className="flex items-center gap-1"
                            >
                              <Check className="h-4 w-4" />
                              Complete
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, "canceled")}
                              className="text-red-500 border-red-200 hover:bg-red-50 flex items-center gap-1"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {appointments.filter(
                (app) =>
                  app.status === "confirmed" && new Date(app.date) >= new Date()
              ).length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No upcoming appointments</h3>
                  <p className="text-gray-600">You don't have any confirmed appointments yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-4">
              {appointments
                .filter((app) => app.status === "pending")
                .map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{appointment.patient}</h3>
                              <p className="text-sm text-gray-500">
                                {formatDate(appointment.date)} at {appointment.time}
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>
                          <p className="mt-4 text-gray-700">{appointment.reason}</p>

                          <div className="mt-6 flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, "confirmed")}
                              className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                            >
                              <Check className="h-4 w-4" />
                              Accept
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, "canceled")}
                              className="text-red-500 border-red-200 hover:bg-red-50 flex items-center gap-1"
                            >
                              <X className="h-4 w-4" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {appointments.filter((app) => app.status === "pending").length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No pending requests</h3>
                  <p className="text-gray-600">You don't have any appointment requests to review</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="space-y-4">
              {appointments
                .filter(
                  (app) =>
                    app.status === "completed" ||
                    app.status === "canceled" ||
                    (app.status === "confirmed" && new Date(app.date) < new Date())
                )
                .map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{appointment.patient}</h3>
                              <p className="text-sm text-gray-500">
                                {formatDate(appointment.date)} at {appointment.time}
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>
                          <p className="mt-4 text-gray-700">{appointment.reason}</p>

                          <div className="mt-6">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Clock className="h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {appointments.filter(
                (app) =>
                  app.status === "completed" ||
                  app.status === "canceled" ||
                  (app.status === "confirmed" && new Date(app.date) < new Date())
              ).length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No past appointments</h3>
                  <p className="text-gray-600">Your appointment history will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorAppointments;