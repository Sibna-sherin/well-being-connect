import { useState, useEffect } from "react";
import AdminNavigation from "@/components/AdminNavigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Check, Search, X, Eye, FileCheck, AlertTriangle } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedDoctor, setSelectedDoctor] = useState(null); 
  const [selectedTab, setSelectedTab] = useState("all"); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [actionType, setActionType] = useState<"approve" | "reject" | "view">(
    "view"
  ); // Action type for dialog

  // Fetch doctors from Firestore
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "doctor"));
        const querySnapshot = await getDocs(q);
        const doctorsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID
          ...doc.data(), // Spread the document data
        }));
        console.log(doctorsData);
        setDoctors(doctorsData); // Set doctors state
      } catch (error) {
        console.error("Error fetching doctors: ", error);
        toast({
          title: "Error",
          description: "Failed to fetch doctors. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search term and selected tab
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedTab === "all") return matchesSearch;
    return doctor.status === selectedTab && matchesSearch;
  });

  // Handle approve action
  const handleApprove = (doctor) => {
    setSelectedDoctor(doctor);
    setActionType("approve");
    setDialogOpen(true);
  };

  // Handle reject action
  const handleReject = (doctor) => {
    setSelectedDoctor(doctor);
    setActionType("reject");
    setDialogOpen(true);
  };

  // Handle view details action
  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setActionType("view");
    setDialogOpen(true);
  };

  // Confirm action (approve/reject)
  const confirmAction = async () => {
    if (!selectedDoctor) return;

    try {
      const doctorRef = doc(db, "users", selectedDoctor.id);
      await updateDoc(doctorRef, {
        status: actionType === "approve" ? "approved" : "rejected",
      });

      // Update local state
      const updatedDoctors = doctors.map((doctor) =>
        doctor.id === selectedDoctor.id
          ? {
              ...doctor,
              status: actionType === "approve" ? "approved" : "rejected",
            }
          : doctor
      );
      setDoctors(updatedDoctors);
      setDialogOpen(false);

      // Show toast notification
      toast({
        title: `Doctor ${actionType === "approve" ? "approved" : "rejected"}`,
        description: `${selectedDoctor.name}'s registration has been ${
          actionType === "approve" ? "approved" : "rejected"
        }.`,
        variant: actionType === "approve" ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error updating doctor status: ", error);
      toast({
        title: "Error",
        description: "Failed to update doctor status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get status badge based on doctor status
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-mindease-background">
      <AdminNavigation />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-2">
          Doctor Registration Management
        </h1>
        <p className="text-gray-600 mb-8">
          Review and approve healthcare provider applications
        </p>

        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Doctor Registrations</CardTitle>
            <CardDescription>
              Review doctor credentials and approve or reject applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-auto flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        No doctor registrations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <TableRow
                        key={doctor.id}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {doctor.name}
                        </TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>{doctor.date}</TableCell>
                        <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(doctor)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>

                            {doctor.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApprove(doctor)}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4" />
                                  <span className="sr-only">Approve</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReject(doctor)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Reject</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialog for Actions */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          {actionType === "view" && selectedDoctor && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Doctor Details</AlertDialogTitle>
                <AlertDialogDescription>
                  Full information and credentials
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="font-medium">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="text-sm">{selectedDoctor.name}</div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="text-sm">{selectedDoctor.email}</div>
                      <div className="text-sm text-gray-500">Specialty</div>
                      <div className="text-sm">{selectedDoctor.specialty}</div>
                      <div className="text-sm text-gray-500">Experience</div>
                      <div className="text-sm">{selectedDoctor.experience}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Credentials</h3>
                    <ul className="list-disc ml-5 mt-2">
                      {selectedDoctor.credentials?.map((credential, index) => (
                        <li key={index} className="text-sm">
                          {credential}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                {selectedDoctor.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setActionType("reject");
                        confirmAction();
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setActionType("approve");
                        confirmAction();
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </>
                )}
              </AlertDialogFooter>
            </>
          )}

          {actionType === "approve" && selectedDoctor && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve Doctor</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to approve {selectedDoctor.name}'s
                  registration? They will be able to offer services on the
                  platform.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-2 flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-green-600" />
                <span className="text-sm">
                  All credentials have been verified
                </span>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmAction}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {actionType === "reject" && selectedDoctor && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Doctor</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject {selectedDoctor.name}'s
                  registration? They will be notified of this decision.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-2 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                <span className="text-sm">
                  This action cannot be easily undone
                </span>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmAction}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DoctorManagement;
