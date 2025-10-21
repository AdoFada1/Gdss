import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Staff } from '@shared/types';
const staffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  title: z.string().min(3, 'Title is required.'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters.').optional().or(z.literal('')),
  photoUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});
type StaffFormData = z.infer<typeof staffSchema>;
interface AddEditStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StaffFormData, id?: string) => void;
  staffMember?: Staff | null;
  isSaving: boolean;
}
export function AddEditStaffDialog({ isOpen, onClose, onSave, staffMember, isSaving }: AddEditStaffDialogProps) {
  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: staffMember?.name || '',
      email: staffMember?.email || '',
      title: staffMember?.title || '',
      phone: staffMember?.phone || '',
      password: '',
      photoUrl: staffMember?.photoUrl || '',
    },
  });
  const handleSave = (data: StaffFormData) => {
    onSave(data, staffMember?.id);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{staffMember ? 'Edit Staff Member' : 'Add New Staff'}</DialogTitle>
          <DialogDescription>
            {staffMember ? 'Update the details for this staff member.' : 'Enter the details for the new staff member.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jane.smith@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title / Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathematics Teacher" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/photo.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={staffMember ? 'Leave blank to keep current' : 'Set initial password'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand hover:bg-brand/90" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Staff'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}