import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Clock, Users } from "lucide-react";

export interface Student {
  id: string;
  name: string;
  email: string;
  photo?: string;
  class: string;
  isPresent: boolean;
  scanTime?: Date;
}

interface AttendanceListProps {
  students: Student[];
  onStudentUpdate: (students: Student[]) => void;
}

export const AttendanceList = ({ students, onStudentUpdate }: AttendanceListProps) => {
  const presentCount = students.filter(s => s.isPresent).length;
  const totalCount = students.length;
  const attendanceRate = totalCount > 0 ? (presentCount / totalCount * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Attendance Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Attendance Overview</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{presentCount}/{totalCount} Present</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <div className="text-2xl font-bold text-success">{presentCount}</div>
            <div className="text-sm text-muted-foreground">Present</div>
          </div>
          <div className="text-center p-4 bg-warning/10 rounded-lg">
            <div className="text-2xl font-bold text-warning">{totalCount - presentCount}</div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">{attendanceRate}%</div>
            <div className="text-sm text-muted-foreground">Attendance Rate</div>
          </div>
        </div>
      </Card>

      {/* Student List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Student List</h3>
        
        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                student.isPresent 
                  ? "bg-success/5 border-success/20" 
                  : "bg-muted/50 border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={student.photo} alt={student.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-medium text-foreground">{student.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {student.id} • {student.class}
                  </div>
                  {student.scanTime && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      Scanned at {student.scanTime.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {student.isPresent ? (
                  <Badge variant="default" className="bg-success text-success-foreground gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Present
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-muted-foreground">
                    Absent
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};