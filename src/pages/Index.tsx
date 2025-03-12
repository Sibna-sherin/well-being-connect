
import { Brain, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import FeatureCard from "@/components/FeatureCard";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-mindease-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center animate-fade-down">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your Journey to<br />
            <span className="text-mindease-primary">Mental Wellness</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Connect with qualified mental health professionals who can help you navigate life's challenges.
          </p>
          <Link to="/register">
            <Button className="bg-mindease-primary hover:bg-mindease-primary/90 text-lg px-8 py-6 h-auto">
              GET READY TO EASE YOUR MIND
              <span className="ml-2">→</span>
            </Button>
          </Link>
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
    </div>
  );
};

export default Index;
