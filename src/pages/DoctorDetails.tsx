
import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Star, Check, BadgeCheck } from "lucide-react";
import DoctorCard from "@/components/DoctorCard";

// Mock data for related doctors
const relatedDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Psychologist",
    rating: 4.9,
    reviews: 124,
    image: "/lovable-uploads/14fee741-0aa3-4eaa-9c4f-62d516b188a4.png",
    specialtyId: "psychologists"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Psychiatrist",
    rating: 4.8,
    reviews: 98,
    image: "/lovable-uploads/2c9db039-703a-4cba-8db3-60741bc93a3f.png",
    specialtyId: "psychiatrists"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Therapist",
    rating: 4.7,
    reviews: 87,
    image: "/lovable-uploads/14fee741-0aa3-4eaa-9c4f-62d516b188a4.png",
    specialtyId: "therapists"
  },
];

// Mock data for time slots
const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", 
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const DoctorDetails = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Mock doctor data (would normally be fetched based on id)
  const doctor = {
    id: Number(id),
    name: "Dr. Richard James",
    specialty: "Clinical Psychologist",
    rating: 4.9,
    reviews: 124,
    image: "/lovable-uploads/14fee741-0aa3-4eaa-9c4f-62d516b188a4.png",
    specialtyId: "psychologists",
    verified: true,
    education: "PhD in Clinical Psychology, Stanford University",
    experience: "15+ years in mental health counseling",
    about: "Dr. Richard James is a compassionate and experienced psychologist specializing in anxiety disorders, depression, and trauma recovery. He uses evidence-based approaches to help patients develop coping strategies and achieve mental wellness."
  };

  const handleBookAppointment = () => {
    if (date && selectedTimeSlot) {
      console.log("Booking appointment for:", {
        doctor: doctor.name,
        date: format(date, "PPP"),
        time: selectedTimeSlot
      });
      // Here you would typically make an API call to book the appointment
      // For now, let's just log the data
    }
  };

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
                    {doctor.verified && <BadgeCheck size={16} className="text-mindease-primary" />}
                  </h1>
                  <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                  
                  <div className="flex items-center mb-4">
                    <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4 mr-1" />
                    <span className="font-medium">{doctor.rating}</span>
                    <span className="text-xs ml-1 text-gray-500">({doctor.reviews} reviews)</span>
                  </div>
                  
                  <div className="w-full space-y-4 mb-6">
                    <div className="flex items-start">
                      <Check size={16} className="text-mindease-primary mr-2 mt-1" />
                      <div>
                        <p className="font-medium">Education</p>
                        <p className="text-sm text-gray-600">{doctor.education}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check size={16} className="text-mindease-primary mr-2 mt-1" />
                      <div>
                        <p className="font-medium">Experience</p>
                        <p className="text-sm text-gray-600">{doctor.experience}</p>
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
                  Select a date and time slot to schedule your appointment with {doctor.name}
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
                  <h3 className="text-lg font-medium mb-3">Available Time Slots</h3>
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
            
            {/* Related Doctors Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Related Specialists</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
