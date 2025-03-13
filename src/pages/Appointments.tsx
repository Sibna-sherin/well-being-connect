import { useState } from "react";
import { Link } from "react-router-dom";
import UserNavigation from "@/components/UserNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, UserCog, UserRound, HeartHandshake, Baby, Bomb, Wine, Leaf, Sparkles } from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import { toast } from "@/hooks/use-toast";

interface SpecialtyInfo {
  id: string;
  title: string;
  icon: React.ReactNode;
  route: string;
}

const specialties: SpecialtyInfo[] = [
  { id: "psychologists", title: "Psychologists", icon: <Brain size={24} />, route: "/doctors/psychologists" },
  { id: "psychiatrists", title: "Psychiatrists", icon: <UserCog size={24} />, route: "/doctors/psychiatrists" },
  { id: "therapists", title: "Therapists", icon: <UserRound size={24} />, route: "/doctors/therapists" },
  { id: "counselors", title: "Counselors", icon: <HeartHandshake size={24} />, route: "/doctors/counselors" },
  { id: "child-psychologists", title: "Child Psychologists", icon: <Baby size={24} />, route: "/doctors/child-psychologists" },
  { id: "trauma-specialists", title: "Trauma Specialists", icon: <Bomb size={24} />, route: "/doctors/trauma-specialists" },
  { id: "addiction-specialists", title: "Addiction Specialists", icon: <Wine size={24} />, route: "/doctors/addiction-specialists" },
  { id: "cbt-therapists", title: "CBT Therapists", icon: <Brain size={24} />, route: "/doctors/cbt-therapists" },
  { id: "mindfulness-coaches", title: "Mindfulness Coaches", icon: <Leaf size={24} />, route: "/doctors/mindfulness-coaches" },
  { id: "life-coaches", title: "Life Coaches", icon: <Sparkles size={24} />, route: "/doctors/life-coaches" },
];

const topDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Psychologist",
    rating: 4.9,
    reviews: 124,
    image: "/lovable-uploads/doctorf.png",
    specialtyId: "psychologists"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Psychiatrist",
    rating: 4.8,
    reviews: 98,
    image: "/lovable-uploads/doctorf.png",
    specialtyId: "psychiatrists"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Therapist",
    rating: 4.7,
    reviews: 87,
    image: "/lovable-uploads/doctorf.png",
    specialtyId: "therapists"
  },
  {
    id: 4,
    name: "Dr. David Kim",
    specialty: "CBT Specialist",
    rating: 4.9,
    reviews: 112,
    image: "/lovable-uploads/doctorm.png",
    specialtyId: "cbt-therapists"
  },
];

const Appointments = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const handleSpecialtyClick = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    toast({
      title: "Specialty Selected",
      description: `You selected ${specialtyId}. You'll be redirected to specialists in this category.`,
    });
  };

  return (
    <div className="min-h-screen bg-mindease-background pb-12">
      <UserNavigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-gray-600 mb-8">Select a specialty to find the right mental health professional for your needs</p>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Choose by Specialty</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {specialties.map((specialty) => (
              <Link key={specialty.id} to={specialty.route}>
                <Card 
                  className={`h-full hover:shadow-md transition-all hover:scale-105 cursor-pointer ${
                    selectedSpecialty === specialty.id ? "border-mindease-primary ring-2 ring-mindease-primary/20" : ""
                  }`}
                  onClick={() => handleSpecialtyClick(specialty.id)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                    <div className="w-12 h-12 bg-mindease-primary/10 rounded-full flex items-center justify-center mb-3">
                      <div className="text-mindease-primary">{specialty.icon}</div>
                    </div>
                    <span className="text-center font-medium">{specialty.title}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Top Rated Professionals</h2>
            <Link to="/doctors">
              <Button variant="outline" className="border-mindease-primary text-mindease-primary hover:bg-mindease-primary hover:text-white">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </section>
        
        <section className="bg-mindease-primary rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6">
            <h2 className="text-2xl font-bold mb-2">Book Your Mental Wellness Session</h2>
            <p className="mb-4">Connect with over 100 trusted mental health professionals today</p>
            <Link to="/doctors">
              <Button className="bg-white text-mindease-primary hover:bg-white/90">
                Find Specialists
              </Button>
            </Link>
          </div>
          <div className="w-full md:w-1/3">
            <img 
              src="/lovable-uploads/footer.png" 
              alt="Mental health professional" 
              className="rounded-lg shadow-lg object-cover w-full max-h-48 md:max-h-full"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Appointments;
