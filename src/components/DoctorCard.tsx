
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface Doctor {
  id: any;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  specialtyId: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          <div className="relative">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              className="w-full h-48 object-cover object-center"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center text-white">
                <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4 mr-1" />
                <span className="font-medium">{doctor.rating}</span>
                <span className="text-xs ml-1 opacity-80">({doctor.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{doctor.specialty}</p>
            
            <Link to={`/doctor/${doctor.id}`}>
              <Button className="w-full bg-mindease-primary hover:bg-mindease-primary/90">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
