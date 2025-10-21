import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Trash2, Edit, UserCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/lib/api-client';
import type { Staff } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from '@/components/ui/sonner';
import { AddEditStaffDialog } from '@/components/AddEditStaffDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const data = await api<{ items: Staff[] }>('/api/staff');
      setStaff(data.items);
    } catch (error) {
      toast.error('Failed to fetch staff members.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchStaff();
  }, []);
  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsDialogOpen(true);
  };
  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setIsDialogOpen(true);
  };
  const handleSaveStaff = async (data: Omit<Staff, 'id' | 'role'>, id?: string) => {
    setIsSaving(true);
    try {
      if (id) {
        await api(`/api/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        toast.success('Staff member updated successfully.');
      } else {
        await api('/api/staff', { method: 'POST', body: JSON.stringify(data) });
        toast.success('Staff member added successfully.');
      }
      setIsDialogOpen(false);
      fetchStaff();
    } catch (error) {
      toast.error(`Failed to ${id ? 'update' : 'add'} staff member.`);
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteStaff = async (id: string) => {
    try {
      await api(`/api/staff/${id}`, { method: 'DELETE' });
      toast.success('Staff member deleted successfully.');
      fetchStaff();
    } catch (error) {
      toast.error('Failed to delete staff member.');
    }
  };
  const dialogStaff = useMemo(() => editingStaff, [editingStaff]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff</h1>
            <p className="mt-2 text-lg text-muted-foreground">Manage staff member records for the school.</p>
          </div>
          <Button className="bg-brand hover:bg-brand/90" onClick={handleAddStaff}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Staff List</CardTitle>
            <CardDescription>A list of all staff members.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : staff.length > 0 ? (
                  staff.map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={staffMember.photoUrl} alt={staffMember.name} />
                          <AvatarFallback>{staffMember.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{staffMember.name}</TableCell>
                      <TableCell>{staffMember.title}</TableCell>
                      <TableCell>{staffMember.email}</TableCell>
                      <TableCell>{staffMember.phone || 'N/A'}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditStaff(staffMember)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the staff member's record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteStaff(staffMember.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
                        <UserCheck className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">No Staff Found</h3>
                        <p className="text-muted-foreground">Get started by adding a new staff member.</p>
                        <Button className="mt-2 bg-brand hover:bg-brand/90" onClick={handleAddStaff}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Staff
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
        <AddEditStaffDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveStaff}
          staffMember={dialogStaff}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}