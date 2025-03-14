
import { useState } from "react";
import DoctorNavigation from "@/components/DoctorNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { BadgeDollarSign } from "lucide-react";

interface DayAvailability {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const DoctorAvailability = () => {
  const [consultationFee, setConsultationFee] = useState(150);
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({
    monday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    tuesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    wednesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    thursday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    friday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    saturday: { enabled: false, startTime: "10:00", endTime: "14:00" },
    sunday: { enabled: false, startTime: "10:00", endTime: "14:00" },
  });

  const handleDayToggle = (day: string) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        enabled: !availability[day].enabled
      }
    });
  };

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value
      }
    });
  };

  const handleFeeChange = (values: number[]) => {
    setConsultationFee(values[0]);
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your availability and fee settings have been updated."
    });
  };

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <div className="min-h-screen bg-mindease-background pb-12">
      <DoctorNavigation />
      
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-2">Availability & Fees</h1>
        <p className="text-gray-600 mb-8">Manage your working hours and consultation charges</p>
        
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {days.map((day) => (
                  <div key={day.key} className="flex items-center space-x-4">
                    <div className="w-32">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={availability[day.key].enabled}
                          onCheckedChange={() => handleDayToggle(day.key)}
                        />
                        <Label>{day.label}</Label>
                      </div>
                    </div>
                    
                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        type="time"
                        value={availability[day.key].startTime}
                        onChange={(e) => handleTimeChange(day.key, 'startTime', e.target.value)}
                        disabled={!availability[day.key].enabled}
                        className="w-32"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={availability[day.key].endTime}
                        onChange={(e) => handleTimeChange(day.key, 'endTime', e.target.value)}
                        disabled={!availability[day.key].enabled}
                        className="w-32"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Fee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center text-4xl font-bold text-mindease-primary mb-2">
                    <BadgeDollarSign className="h-8 w-8 mr-1" />
                    <span>{consultationFee}</span>
                  </div>
                  <p className="text-sm text-gray-500">per session</p>
                </div>
                
                <div className="px-2">
                  <Slider
                    value={[consultationFee]}
                    min={50}
                    max={300}
                    step={5}
                    onValueChange={handleFeeChange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>$50</span>
                    <span>$300</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="w-full py-6">30 min</Button>
                  <Button className="w-full py-6 bg-mindease-primary hover:bg-mindease-primary/90">45 min</Button>
                  <Button variant="outline" className="w-full py-6">60 min</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-mindease-primary hover:bg-mindease-primary/90 px-8"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;
