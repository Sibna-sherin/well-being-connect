
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import UserNavigation from "@/components/UserNavigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import DoctorCard from "@/components/DoctorCard";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  specialtyId: string;
  education?: string;
  experience?: string;
}

const doctorsData: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Psychologist",
    rating: 4.9,
    reviews: 124,
    image: "/lovable-uploads/14fee741-0aa3-4eaa-9c4f-62d516b188a4.png",
    specialtyId: "psychologists",
    education: "PhD in Psychology, Harvard University",
    experience: "10+ years in clinical psychology"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Psychiatrist",
    rating: 4.8,
    reviews: 98,
    image: "/lovable-uploads/2c9db039-703a-4cba-8db3-60741bc93a3f.png",
    specialtyId: "psychiatrists",
    education: "MD, University of California",
    experience: "12+ years in psychiatric care"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Therapist",
    rating: 4.7,
    reviews: 87,
    image: "/lovable-uploads/14fee741-0aa3-4eaa-9c4f-62d516b188a4.png",
    specialtyId: "therapists",
    education: "MSc in Psychotherapy, Columbia University",
    experience: "8+ years in therapy practice"
  },
  {
    id: 4,
    name: "Dr. David Kim",
    specialty: "CBT Specialist",
    rating: 4.9,
    reviews: 112,
    image: "/lovable-uploads/2c9db039-703a-4cba-8db3-60741bc93a3f.png",
    specialtyId: "cbt-therapists",
    education: "PhD in Psychology, Yale University",
    experience: "15+ years in cognitive behavioral therapy"
  },
  {
    id: 5,
    name: "Dr. Jennifer Lee",
    specialty: "Child Psychologist",
    rating: 4.8,
    reviews: 75,
    image: "/lovable-uploads/14fee741-0aa3-4eaa-9c4f-62d516b188a4.png",
    specialtyId: "child-psychologists",
    education: "PhD in Child Psychology, Stanford University",
    experience: "11+ years specializing in children's mental health"
  },
  {
    id: 6,
    name: "Dr. Robert Wilson",
    specialty: "Addiction Specialist",
    rating: 4.6,
    reviews: 93,
    image: "/lovable-uploads/2c9db039-703a-4cba-8db3-60741bc93a3f.png",
    specialtyId: "addiction-specialists",
    education: "MD with Addiction Medicine Fellowship, Johns Hopkins",
    experience: "14+ years helping patients with addiction recovery"
  },
  {
    id: 7,
    name: "Dr. Lisa Martinez",
    specialty: "Trauma Specialist",
    rating: 4.9,
    reviews: 102,
    image: "/lovable-uploads/14fee741-0aa3-4eaa-9c4f-62d516b188a4.png",
    specialtyId: "trauma-specialists",
    education: "PhD in Clinical Psychology, University of Washington",
    experience: "13+ years in trauma therapy and PTSD treatment"
  },
  {
    id: 8,
    name: "Dr. James Williams",
    specialty: "Mindfulness Coach",
    rating: 4.7,
    reviews: 68,
    image: "/lovable-uploads/2c9db039-703a-4cba-8db3-60741bc93a3f.png",
    specialtyId: "mindfulness-coaches",
    education: "PhD in Psychology with focus on Mindfulness, Brown University",
    experience: "9+ years teaching mindfulness practices"
  },
];

const DoctorsList = () => {
  const { specialty } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter doctors based on specialty param and search query
  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSpecialty = !specialty || doctor.specialtyId === specialty;
    const matchesSearch = !searchQuery || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSpecialty && matchesSearch;
  });

  // Get specialty title from path parameter
  const getSpecialtyTitle = () => {
    if (!specialty) return "All Specialists";
    
    const specialtyMap: Record<string, string> = {
      "psychologists": "Psychologists",
      "psychiatrists": "Psychiatrists",
      "therapists": "Therapists",
      "counselors": "Counselors",
      "child-psychologists": "Child Psychologists",
      "trauma-specialists": "Trauma Specialists",
      "addiction-specialists": "Addiction Specialists",
      "cbt-therapists": "CBT Therapists",
      "mindfulness-coaches": "Mindfulness Coaches",
      "life-coaches": "Life Coaches"
    };
    
    return specialtyMap[specialty] || "Specialists";
  };

  return (
    <div className="min-h-screen bg-mindease-background pb-12">
      <UserNavigation />
      
      <div className="container mx-auto px-4 pt-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{getSpecialtyTitle()}</h1>
            <p className="text-gray-600">
              {filteredDoctors.length} professionals available
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10 w-full sm:w-64"
                placeholder="Search by name or specialty"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal size={18} />
              Filters
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2">No specialists found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
              <Button 
                className="bg-mindease-primary hover:bg-mindease-primary/90"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
