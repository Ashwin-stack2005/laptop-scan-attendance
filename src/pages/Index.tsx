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
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-primary-foreground">
              <div className="bg-white/20 p-3 rounded-2xl">
                <GraduationCap className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome to Class! 👋</h1>
                <p className="text-primary-foreground/90 text-lg">Let's mark your attendance together</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-primary-foreground/90">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">{currentDate}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">CS Year 3</span>
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
            <Card className="p-6 bg-gradient-to-br from-card to-secondary/30 border-0 shadow-warm">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                📊 Today's Progress
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-xl">
                  <div className="text-3xl font-bold text-success mb-1">
                    {students.filter(s => s.isPresent).length}
                  </div>
                  <div className="text-sm font-medium text-success/80">Students Here! 🎉</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {students.length}
                  </div>
                  <div className="text-sm font-medium text-primary/80">Total Class 👥</div>
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
