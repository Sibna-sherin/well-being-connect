
import { Brain, Heart, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import FeatureCard from "@/components/FeatureCard";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import { Link } from "react-router-dom";
import DoctorCard from "@/components/DoctorCard";

// Mock data for top doctors
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
    image: "/lovable-uploads/doctorm.png",
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
  {
    id: 5,
    name: "Dr. Jennifer Lee",
    specialty: "Child Psychologist",
    rating: 4.8,
    reviews: 75,
    image: "/lovable-uploads/doctorf.png",
    specialtyId: "child-psychologists"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-mindease-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center animate-fade-down">
          <div className="md:w-1/2 text-left mb-8 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Book Appointment<br />
              <span className="text-mindease-primary">With Trusted Specialists</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Connect with qualified mental health professionals who can help you navigate life's challenges.
            </p>
            <Link to="/appointments">
              <Button className="bg-mindease-primary hover:bg-mindease-primary/90 text-lg px-8 py-6 h-auto">
                BOOK AN APPOINTMENT
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <div className="bg-mindease-primary rounded-2xl overflow-hidden">
              <img 
                src="/lovable-uploads/hero.png" 
                alt="Mental health professionals" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="Professional Support"
              description="Connect with licensed professionals specialized in various mental health areas."
              className="animate-fade-up"
            />
            <FeatureCard
              icon={Heart}
              title="Personalized Care"
              description="Get matched with professionals who understand your specific needs and concerns."
              className="animate-fade-up [animation-delay:200ms]"
            />
            <FeatureCard
              icon={Users}
              title="Secure Environment"
              description="Your privacy and security are our top priorities in every session."
              className="animate-fade-up [animation-delay:400ms]"
            />
          </div>
        </div>
      </section>
      
      {/* Specialties Section */}
      <SpecialtiesSection />
      
      {/* Top Doctors Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Top Specialists to Book</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our highly rated mental health professionals are ready to help you on your journey to wellness
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {topDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/doctors">
              <Button variant="outline" className="border-mindease-primary text-mindease-primary hover:bg-mindease-primary hover:text-white">
                View All Specialists
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-mindease-primary rounded-xl p-8 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 text-white mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold mb-4">Book Appointment With 100+ Trusted Specialists</h2>
              <p className="mb-6 text-white/90">
                Take the first step towards better mental health by connecting with our trusted specialists
              </p>
              <Link to="/appointments">
                <Button className="bg-white text-mindease-primary hover:bg-white/90">
                  BOOK AN APPOINTMENT
                </Button>
              </Link>
            </div>
            <div className="md:w-1/3">
              <img 
                src="/lovable-uploads/footer.png" 
                alt="Mental health professional" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
