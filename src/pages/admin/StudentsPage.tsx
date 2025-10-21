import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Trash2, Edit, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/lib/api-client';
import type { Student } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from '@/components/ui/sonner';
import { AddEditStudentDialog } from '@/components/AddEditStudentDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await api<{ items: Student[] }>('/api/students');
      setStudents(data.items);
    } catch (error) {
      toast.error('Failed to fetch students.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);
  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsDialogOpen(true);
  };
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsDialogOpen(true);
  };
  const handleSaveStudent = async (data: Omit<Student, 'id' | 'role'>, id?: string) => {
    setIsSaving(true);
    try {
      if (id) {
        await api(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        toast.success('Student updated successfully.');
      } else {
        await api('/api/students', { method: 'POST', body: JSON.stringify(data) });
        toast.success('Student added successfully.');
      }
      setIsDialogOpen(false);
      fetchStudents();
    } catch (error) {
      toast.error(`Failed to ${id ? 'update' : 'add'} student.`);
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteStudent = async (id: string) => {
    try {
      await api(`/api/students/${id}`, { method: 'DELETE' });
      toast.success('Student deleted successfully.');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student.');
    }
  };
  const dialogStudent = useMemo(() => editingStudent, [editingStudent]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Students</h1>
            <p className="mt-2 text-lg text-muted-foreground">Manage student records for the school.</p>
          </div>
          <Button className="bg-brand hover:bg-brand/90" onClick={handleAddStudent}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>A list of all students currently enrolled.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.photoUrl} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell><Badge variant="secondary">{student.class}</Badge></TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditStudent(student)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the student record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteStudent(student.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Users className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">No Students Found</h3>
                        <p className="text-muted-foreground">Get started by adding a new student record.</p>
                        <Button className="mt-2 bg-brand hover:bg-brand/90" onClick={handleAddStudent}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Student
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {isDialogOpen && (
        <AddEditStudentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveStudent}
          student={dialogStudent}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}