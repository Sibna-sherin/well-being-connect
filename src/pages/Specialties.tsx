
import UserNavigation from "@/components/UserNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, UserCog, UserRound, HeartHandshake, Baby, Bomb, Wine, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Specialty {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string;
}

const specialties: Specialty[] = [
  {
    id: 1,
    title: "Psychologists",
    description: "Therapy and counseling",
    icon: <Brain size={36} />,
    details: "Psychologists help patients deal with mental health issues, emotional problems, and behavioral challenges through various therapeutic approaches."
  },
  {
    id: 2,
    title: "Psychiatrists",
    description: "Medical diagnosis and treatment",
    icon: <UserCog size={36} />,
    details: "Psychiatrists are medical doctors who specialize in mental health, including substance use disorders, and can prescribe medications."
  },
  {
    id: 3,
    title: "Therapists",
    description: "General mental health support",
    icon: <UserRound size={36} />,
    details: "Therapists provide support and guidance to help individuals navigate life challenges and improve their overall mental well-being."
  },
  {
    id: 4,
    title: "Counselors",
    description: "Career, relationship, and personal counseling",
    icon: <HeartHandshake size={36} />,
    details: "Counselors help with specific life issues such as career transitions, relationship difficulties, or grief processing."
  },
  {
    id: 5,
    title: "Child Psychologists",
    description: "Support for children's mental health",
    icon: <Baby size={36} />,
    details: "Child psychologists specialize in diagnosing and treating mental, emotional, and social issues specific to children and adolescents."
  },
  {
    id: 6,
    title: "Trauma Specialists",
    description: "PTSD and trauma recovery assistance",
    icon: <Bomb size={36} />,
    details: "Trauma specialists focus on helping individuals recover from traumatic experiences, PTSD, and related conditions."
  },
  {
    id: 7,
    title: "Addiction Specialists",
    description: "Support for substance abuse issues",
    icon: <Wine size={36} />,
    details: "Addiction specialists help individuals overcome substance dependencies and develop healthier coping mechanisms."
  },
  {
    id: 8,
    title: "CBT Therapists",
    description: "Specialized cognitive therapy",
    icon: <Brain size={36} />,
    details: "Cognitive Behavioral Therapists help change patterns of thinking or behavior to improve coping with life's challenges."
  },
  {
    id: 9,
    title: "Mindfulness Coaches",
    description: "Meditation and stress relief guidance",
    icon: <Leaf size={36} />,
    details: "Mindfulness coaches teach techniques to reduce stress, increase focus, and cultivate a greater awareness of the present moment."
  },
  {
    id: 10,
    title: "Life Coaches",
    description: "Personal growth and motivation",
    icon: <Sparkles size={36} />,
    details: "Life coaches help clients identify goals and develop action plans to achieve personal and professional growth."
  }
];

const Specialties = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

  return (
    <div className="min-h-screen bg-mindease-background pb-12">
      <UserNavigation />
      
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-2">Mental Health Specialties</h1>
        <p className="text-gray-600 mb-8">Browse our range of mental health professionals and find the right specialist for your needs</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => (
            <Card key={specialty.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-12 h-12 bg-mindease-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-mindease-primary">{specialty.icon}</div>
                </div>
                <div>
                  <CardTitle className="text-xl">{specialty.title}</CardTitle>
                  <CardDescription>{specialty.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{specialty.details}</p>
                <Button 
                  className="w-full bg-mindease-primary hover:bg-mindease-primary/90"
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  Find Specialists
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Specialties;
