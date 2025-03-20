import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserNavigation from "@/components/UserNavigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Doctor {
  id: string; // Firestore document ID
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  specialtyId: string;
  education?: string;
  experience?: string;
  role: string; // Ensure the role is included
}

const DoctorsList = () => {
  const { specialty } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors from Firestore
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const usersCollection = collection(db, "users");
        let q = query(usersCollection, where("role", "==", "doctor")); // Filter by role == "doctor"

        // Filter by specialty if provided
        if (specialty) {
          q = query(usersCollection, where("role", "==", "doctor"), where("specialty", "==", specialty));
        }

        const querySnapshot = await getDocs(q);
        const doctorsData: Doctor[] = [];
        querySnapshot.forEach((doc) => {
          doctorsData.push({ id: doc.id, ...doc.data() } as Doctor);
        });
        console.log(doctorsData);
        setDoctors(doctorsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to fetch doctors. Please try again later.");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialty]);

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      !searchQuery ||
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Get specialty title from path parameter
  const getSpecialtyTitle = () => {
    if (!specialty) return "All Specialists";

    const specialtyMap: Record<string, string> = {
      psychologists: "Psychologists",
      psychiatrists: "Psychiatrists",
      therapists: "Therapists",
      counselors: "Counselors",
      "child-psychologists": "Child Psychologists",
      "trauma-specialists": "Trauma Specialists",
      "addiction-specialists": "Addiction Specialists",
      "cbt-therapists": "CBT Therapists",
      "mindfulness-coaches": "Mindfulness Coaches",
      "life-coaches": "Life Coaches",
    };

    return specialtyMap[specialty] || "Specialists";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mindease-background pb-12">
        <UserNavigation />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p>Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mindease-background pb-12">
        <UserNavigation />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

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