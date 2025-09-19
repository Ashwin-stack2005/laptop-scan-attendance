import { useState } from "react";
import { CameraScanner } from "@/components/CameraScanner";
import { AttendanceList, Student } from "@/components/AttendanceList";
import { mockStudents } from "@/data/mockStudents";
import { Card } from "@/components/ui/card";
import { GraduationCap, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanResult = (scannedId: string) => {
    const studentIndex = students.findIndex(s => s.id === scannedId);
    
    if (studentIndex !== -1) {
      const updatedStudents = [...students];
      const student = updatedStudents[studentIndex];
      
      if (!student.isPresent) {
        updatedStudents[studentIndex] = {
          ...student,
          isPresent: true,
          scanTime: new Date()
        };
        setStudents(updatedStudents);
        toast.success(`${student.name} marked as present!`);
      } else {
        toast.info(`${student.name} is already marked as present.`);
      }
    } else {
      toast.error(`Student ID ${scannedId} not found in the system.`);
    }
  };

  const handleStudentUpdate = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary to-accent shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary-foreground">
              <GraduationCap className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Attendance System</h1>
                <p className="text-primary-foreground/80 text-sm">Smart ID Card Scanner</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-primary-foreground/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{currentDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">CS Year 3</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div className="space-y-6">
            <CameraScanner 
              onScanResult={handleScanResult}
              isScanning={isScanning}
              setIsScanning={setIsScanning}
            />

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {students.filter(s => s.isPresent).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Present Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {students.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Attendance List Section */}
          <div>
            <AttendanceList 
              students={students}
              onStudentUpdate={handleStudentUpdate}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
