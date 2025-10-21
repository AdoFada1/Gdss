import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from '@/lib/api-client';
import type { Result, Student } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from '@/components/ui/sonner';
import { AddEditResultDialog } from '@/components/AddEditResultDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
export default function ManageResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const studentMap = useMemo(() => new Map(students.map(s => [s.id, s.name])), [students]);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [resultsData, studentsData] = await Promise.all([
        api<{ items: Result[] }>('/api/results'),
        api<{ items: Student[] }>('/api/students'),
      ]);
      setResults(resultsData.items);
      setStudents(studentsData.items);
    } catch (error) {
      toast.error('Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleAddResult = () => {
    setEditingResult(null);
    setIsDialogOpen(true);
  };
  const handleEditResult = (result: Result) => {
    setEditingResult(result);
    setIsDialogOpen(true);
  };
  const handleSaveResult = async (data: Omit<Result, 'id'>, id?: string) => {
    setIsSaving(true);
    try {
      if (id) {
        await api(`/api/results/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        toast.success('Result updated successfully.');
      } else {
        await api('/api/results', { method: 'POST', body: JSON.stringify(data) });
        toast.success('Result added successfully.');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${id ? 'update' : 'add'} result.`);
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteResult = async (id: string) => {
    try {
      await api(`/api/results/${id}`, { method: 'DELETE' });
      toast.success('Result deleted successfully.');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete result.');
    }
  };
  const dialogResult = useMemo(() => editingResult, [editingResult]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Results</h1>
            <p className="mt-2 text-lg text-muted-foreground">Add, view, and edit student academic results.</p>
          </div>
          <Button className="bg-brand hover:bg-brand/90" onClick={handleAddResult}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Result
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Academic Records</CardTitle>
            <CardDescription>A list of all student results entered.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : results.length > 0 ? (
                  results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{studentMap.get(result.studentId) || 'Unknown Student'}</TableCell>
                      <TableCell>{result.subject}</TableCell>
                      <TableCell>{result.score}</TableCell>
                      <TableCell>{result.grade || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">{result.remarks || 'N/A'}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditResult(result)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this result.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteResult(result.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <h3 className="text-xl font-semibold">No Results Found</h3>
                        <p className="text-muted-foreground">
                          Get started by adding the first academic result.
                        </p>
                        <Button className="mt-4 bg-brand hover:bg-brand/90" onClick={handleAddResult}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Result
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
        <AddEditResultDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveResult}
          result={dialogResult}
          students={students}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}