import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/lib/api-client';
import type { Student } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from '@/components/ui/sonner';
export default function MyStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await api<{ items: Student[] }>('/api/students');
        // In a real app, this would be filtered by staff assignment
        setStudents(data.items);
      } catch (error) {
        toast.error('Failed to fetch students.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <div className="py-8 md:py-10 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Students</h1>
          <p className="mt-2 text-lg text-muted-foreground">View details of students in your classes.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>A list of all students assigned to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Avatar</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-md" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                    </TableRow>
                  ))
                ) : students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.photoUrl} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell><Badge variant="outline">{student.class}</Badge></TableCell>
                      <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}