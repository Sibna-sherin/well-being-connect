
import { Brain, UserCog, UserRound, HeartHandshake, Baby, Bomb, Wine, Brain as BrainIcon, Leaf, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface SpecialtyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const SpecialtyCard = ({ icon, title, description, delay = 0 }: SpecialtyCardProps) => {
  return (
    <Link 
      to="/specialties" 
      className={`flex flex-col items-center p-5 text-center hover:scale-105 transition-all duration-300 animate-fade-up`} 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
        <div className="text-mindease-primary">{icon}</div>
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
};

const SpecialtiesSection = () => {
  return (
    <section className="py-16 px-4 bg-mindease-background">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-3">Find by Speciality</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Simply browse through our extensive list of trusted mental health professionals, schedule your appointment hassle-free.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <SpecialtyCard 
            icon={<Brain size={36} />} 
            title="Psychologists" 
            description="Therapy and counseling"
            delay={0}
          />
          <SpecialtyCard 
            icon={<UserCog size={36} />} 
            title="Psychiatrists" 
            description="Medical diagnosis and treatment"
            delay={100}
          />
          <SpecialtyCard 
            icon={<UserRound size={36} />} 
            title="Therapists" 
            description="General mental health support"
            delay={200}
          />
          <SpecialtyCard 
            icon={<HeartHandshake size={36} />} 
            title="Counselors" 
            description="Career, relationship, and personal counseling"
            delay={300}
          />
          <SpecialtyCard 
            icon={<Baby size={36} />} 
            title="Child Psychologists" 
            description="Support for children's mental health"
            delay={400}
          />
          <SpecialtyCard 
            icon={<Bomb size={36} />} 
            title="Trauma Specialists" 
            description="PTSD and trauma recovery assistance"
            delay={500}
          />
          <SpecialtyCard 
            icon={<Wine size={36} />} 
            title="Addiction Specialists" 
            description="Support for substance abuse issues"
            delay={600}
          />
          <SpecialtyCard 
            icon={<BrainIcon size={36} />} 
            title="CBT Therapists" 
            description="Specialized cognitive therapy"
            delay={700}
          />
          <SpecialtyCard 
            icon={<Leaf size={36} />} 
            title="Mindfulness Coaches" 
            description="Meditation and stress relief guidance"
            delay={800}
          />
          <SpecialtyCard 
            icon={<Sparkles size={36} />} 
            title="Life Coaches" 
            description="Personal growth and motivation"
            delay={900}
          />
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
