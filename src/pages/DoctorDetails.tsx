import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import UserNavigation from "@/components/UserNavigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  MapPin,
  Star,
  Check,
  BadgeCheck,
  Mail,
} from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebase"; // Import Firestore instance
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore"; // Firestore functions

// Mock data for time slots
const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const DoctorDetails = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const { user, userData } = useAuth();
  const [doctor, setDoctor] = useState<any>(null); // State to store doctor details
  const [relatedDoctors, setRelatedDoctors] = useState<any[]>([]); // State to store related doctors

  // Fetch doctor details from Firestore
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;

      try {
        const doctorDoc = await getDoc(doc(db, "users", id));
        if (doctorDoc.exists()) {
          setDoctor({ id: doctorDoc.id, ...doctorDoc.data() });
          fetchRelatedDoctors(doctorDoc.data().specialty);
        } else {
          toast({
            title: "Doctor Not Found",
            description: "The doctor you are looking for does not exist.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast({
          title: "Error",
          description: "Failed to fetch doctor details.",
          variant: "destructive",
        });
      }
    };

    fetchDoctor();
  }, [id]);

  const fetchRelatedDoctors = async (specialty) => {
    try {
      const doctorsSnapshot = await getDocs(
        query(
          collection(db, "doctors"),
          where("specialty", "==", specialty),
          limit(3)
        )
      );
      const doctorsData = doctorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRelatedDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching related doctors:", error);
    }
  };

  const handleBookAppointment = () => {
    if (date && selectedTimeSlot) {
      setIsConfirmDialogOpen(true);
    }
  };

  const confirmBooking = async () => {
    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email address",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      // Add appointment data to Firestore
      const appointmentsCollection = collection(db, "appointments");
      const appointmentRef = await addDoc(appointmentsCollection, {
        doctorId: doctor.id,
        doctorName: doctor.name,
        patientName: name,
        patientEmail: email,
        patientPhone: phone,
        date: format(date!, "yyyy-MM-dd"),
        time: selectedTimeSlot,
        status: "booked", // You can add more statuses like "completed", "cancelled", etc.
        createdAt: new Date().toISOString(),
      });

      // Add the appointment ID to the user's document in Firestore
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          appointments: arrayUnion(appointmentRef.id), // Add the appointment ID to the user's appointments array
        });
      }

      // Close the dialog
      setIsConfirmDialogOpen(false);
      setIsBooking(false);

      // Show success message
      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${doctor.name} on ${format(
          date!,
          "PPP"
        )} at ${selectedTimeSlot} has been booked. A confirmation email has been sent to ${email}.`,
      });

      // Clear form state
      setDate(undefined);
      setSelectedTimeSlot(null);
      setName("");
      setEmail("");
      setPhone("");

      // Simulate sending an email
      console.log("Sending confirmation email to:", email, {
        doctor: doctor.name,
        date: format(date!, "PPP"),
        time: selectedTimeSlot,
        patientName: name,
        patientPhone: phone,
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description:
          "There was an issue booking your appointment. Please try again.",
        variant: "destructive",
      });
      setIsBooking(false);
    }
  };

  if (!doctor) {
    return <div>Loading...</div>; // Show loading state while fetching doctor details
  }

  return (
    <div className="min-h-screen bg-mindease-background pb-12">
      <UserNavigation />

      <div className="container mx-auto px-4 pt-24">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Doctor Profile Section */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    {doctor.verified && (
                      <div className="absolute bottom-2 right-2 bg-mindease-primary text-white rounded-full p-1">
                        <BadgeCheck size={20} />
                      </div>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {doctor.name}
                    {doctor.verified && (
                      <BadgeCheck size={16} className="text-mindease-primary" />
                    )}
                  </h1>
                  <p className="text-gray-600 mb-2">{doctor.specialty}</p>

                  <div className="flex items-center mb-4">
                    <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4 mr-1" />
                    <span className="font-medium">{doctor.rating}</span>
                    <span className="text-xs ml-1 text-gray-500">
                      ({doctor.reviews} reviews)
                    </span>
                  </div>

                  <div className="w-full space-y-4 mb-6">
                    <div className="flex items-start">
                      <Check
                        size={16}
                        className="text-mindease-primary mr-2 mt-1"
                      />
                      <div>
                        <p className="font-medium">Education</p>
                        <p className="text-sm text-gray-600">
                          {doctor.education}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check
                        size={16}
                        className="text-mindease-primary mr-2 mt-1"
                      />
                      <div>
                        <p className="font-medium">Experience</p>
                        <p className="text-sm text-gray-600">
                          {doctor.experience}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-sm text-gray-700">{doctor.about}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
                <CardDescription>
                  Select a date and time slot to schedule your appointment with{" "}
                  {doctor.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Select Date</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3">
                    Available Time Slots
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        className={cn(
                          "justify-center",
                          selectedTimeSlot === time
                            ? "bg-mindease-primary text-white hover:bg-mindease-primary/90"
                            : "hover:bg-mindease-primary/10"
                        )}
                        onClick={() => setSelectedTimeSlot(time)}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-mindease-primary hover:bg-mindease-primary/90 py-6 h-auto text-lg"
                  onClick={handleBookAppointment}
                  disabled={!date || !selectedTimeSlot}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog
              open={isConfirmDialogOpen}
              onOpenChange={setIsConfirmDialogOpen}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirm Your Appointment</DialogTitle>
                  <DialogDescription>
                    Please provide your details to book an appointment with{" "}
                    {doctor.name} on {date ? format(date, "PPP") : ""} at{" "}
                    {selectedTimeSlot}.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsConfirmDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmBooking}
                    className="bg-mindease-primary hover:bg-mindease-primary/90"
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Confirm & Send Email
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Related Doctors Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">
                Related Specialists
              </h2>
              {relatedDoctors.length === 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {relatedDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
              ): (
                <div className="flex items-center justify-center h-32 bg-white rounded-md shadow-md">
                  No related doctors found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
