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
    <div className="space-y-8">
      {/* Attendance Summary */}
      <Card className="p-8 bg-gradient-to-br from-card to-secondary/20 border-0 shadow-warm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            👥 How's the class doing?
          </h2>
          <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-full">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">{presentCount}/{totalCount} friends here!</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-2xl border border-success/10">
            <div className="text-3xl font-bold text-success">{presentCount}</div>
            <div className="text-sm font-medium text-success/80">Here Today! 🎉</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl border border-warning/10">
            <div className="text-3xl font-bold text-warning">{totalCount - presentCount}</div>
            <div className="text-sm font-medium text-warning/80">Missing Out 😢</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/10">
            <div className="text-3xl font-bold text-primary">{attendanceRate}%</div>
            <div className="text-sm font-medium text-primary/80">Class Spirit! 💪</div>
          </div>
        </div>
      </Card>

      {/* Student List */}
      <Card className="p-8 bg-gradient-to-br from-card to-secondary/20 border-0 shadow-warm">
        <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          📚 Your Classmates
        </h3>
        
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className={`flex items-center justify-between p-6 rounded-2xl transition-all duration-300 hover:shadow-md ${
                student.isPresent 
                  ? "bg-gradient-to-r from-success/5 to-success/10 border border-success/20 shadow-sm" 
                  : "bg-gradient-to-r from-muted/30 to-muted/50 border border-border/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-14 h-14 ring-2 ring-white shadow-md">
                    <AvatarImage src={student.photo} alt={student.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {student.isPresent && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="font-semibold text-foreground text-lg">{student.name}</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    ID: {student.id} • {student.class}
                  </div>
                  {student.scanTime && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 bg-white/50 px-2 py-1 rounded-full w-fit">
                      <Clock className="w-3 h-3" />
                      Joined at {student.scanTime.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {student.isPresent ? (
                  <Badge variant="default" className="bg-success text-success-foreground gap-2 px-4 py-2 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    🎉 Here!
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-muted-foreground px-4 py-2 text-sm font-semibold">
                    😴 Away
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