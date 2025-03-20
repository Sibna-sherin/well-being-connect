import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase"; // Adjust the path accordingly
import DoctorNavigation from "@/components/DoctorNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: string; // Use string for Firestore document IDs
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  status: "active" | "inactive";
  notes?: string;
}

const DoctorPatients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsSnapshot = await getDocs(collection(db, "patients"));
        const patientsData = patientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Patient[];
        setPatients(patientsData);
      } catch (error) {
        console.error("Error fetching patients: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    return patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mindease-background pb-12">
        <DoctorNavigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mindease-background pb-12">
      <DoctorNavigation />
      
      <div className="container mx-auto px-4 pt-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patients</h1>
            <p className="text-gray-600">Manage your patient records</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10 w-full md:w-64"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => alert('cooming soon')} className="bg-mindease-primary hover:bg-mindease-primary/90 flex items-center gap-2">
              <Plus size={16} />
              Add Patient
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <Card key={patient.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row border-b">
                        <div className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-lg font-semibold">{patient.name}</h3>
                                {patient.status === "active" ? (
                                  <Badge className="ml-2 bg-green-100 text-green-800 border-none">Active</Badge>
                                ) : (
                                  <Badge className="ml-2 bg-gray-100 text-gray-800 border-none">Inactive</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                {patient.age} years • {patient.gender}
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <p className="text-sm">
                                <span className="text-gray-500">Last visit: </span>
                                <span className="font-medium">{formatDate(patient.lastVisit)}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <span className="text-sm text-gray-500">Condition: </span>
                            <span className="font-medium">{patient.condition}</span>
                          </div>
                          
                          {patient.notes && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">Notes: </span>
                              <span>{patient.notes}</span>
                            </div>
                          )}
                          
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              View Records
                            </Button>
                            <Button size="sm" className="bg-mindease-primary hover:bg-mindease-primary/90">
                              Add Notes
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No patients found</h3>
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
          </TabsContent>
          
          <TabsContent value="active">
            <div className="space-y-4">
              {filteredPatients
                .filter(patient => patient.status === "active")
                .map(patient => (
                  <Card key={patient.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row border-b">
                        <div className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-lg font-semibold">{patient.name}</h3>
                                <Badge className="ml-2 bg-green-100 text-green-800 border-none">Active</Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                {patient.age} years • {patient.gender}
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <p className="text-sm">
                                <span className="text-gray-500">Last visit: </span>
                                <span className="font-medium">{formatDate(patient.lastVisit)}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <span className="text-sm text-gray-500">Condition: </span>
                            <span className="font-medium">{patient.condition}</span>
                          </div>
                          
                          {patient.notes && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">Notes: </span>
                              <span>{patient.notes}</span>
                            </div>
                          )}
                          
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              View Records
                            </Button>
                            <Button size="sm" className="bg-mindease-primary hover:bg-mindease-primary/90">
                              Add Notes
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {filteredPatients.filter(patient => patient.status === "active").length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No active patients found</h3>
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
          </TabsContent>
          
          <TabsContent value="inactive">
            <div className="space-y-4">
              {filteredPatients
                .filter(patient => patient.status === "inactive")
                .map(patient => (
                  <Card key={patient.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row border-b">
                        <div className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-lg font-semibold">{patient.name}</h3>
                                <Badge className="ml-2 bg-gray-100 text-gray-800 border-none">Inactive</Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                {patient.age} years • {patient.gender}
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <p className="text-sm">
                                <span className="text-gray-500">Last visit: </span>
                                <span className="font-medium">{formatDate(patient.lastVisit)}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <span className="text-sm text-gray-500">Condition: </span>
                            <span className="font-medium">{patient.condition}</span>
                          </div>
                          
                          {patient.notes && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">Notes: </span>
                              <span>{patient.notes}</span>
                            </div>
                          )}
                          
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              View Records
                            </Button>
                            <Button size="sm" className="bg-mindease-primary hover:bg-mindease-primary/90">
                              Reactivate
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {filteredPatients.filter(patient => patient.status === "inactive").length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No inactive patients found</h3>
                  <p className="text-gray-600 mb-4">All your patients are currently active</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorPatients;